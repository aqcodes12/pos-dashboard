import React, { useState } from "react";
import { LayoutDashboard, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../assets/daily.png";
import axios from "axios";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/user/login", {
        identifier: form.email,
        password: form.password,
      });

      if (res.data.success) {
        const user = res.data.data;

        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/dashboard");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // <-- STOP LOADING
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-primary/50 items-center justify-center">
        <div className="text-center p-8">
          <div className="flex items-center justify-center mb-6">
            <span className="text-4xl md:text-7xl tracking-widest font-bold text-white">
              POS
            </span>
          </div>
          <p className="text-white mt-3 text-xl">
            Log in to manage your dashboard.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <div className="flex items-center justify-center mb-6">
            <LayoutDashboard className="text-primary" size={28} />
          </div>

          <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm font-medium">{error}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-primary text-white py-2.5 rounded-lg font-medium 
  transition flex items-center justify-center gap-2
  ${loading ? "opacity-80 cursor-not-allowed" : "hover:bg-primary"}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-5">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-primary font-medium hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
