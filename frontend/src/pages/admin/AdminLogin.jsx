import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Logo from "../../components/Logo";
// import { Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");

    try {
      await login(email, password, navigate, true);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #1a3a6b 0%, #1e4d8c 40%, #1565c0 100%)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-sm relative"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-2">
          <Logo />
        </div>

        {/* Title */}
        <h2 className="text-lg font-medium text-center text-gray-500 mb-6 tracking-wide">
          Admin portal login
        </h2>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm text-center rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition"
            placeholder="admin@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-blue-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {/* {showPassword ? <EyeOff size={18} /> : <Eye size={18} />} */}
          </button>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2 mb-6 mt-1">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 accent-blue-600 cursor-pointer rounded"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-gray-500 cursor-pointer select-none"
          >
            Remember me
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-900 text-white py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all active:scale-95"
        >
          Login
        </button>
      </form>
    </div>
  );
}