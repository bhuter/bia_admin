import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AlertNotificationProps {
  message: string;
  type: "success" | "error" ;
}

const AlertNotification: React.FC<AlertNotificationProps> = ({ message, type}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-400";
      case "error":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className={`fixed top-5 w-screen  flex items-center justify-center z-50`}
          >
            <div className={`px-6 py-3 rounded-md text-white flex justify-self-center ${getBackgroundColor()} `}>
              <span >{message}</span>
              <button onClick={() => setIsVisible(false)}>
                <i className="bi bi-x-circle w-5 h-5 ml-2" />
              </button>
            </div>
          
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertNotification;
