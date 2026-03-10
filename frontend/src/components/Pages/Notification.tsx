import { useEffect, useState } from "react";
import { useOrderStore } from "../../store/orderStore";
import { Bell } from "lucide-react";
import { socket } from "../../socket/socket";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();
  const { fetchNotifications, notifications, markNotificationsRead } = useOrderStore();
  const [open, setOpen] = useState(false);
  console.log(notifications)

  useEffect(() => {

    fetchNotifications();

    socket.on("newOrder", () => {
      fetchNotifications();
    });

    return () => {
      socket.off("newOrder");
    };

  }, []);

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log("Socket error:", err.message);
  });

  return (
    <div className="relative">

      <button
        onClick={() => {
          setOpen(!open);
          markNotificationsRead();
        }}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell size={22} className="text-red-500" />

        {unreadCount > 0 && !open && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white shadow-lg rounded-xl z-50">

          <div className="p-3 font-semibold border-b border-gray-300">
            Notifications
          </div>

          <div className="max-h-80 overflow-y-auto">

            {notifications.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">
                No notifications
              </p>
            ) : (

              notifications?.map((n: any) => (
                <div
                  key={n.notificationId}
                  className="p-3 border-b border-gray-300 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {navigate("/orders")
                    setOpen(false)
                  }}
                >
                  <p className="font-semibold text-sm">
                    {n.name} ({n.email})
                  </p>

                  <p className="text-xs text-gray-600">
                    Order ₹{n.price}
                  </p>

                  <p className="text-xs text-gray-500">
                    Order ID: {n.orderId}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              ))

            )}

          </div>

        </div>
      )}

    </div>
  );
};

export default Notification;