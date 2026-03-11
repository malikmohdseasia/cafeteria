import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../admin/store/authStore";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "./authValidation/authSchema";
import LoadingCircle from "../admin/Pages/LoaderCircle";

const Signup = () => {
  const auth = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const success = await auth.signup(data.name, data.email);
      if (success) {
        toast.success("User Created Successfully!");
        const otpSent = await auth.sendOtp(data.email);
        if (otpSent) navigate("/login");
      }
    } catch (err) {
      toast.error(auth.error || "Something went wrong!");
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
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Create Account
        </h2>

        <p className="text-center text-white/80 text-sm mb-6">
          Join the delicious experience 🍽️
        </p>

        {auth.error && (
          <p className="text-red-400 text-center mb-4">{auth.error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-2">
            <User className="absolute left-3 top-3 text-white/70" size={18} />
            <input
              type="text"
              placeholder="Full Name"
              {...register("name")}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="relative mb-2">
            <Mail className="absolute left-3 top-3 text-white/70" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              {...register("email")}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || auth.isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 rounded-xl font-semibold bg-linear-to-r from-pink-500 to-purple-600 text-white shadow-lg disabled:opacity-50 flex items-center justify-center"
          >
            {auth.isLoading || isSubmitting ? (
              <span className="flex items-center gap-2">
                Signing Up... <LoadingCircle />
              </span>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </form>

        <p className="text-center text-white/80 text-sm mt-6">
          Already Account?{" "}
          <span className="text-pink-400 cursor-pointer hover:underline">
            <Link to={"/login"}>Login</Link>
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;