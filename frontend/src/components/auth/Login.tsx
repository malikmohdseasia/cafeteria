import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";

const LoginWithOTP = () => {
  const navigate = useNavigate();

  const {
    sendOtp,
    verifyOtp,
    isLoading,
    error,
  } = useAuthStore();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = async () => {
    if (!email) return alert("Enter email");

    const success = await sendOtp(email);
    if (success) setStep(2);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    const success = await verifyOtp(otp);
    if (success) {
      toast.success("Login Successfully!")
      navigate("/");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-8"
      >
      

        <p className="text-center text-white/80 text-sm mb-6">
          Login with Email & OTP
        </p>

        {error && (
          <p className="text-red-400 text-center text-sm mb-3">
            {error}
          </p>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="emailStep"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative mb-6">
                <Mail className="absolute left-3 top-3 text-white/70" size={18} />
                <input
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg"
              >
                {isLoading ? "Sending..." : "Send OTP"}
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="otpStep"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-white/70 mb-4 text-sm"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>

              <div className="relative mb-6">
                <KeyRound className="absolute left-3 top-3 text-white/70" size={18} />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full py-3 rounded-xl font-semibold bg-linear-to-r from-green-400 to-emerald-600 text-white shadow-lg"
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-white/80 text-sm mt-6">
          New here?{" "}
          <Link
            to="/signup"
            className="text-pink-400 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginWithOTP;