import React, { useState, useRef, useEffect } from 'react';
import { verifyOTP } from '../utils/registerUser';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OTPVerificationModal = ({ isOpen, onClose, userId, userEmail, onVerificationSuccess, password }) => {
  const [emailOTP, setEmailOTP] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  // console.log(userId)

  const emailInputRefs = useRef([]);
  const smsInputRefs = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOTPChange = (value, index, type) => {
    if (!/^\d*$/.test(value)) return;

    const newOTP = type === 'email' ? [...emailOTP] : [...smsOTP];
    newOTP[index] = value;

    if (type === 'email') {
      setEmailOTP(newOTP);
    }

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = type === 'email' ? emailInputRefs.current[index + 1] : smsInputRefs.current[index + 1];
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e, index, type) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      const prevInput = type === 'email' ? emailInputRefs.current[index - 1] : smsInputRefs.current[index - 1];
      prevInput?.focus();
    }
  };

  const handlePaste = (e, type) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOTP = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    
    if (type === 'email') {
      setEmailOTP(newOTP);
    } else {
      setSmsOTP(newOTP);
    }
  };

  const handleVerifyOTP = async () => {
    const emailOTPString = emailOTP.join('');
    console.log(emailOTPString, userId)

    if (emailOTPString.length !== 6 ) {
      setError('Please enter 6-digit OTP code');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyOTP({
        userId,
        emailOTP: emailOTPString,
        userEmail,
        password,
        login,
        navigate
      });

      onVerificationSuccess(result);
      onClose();
    } catch (error) {
      setError(error.response?.data?.message || 'OTP verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    setResendCooldown(60);
    // Here you would typically call an API to resend OTP
    console.log('Resending OTP...');
  };

  const renderOTPInputs = (otp, setOTP, type, refs) => (
    <div className="flex justify-center space-x-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={el => refs.current[index] = el}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleOTPChange(e.target.value, index, type)}
          onKeyDown={(e) => handleKeyDown(e, index, type)}
          onPaste={(e) => handlePaste(e, type)}
          className="md:w-12 md:h-12 h-8 w-8 text-center text-xs md:text-xl font-bold bg-gray-800 border-2 border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        />
      ))}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Verify Your Account</h2>
          <p className="text-gray-400">We've sent verification codes to your email and phone</p>
        </div>

        {/* Email OTP Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-white">Email Verification</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">Enter the 6-digit code sent to {userEmail}</p>
          {renderOTPInputs(emailOTP, setEmailOTP, 'email', emailInputRefs)}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500 rounded-xl text-red-400 text-sm">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleVerifyOTP}
            disabled={isVerifying}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Verifying...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify Account
              </div>
            )}
          </button>

          <div className="flex justify-between items-center">
            <button
              onClick={handleResendOTP}
              disabled={resendCooldown > 0}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
            </button>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white font-medium transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;