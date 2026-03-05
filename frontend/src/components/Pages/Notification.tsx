import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationType {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Notification = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: 1,
      title: "New Order Received",
      message: "You received a new order from Danish.",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      title: "Payment Successful",
      message: "Payment of ₹499 completed successfully.",
      time: "10 min ago",
      read: false,
    },
    {
      id: 3,
      title: "Order Delivered",
      message: "Order #1234 has been delivered.",
      time: "1 hour ago",
      read: true,
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
      >
        <Bell className="text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-80 bg-white shadow-2xl rounded-2xl z-50 "
          >
            <div className="p-4 border-b border-green-300">
              <h3 className="font-semibold text-gray-700">
                Notifications
              </h3>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500 text-sm">
                  You don’t have any notifications
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border-b border-green-300 hover:bg-gray-50 transition cursor-pointer ${
                      !item.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <h4 className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {item.message}
                    </p>
                    <span className="text-xs text-gray-400 block mt-2">
                      {item.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;