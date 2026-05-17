import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useEffect } from "react";

type NotificationProps = {
  notification: {
    type: "success" | "error";
    message: string;
  } | null;
  setNotification: (value: null) => void;
};

function Notification({notification, setNotification} : NotificationProps) {

    useEffect(() => {
  if (notification) {
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }
}, [notification]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-primary text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          {notification.message}
          <button
            onClick={() => setNotification(null)}
            className="ml-2 hover:opacity-70 transition-opacity"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Notification;
