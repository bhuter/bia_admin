import React from "react";

interface WarningPopupProps {
  message: string;
}

const WarningPopup: React.FC<WarningPopupProps> = ({ message}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4 z-50 backdrop-blur">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">⚠️ Access Denied</h2>
        <p className="text-gray-700 mb-4">{message}</p>
      </div>
    </div>
  );
};

export default WarningPopup;
