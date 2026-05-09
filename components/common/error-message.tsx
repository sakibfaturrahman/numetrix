"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string | null;
  onClose: () => void;
}

export const ErrorMessage = ({ message, onClose }: ErrorMessageProps) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative mb-8 p-5 bg-red-50 border border-red-100 rounded-[25px] flex items-start gap-4 shadow-sm overflow-hidden"
        >
          {/* Aksen Merah di Sisi Kiri */}
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>

          <div className="p-2 bg-red-500 rounded-xl shrink-0">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>

          <div className="flex-1 lowercase">
            <h4 className="text-sm font-bold text-red-900 leading-tight mb-1">
              terjadi kesalahan sistem
            </h4>
            <p className="text-xs text-red-700/80 leading-relaxed font-medium">
              {message}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-red-100 rounded-full shrink-0 h-8 w-8"
          >
            <X className="w-4 h-4 text-red-400" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
