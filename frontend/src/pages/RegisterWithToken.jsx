import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Droplets,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  User,
  MapPin,
  Building2,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import LocationPicker from "../components/common/LocationPicker";

const RegisterWithToken = () => {
  const { type, token } = useParams();
  const navigate = useNavigate();
  const { registerWithToken } = useAuth();

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isNGO = type === "ngo";

  const [formData, setFormData] = useState(
    isNGO
      ? {
        name: "",
        owner_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        age: "",
        gender: "",
        address: "",
        volunteer_count: "",
        latitude: "",
        longitude: "",
      }
      : {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        contact_info: "",
        address: "",
        latitude: "",
        longitude: "",
      }
  );

  const handleLocationChange = (coords) => {
    setFormData((prev) => ({
      ...prev,
      latitude: coords.lat.toString(),
      longitude: coords.lng.toString(),
    }));
  };

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await api.get(`/auth/validate-token/${type}/${token}`);
        setTokenValid(response.data.valid);
      } catch (err) {
        setTokenValid(false);
        setError("Invalid or expired registration link");
      } finally {
        setValidating(false);
      }
    };
    validateToken();
  }, [type, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.latitude || !formData.longitude) {
      setError(
        "Location is required. Please allow location access or enter coordinates manually."
      );
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData;
      await registerWithToken(type, token, dataToSend);
      navigate(type === "ngo" ? "/ngo" : "/blood-bank");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="fixed inset-0 z-0">
          <img src="https://www.livemint.com/lm-img/img/2025/02/20/optimize/INDIA-POLITICS-DELHI-14_1740045325725_1740045348415.jpg" alt="Background" className="w-full h-full object-cover object-[25%_20%]" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/85 via-white/80 to-slate-50/85" />
        </div>
        <Loader2 className="relative z-10 w-12 h-12 text-red-600 animate-spin" />
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div className="fixed inset-0 z-0">
          <img src="https://www.livemint.com/lm-img/img/2025/02/20/optimize/INDIA-POLITICS-DELHI-14_1740045325725_1740045348415.jpg" alt="Background" className="w-full h-full object-cover object-[25%_20%]" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/85 via-white/80 to-slate-50/85" />
        </div>
        <div className="fixed top-20 right-20 w-64 h-64 bg-gradient-to-br from-red-300/40 to-rose-400/30 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-rose-200/40 to-red-300/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 bg-white/80 backdrop-blur-xl border border-rose-100/50 rounded-[2.5rem] p-8 max-w-md w-full text-center shadow-xl shadow-red-100/30">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Invalid Link</h2>
          <p className="text-slate-500 mb-6">
            {error || "This registration link is invalid or has expired."}
          </p>
          <Link to="/">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden py-20">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://www.livemint.com/lm-img/img/2025/02/20/optimize/INDIA-POLITICS-DELHI-14_1740045325725_1740045348415.jpg"
          alt="Background"
          className="w-full h-full object-cover object-[25%_20%]"
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

        <div className="bg-white/80 backdrop-blur-xl border border-rose-100/50 rounded-[2.5rem] p-8 lg:p-10 shadow-xl shadow-red-100/30">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/30">
              <Droplets className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-serif text-slate-900 mb-2">
              Register {isNGO ? "NGO" : "Blood Bank"}
            </h1>
            <p className="text-slate-500 text-sm">Complete your registration</p>
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
            {isNGO ? (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 ml-1">NGO Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                      placeholder="Enter NGO name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 ml-1">Owner Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                    <input
                      type="text"
                      name="owner_name"
                      value={formData.owner_name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                      placeholder="Enter owner name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 ml-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    placeholder="Age"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 ml-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs font-medium text-slate-700 ml-1">Volunteers Count</label>
                  <input
                    type="number"
                    name="volunteer_count"
                    value={formData.volunteer_count}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    placeholder="Enter volunteer count"
                  />
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 ml-1">Blood Bank Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                      placeholder="Enter blood bank name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-700 ml-1">Contact Info</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                    <input
                      type="text"
                      name="contact_info"
                      value={formData.contact_info}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 ml-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300 resize-none"
                rows="2"
                placeholder="Enter full address"
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-700 ml-1">Location</label>
              <p className="text-xs text-slate-500 ml-1">Required for blood matching - click on map or search</p>
              <LocationPicker
                value={formData.latitude && formData.longitude ? {
                  lat: parseFloat(formData.latitude),
                  lng: parseFloat(formData.longitude)
                } : null}
                onChange={handleLocationChange}
                showProfileButton={false}
                placeholder="Search for your location..."
                required
              />
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
                <label className="text-xs font-medium text-slate-700 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                    placeholder="Confirm"
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
                  <span>Registering...</span>
                </div>
              ) : (
                "Complete Registration"
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterWithToken;
