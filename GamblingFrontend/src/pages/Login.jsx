import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";

const Login = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // To manage loading state

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email); // Email validation regex
  const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone); // Example for 10-digit phone number (adjust for your case)

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error on submit
    setIsLoading(true); // Start loading

    // Validation logic before login attempt
    if (!emailOrPhone || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (emailOrPhone.includes("@") && !validateEmail(emailOrPhone)) {
      setError("Please enter a valid email");
      setIsLoading(false);
      return;
    }

    try {
      await login(
        emailOrPhone.includes("@")
          ? { email: emailOrPhone, password }
          : { phoneNumber: emailOrPhone, password }
      );
      navigate("/"); // Redirect to home or wherever
    } catch (err) {
      console.error(err);
      setError("Invalid credentials or user not verified"); // Improve error message depending on error received
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent pb-3">
            Login
          </h1>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <FormInput
              type="text"
              placeholder="Enter email or Phone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              required
              label="Email or Phone"
              id="emailorphone"
              name="emailorphone"
              onBlur={handleBlur}
            />

            <FormInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              label="Password"
              id="password"
              name="password"
              onBlur={handleBlur}
            />

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
