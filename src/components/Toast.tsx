import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white border border-green-200 shadow-lg rounded-lg px-4 py-3 flex items-center space-x-2">
        <CheckCircle size={18} className="text-[#00B42A]" />
        <span className="text-sm font-medium text-[#1D2129]">{message}</span>
      </div>
    </div>
  );
};
