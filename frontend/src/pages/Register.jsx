import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useGeolocation } from "../hooks/useGeolocation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Mail,
  Lock,
  Loader2,
  ArrowLeft,
  AlertCircle,
  User,
  Phone,
  MapPin,
  Check,
} from "lucide-react";
import { Button } from "../components/ui/Button";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "",
    blood_group: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const geolocation = useGeolocation();

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleGetLocation = () => {
    geolocation.getCurrentLocation();
  };

  useEffect(() => {
    if (geolocation.latitude && geolocation.longitude) {
      setFormData((prev) => ({
        ...prev,
        latitude: geolocation.latitude.toString(),
        longitude: geolocation.longitude.toString(),
      }));
    }
  }, [geolocation.latitude, geolocation.longitude]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setLoading(false);
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setLoading(false);
      setError(
        "Location is required. Please allow location access or enter coordinates manually."
      );
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await register(dataToSend);
      setLoading(false);
      setSuccess(
        "Registration successful! Please check your email to verify your account."
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Registration failed. Please try again.";
      setLoading(false);
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden py-20">
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
      <div className="fixed top-1/2 right-1/4 w-32 h-32 bg-gradient-to-br from-red-200/30 to-rose-300/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/50 border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-slate-500 group-hover:text-slate-700">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Register Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-rose-100/50 rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-red-100/30">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/30">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-serif text-slate-900 mb-2">Join BloodLink</h1>
            <p className="text-slate-500 text-sm">Create an account to save lives</p>
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
            {success && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6 flex items-start gap-3"
              >
                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm text-green-600">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              {/* Email */}
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
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              {/* Gender & Blood Group */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 ml-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    required
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 ml-1">Blood Group</label>
                  <select
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    required
                  >
                    <option value="">Select</option>
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 ml-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300 resize-none"
                rows="2"
                placeholder="Enter your full address"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-slate-700 block">Location</label>
                  <p className="text-xs text-slate-500">Required for blood matching</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetLocation}
                  disabled={geolocation.loading}
                  className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-xs h-9"
                >
                  {geolocation.loading ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-2" />
                  ) : (
                    <MapPin className="w-3 h-3 mr-2 text-red-500" />
                  )}
                  {geolocation.loading ? "Locating..." : "Get Location"}
                </Button>
              </div>

              {geolocation.error && (
                <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  {geolocation.error}. Please enter coordinates manually.
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-medium ml-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-none focus:border-red-500/50 transition-all"
                    placeholder="0.0000"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-medium ml-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-none focus:border-red-500/50 transition-all"
                    placeholder="0.0000"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Passwords */}
            <div className="grid md:grid-cols-2 gap-6">
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
                    placeholder="Min 6 chars"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white hover:bg-red-700 rounded-xl h-12 text-base font-semibold shadow-lg shadow-red-600/20 transition-all duration-300 transform hover:scale-[1.02] mt-4"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-red-600 font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
