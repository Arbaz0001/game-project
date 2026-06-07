import React, { useState } from "react";
import FormInput from "../components/FormInput";
import PhoneInput from "../components/PhoneInput";
import PasswordInput from "../components/PasswordInput";
import OTPVerificationModal from "../components/OTPVerificationModel";
import { countryCodes } from "../utils/countryCodes";
import { registerUser } from "../utils/registerUser";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const refId = searchParams.get("ref");

  console.log("refId", refId);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    ref_by: refId || "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  console.log("registrationData", registrationData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear submit status when user makes changes
    if (submitStatus) {
      setSubmitStatus(null);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters long";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = "Name can only contain letters and spaces";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";
        } else {
          const country = countryCodes.find((c) => value.startsWith(c.code));
          if (!country) {
            error = "Invalid country code";
          } else if (!country.pattern.test(value)) {
            error = `Invalid phone number format for ${country.country}`;
          }
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters long";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Password must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Password must contain at least one uppercase letter";
        } else if (!/(?=.*[0-9])/.test(value)) {
          error = "Password must contain at least one number";
        } else if (!/(?=.*[^A-Za-z0-9])/.test(value)) {
          error = "Password must contain at least one special character";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return error === "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    if (validateForm()) {
      try {
        const registrationPayload = {
          fullName: formData.name,
          email: formData.email,
          phoneNumber: formData.phone,
          password: formData.password,
          ref_by: refId,
        };

        const result = await registerUser(registrationPayload);
        console.log(result);

        if (result) {
          // Store registration data for OTP verification
          setRegistrationData({
            userId: result.userId || result.id || result.data?._id,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            ref_by: refId,
          });

          // Show OTP verification modal
          setShowOTPModal(true);

          setSubmitStatus({
            type: "success",
            message:
              "Registration successful! Please verify your email and phone number.",
            data: result,
          });
        } else {
          setSubmitStatus({
            type: "error",
            message: "Registration failed. Please try again.",
          });
        }
      } catch (error) {
        console.log("Registration error:", error);
        setSubmitStatus({
          type: "error",
          message:
            error.response?.data?.message ||
            "Registration failed. Please try again.",
        });
      }
    } else {
      setSubmitStatus({
        type: "error",
        message: "Please fix the errors above and try again.",
      });
    }

    setIsSubmitting(false);
  };

  const handleOTPVerificationSuccess = (result) => {
    setSubmitStatus({
      type: "success",
      message: "Account verified successfully! You can now sign in.",
      data: result,
    });

    // Reset form after successful verification
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setTouched({});
    setRegistrationData(null);
  };

  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
        </div>

        {/* Form Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8">
          {/* Submit Status */}
          {submitStatus && (
            <div
              className={`mb-6 p-4 rounded-xl border ${
                submitStatus.type === "success"
                  ? "bg-green-900/20 border-green-500 text-green-400"
                  : "bg-red-900/20 border-red-500 text-red-400"
              }`}
            >
              <div className="flex items-center">
                {submitStatus.type === "success" ? (
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                <span className="font-medium">{submitStatus.message}</span>
              </div>
              {submitStatus.data && (
                <div className="mt-2 text-sm opacity-80">
                  User ID: {submitStatus.data.id}
                </div>
              )}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 text-white overflow-hidden"
          >
            <FormInput
              label="Full Name"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name ? errors.name : ""}
              placeholder="Enter your full name"
              required
            />

            <FormInput
              label="Email Address"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email ? errors.email : ""}
              placeholder="Enter your email address"
              required
            />

            <PhoneInput
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.phone ? errors.phone : ""}
            />

            <PasswordInput
              label="Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password ? errors.password : ""}
              placeholder="Create a strong password"
              showStrength={true}
            />

            <PasswordInput
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword ? errors.confirmPassword : ""}
              placeholder="Confirm your password"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Create Account
                </div>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to={"/login"}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
            <p className="text-sm text-gray-400">Or</p>
            <p className="text-gray-400">
              Login with{" "}
              <Link
                to={"/login"}
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            By creating an account, you agree to our{" "}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOTPModal && registrationData && (
        <OTPVerificationModal
          isOpen={showOTPModal}
          onClose={handleCloseOTPModal}
          userId={registrationData.userId}
          userEmail={registrationData.email}
          password={registrationData.password}
          onVerificationSuccess={handleOTPVerificationSuccess}
        />
      )}
    </div>
  );
};

export default Signup;
