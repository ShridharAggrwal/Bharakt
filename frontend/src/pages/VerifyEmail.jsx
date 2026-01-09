import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/Button";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      try {
        const response = await api.get(`/auth/verify/${token}`);
        setStatus("success");
        setMessage(response.data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.error || "Verification failed");
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <img
          src="https://www.livemint.com/lm-img/img/2025/02/20/optimize/INDIA-POLITICS-DELHI-14_1740045325725_1740045348415.jpg"
          alt="Background"
          className="w-full h-full object-cover object-[center_15%]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/85 via-white/80 to-slate-50/85" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </div>

      {/* Decorative gradient orbs */}
      <div className="fixed top-20 right-20 w-64 h-64 bg-gradient-to-br from-red-300/40 to-rose-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-rose-200/40 to-red-300/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 left-1/3 w-32 h-32 bg-gradient-to-br from-red-200/30 to-rose-300/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-rose-100/50 rounded-[2.5rem] p-8 text-center shadow-xl shadow-red-100/30">
          {status === "verifying" && (
            <>
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying Email...</h2>
              <p className="text-slate-500">Please wait while we verify your account.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Verified!</h2>
              <p className="text-slate-500 mb-8">{message}</p>
              <Link to="/login">
                <Button className="w-full bg-green-600 text-white hover:bg-green-700">Sign In Now</Button>
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h2>
              <p className="text-slate-500 mb-8">{message}</p>

              <div className="grid grid-cols-2 gap-4">
                <Link to="/login">
                  <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50">Try Login</Button>
                </Link>
                <Link to="/register">
                  <Button className="w-full bg-red-600 text-white hover:bg-red-700">Register Again</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
