"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { X, Bell } from "lucide-react"
import { Button } from './button'
import { useOnClickOutside } from '@/hooks/use-click-outside.ts';

interface Notice {
  id: string;
  title: string;
  message: string;
  status: "active" | "inactive";
  imageUrl?: string;
  buttons?: {
    text: string;
    url: string;
    action?: 'close';
  }[];
}

export const PopupNotice = () => {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleButtonClick = (button: { action?: 'close'; url: string }) => {
    if (button.action === 'close') {
      handleClose();
    } else {
      window.open(button.url, '_blank');
    }
  };

  useOnClickOutside(popupRef, handleClose);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch("/api/notices");
        if (!res.ok) {
          throw new Error("Failed to fetch notice");
        }
        const data: Notice[] = await res.json();
        const activeNotice = data.find((n) => n.status === "active");
        if (activeNotice) {
          setNotice(activeNotice);
          setIsVisible(true);
        }
      } catch (error) {
        console.error("Error fetching notice:", error);
      }
    };

    fetchNotice();
  }, []);



  if (!notice || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="fixed inset-0 bg-black/30" onClick={handleClose} />
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md p-6 rounded-lg shadow-lg glass-card border border-white/10 text-center z-10"
          >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-white/70 mr-2" />
              <h3 className="font-bold text-lg text-white">{notice.title}</h3>
            </div>
            <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          {notice.imageUrl && (
            <img src={notice.imageUrl} alt={notice.title} className="w-full h-48 object-cover rounded-md mb-4" />
          )}
          <p className="text-white/80 text-base mb-6">{notice.message}</p>
          {notice.buttons && notice.buttons.length > 0 && (
            <div className="flex justify-center space-x-4 mt-4">
              {notice.buttons.map((button, index) => (
                <motion.button
                  key={index}
                  className="group glass-dark text-white/90 px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-lg flex items-center justify-center space-x-2 w-full sm:w-auto"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  data-hover="true"
                  onClick={() => handleButtonClick(button)}
                >
                  {button.text}
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
};
