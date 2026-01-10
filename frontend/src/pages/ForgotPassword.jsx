import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, AlertCircle, Check, Loader2, KeyRound } from "lucide-react";
import { Button } from "../components/ui/Button";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await api.post("/auth/forgot-password", { email });
            setMessage(response.data.message);
            setEmail("");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
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
            <div className="fixed top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-red-200/30 to-rose-300/20 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full bg-white/50 border border-slate-200 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all text-slate-500 group-hover:text-slate-700">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Back to Login</span>
                </Link>

                <div className="bg-white/80 backdrop-blur-xl border border-rose-100/50 rounded-[2.5rem] p-8 shadow-xl shadow-red-100/30">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-600/30">
                            <KeyRound className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-serif text-slate-900 mb-2">Forgot Password?</h1>
                        <p className="text-slate-500 text-sm">
                            Enter your email and we'll send you a reset link.
                        </p>
                    </div>

                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6 flex items-start gap-3"
                            >
                                <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-green-600">{message}</p>
                            </motion.div>
                        )}

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
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-slate-700 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-500/50 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all duration-300"
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
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
                                    <span>Sending...</span>
                                </div>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Remember your password?{" "}
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

export default ForgotPassword;
