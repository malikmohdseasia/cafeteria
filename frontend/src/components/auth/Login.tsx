import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../admin/store/authStore";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LoadingCircle from "../admin/Pages/LoaderCircle";

const OTP_VALIDITY_MINUTES = 5;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

const LoginWithOTP = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, error } = useAuthStore();

  const [step, setStep] = useState(1);
  const [otpSentTime, setOtpSentTime] = useState<any>(null);
  const [otp, setOtp] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    let interval:any;
    if (otpSentTime) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - otpSentTime) / 1000);
        const remaining = OTP_VALIDITY_MINUTES * 60 - elapsed;
        setRemainingTime(remaining > 0 ? remaining : 0);
        if (remaining <= 0) clearInterval(interval);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSentTime]);

  const handleSendOtp = async (data:any) => {
    setSendingOtp(true);
    const success = await sendOtp(data.email);
    setSendingOtp(false);
    if (success) {
      toast.success("OTP Sent Successfully!");
      setStep(2);
      setOtpSentTime(Date.now());
      setOtp("");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter OTP!");
    if (remainingTime <= 0) return toast.error("OTP expired! Please request a new one.");

    setVerifyingOtp(true);
    const success = await verifyOtp(otp);
    setVerifyingOtp(false);

    if (success) {
      toast.success("Login Successfully!");
      navigate("/");
    }
  };

  const handleResendOtp = async () => {
    const email = getValues("email");
    if (!email) return toast.error("Email not found!");

    setSendingOtp(true);
    setOtp(""); 
    const success = await sendOtp(email);
    setSendingOtp(false);

    if (success) {
      toast.success("OTP Resent Successfully!");
      setOtpSentTime(Date.now());
    }
  };

  const formatTime = (seconds:any) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')" }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/30 shadow-2xl rounded-3xl p-8"
      >
        <p className="text-center text-white/80 text-sm mb-6">Login with Email & OTP</p>
        {error && <p className="text-red-400 text-center text-sm mb-3">{error}</p>}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.form
              key="emailStep"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSubmit(handleSendOtp)}
            >
              <div className="relative mb-6">
                <Mail className="absolute left-3 top-3 text-white/70" size={18} />
                <input
                  type="email"
                  placeholder="Enter your Email"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={sendingOtp}
                className="w-full py-3 rounded-xl font-semibold bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg"
              >
                {sendingOtp ? (
                  <div className="flex items-center justify-center gap-2">
                    Sending...
                    <LoadingCircle size={18} />
                  </div>
                ) : (
                  "Send OTP"
                )}
              </motion.button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form
              key="otpStep"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              onSubmit={(e) => {
                e.preventDefault();
                handleVerifyOtp();
              }}
            >
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center text-white/70 mb-4 text-sm"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>

              <div className="relative mb-2">
                <KeyRound className="absolute left-3 top-3 text-white/70" size={18} />
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                {!otp && remainingTime > 0 && (
                  <p className="text-red-400 text-sm mt-1">Please enter OTP</p>
                )}
              </div>

              {remainingTime > 0 && (
                <p className="text-white/70 text-sm mb-2">OTP expires in {formatTime(remainingTime)}</p>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={verifyingOtp || sendingOtp || remainingTime <= 0 || !otp}
                className="w-full py-3 rounded-xl font-semibold bg-linear-to-r from-green-400 to-emerald-600 text-white shadow-lg"
              >
                {verifyingOtp ? "Verifying..." : "Verify OTP"}
              </motion.button>

              {remainingTime === 0 && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleResendOtp}
                  disabled={sendingOtp}
                  className="w-full mt-2 py-3 rounded-xl font-semibold bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                >
                  {sendingOtp ? "Sending..." : "Resend OTP"}
                </motion.button>
              )}
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-white/80 text-sm mt-6">
          New here?{" "}
          <Link to="/signup" className="text-pink-400 hover:underline">
            Create Account
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginWithOTP;