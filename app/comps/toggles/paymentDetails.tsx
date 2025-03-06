import React from "react";

interface PaymentDetailsProps {
    payment: {
        payment_id: number;
        full_name: string;
        transaction_id: string;
        account: string;
        status: string;
        created_at: string;
        email: string;
        amount: number;
        tax_amount: number;
        payment_method: string;
        order_id: string;
        currency: string;
    };
    onClose: () => void;
}

const formatNumber = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};

function formatDate(dateString: string) {
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

const PaymentDetailsPopup: React.FC<PaymentDetailsProps> = ({ payment, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-6 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl transform transition-all scale-100">
                <h2 className="text-2xl font-medium text-slate-600 mb-6 text-center">Payment Details</h2>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-700">
                    <p><strong>Payment ID:</strong> {payment.payment_id}</p>
                    <p><strong>Transaction ID:</strong> {payment.transaction_id}</p>
                    <p><strong>Full Name:</strong> {payment.full_name}</p>
                    <p><strong>Email:</strong> {payment.email}</p>
                    <p><strong>Account:</strong> {payment.account}</p>
                    <p><strong>Payment Method:</strong> {payment.payment_method}</p>
                    <p><strong>Order ID:</strong> {payment.order_id}</p>
                    <p><strong>Status:</strong> 
                        <span className={`px-3 py-1 ml-2 text-sm font-medium rounded-full ${payment.status === 'Completed' ? 'bg-teal-100 text-teal-600' : 'bg-red-100 text-red-600'}`}>
                            {payment.status}
                        </span>
                    </p>
                    <p><strong>Date:</strong> {formatDate(payment.created_at)}</p>
                </div>
                
                <div className="flex justify-between items-center text-lg font-bold text-slate-900 border-t pt-4 mt-6">
                    <span>Total Amount:</span>
                    <span className="text-teal-600">{formatNumber(payment.amount)} {payment.currency}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                    <span>Tax Amount:</span>
                    <span className="text-teal-600">{formatNumber(payment.tax_amount)} {payment.currency}</span>
                </div>
                
                <div className="mt-6 flex justify-end">
                    <button onClick={onClose} className="px-5 py-2.5 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all">Close</button>
                </div>
            </div>
        </div>
    );
};

export default PaymentDetailsPopup;
