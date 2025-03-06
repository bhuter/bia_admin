import React from "react";

interface OrderDetailsProps {
    order: {
      order_id: number;
      order_number: number;
      total_amount: string;
      Orders: string;
      status: string;
      created_at: string;
      user_id: number;
      first_name: string;
      last_name: string;
      photo: string;
      payment_id: number; 
      payment_status: string;
      count: string;
    };
    onClose: () => void;
}

const formatNumber = (amount: number | any): string => {
  return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
  }).format(amount);
};

function formatDate(dateString: any) {
  const date = new Date(dateString);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${month}, ${day} ${year} ${hours}:${minutes}:${seconds}`;
}

const OrderDetailsPopup: React.FC<OrderDetailsProps> = ({ order, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all scale-100">
                <h2 className="text-2xl font-medium text-slate-600 mb-6 text-center">Order Details</h2>
                <div className="flex items-center gap-4 mb-6">
                    <img src={order.photo ? order.photo : "/icons/profile.png"} alt="User" className="w-14 h-14 rounded-full border-2 border-teal-500" />
                    <div>
                        <p className="text-lg font-medium text-slate-700">{order.first_name} {order.last_name}</p>
                        <p className="text-sm text-slate-500">User ID: {order.user_id}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                    <p><strong>Order ID:</strong> {order.order_id}</p>
                    <p><strong>Order Number:</strong> {order.order_number}</p>
                    <p><strong>Status:</strong> 
                        <span className={`px-3 py-1 ml-2 text-sm font-medium rounded-full ${order.status === 'Delivered' ? 'bg-teal-100 text-teal-600' : 'bg-amber-100 text-amber-600'}`}>{order.status}</span>
                    </p>
                    <p><strong>Payment Status:</strong> <span className={`px-3 py-1 ml-2 text-sm font-medium rounded-full ${order.payment_status === 'Paid' ? 'bg-teal-100 text-teal-600' : 'bg-red-100 text-red-600'}`}>{order.payment_status}</span></p>
                    <p><strong>Date Placed:</strong> {formatDate(order.created_at)}</p>
                    <p><strong>Items Count:</strong> {order.count}</p>
                </div>
                
                <div className="flex justify-between items-center text-lg font-bold text-slate-900 border-t pt-4 mt-6">
                    <span>Total Amount:</span>
                    <span className="text-teal-600">{formatNumber(order.total_amount)} RWF</span>
                </div>
                
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2.5 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all">Close</button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPopup;