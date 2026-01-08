import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Mail, Lock, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { cn } from "../lib/utils";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(formData.email, formData.password, formData.role);

      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "ngo":
          navigate("/ngo");
          break;
        case "blood_bank":
          navigate("/blood-bank");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Login failed. Please try again.";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const roles = [
    { value: "user", label: "Donor/User" },
    { value: "admin", label: "Admin" },
    { value: "ngo", label: "NGO" },
    { value: "blood_bank", label: "Blood Bank" },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://www.livemint.com/lm-img/img/2025/02/20/optimize/INDIA-POLITICS-DELHI-14_1740045325725_1740045348415.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/85 via-white/80 to-slate-50/85" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      {/* Decorative gradient orbs */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-gradient-to-br from-red-300/40 to-rose-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-rose-200/40 to-red-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-red-200/30 to-rose-300/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/50 border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-slate-500 group-hover:text-slate-700">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-rose-100/50 rounded-[2.5rem] p-8 shadow-xl shadow-red-100/30">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/30">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-serif text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Sign in to continue your journey</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-2">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={cn(
                    "py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-300 border",
                    formData.role === role.value
                      ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                  )}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <div className="text-right">
                  <Link
                    to="/forgot-password"
                    className="text-xs text-slate-500 hover:text-red-600 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white hover:bg-red-700 rounded-xl h-12 text-base font-semibold shadow-lg shadow-red-600/20 transition-all duration-300 transform hover:scale-[1.02]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-red-600 font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
