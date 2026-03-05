import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal = ({ isOpen, onClose, onConfirm }: LogoutModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
              
              <div className="flex justify-center mb-4">
                <AlertTriangle className="text-red-500" size={40} />
              </div>

              <h2 className="text-xl font-semibold mb-2">
                Confirm Logout
              </h2>

              <p className="text-gray-500 mb-6">
                Are you sure you want to logout from your account?
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-lg bg-[#7B2FF7] text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogoutModal;