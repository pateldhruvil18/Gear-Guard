import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose }) => {
  const icons = {
    success: FaCheckCircle,
    error: FaExclamationCircle,
    info: FaInfoCircle,
    warning: FaExclamationCircle,
  };

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-gray-600',
    warning: 'bg-yellow-500',
  };

  const Icon = icons[type] || FaInfoCircle;

  return (
    <div className={`${colors[type]} text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3 min-w-[320px] max-w-md animate-slide-in backdrop-blur-sm`}>
      <Icon className="flex-shrink-0 text-lg" />
      <p className="flex-1 font-medium">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white/25 rounded-full p-1.5 transition-all duration-200 hover:rotate-90"
        aria-label="Close"
      >
        <FaTimes className="text-sm" />
      </button>
    </div>
  );
};

export default Toast;

