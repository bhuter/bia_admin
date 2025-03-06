import React, { useEffect, useState } from "react";

interface Delivery {
    order_number: number;
    total_amount: number;
    tax_amount: number;
    billing_address: string;
    order_status: string;
    payment_method: string;
    delivery_allowed: boolean;
    order_date: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    account: string;
    payer_name: string;
    payment_status: string;
    delivery_status: string;
    agent_first_name?: string;
    agent_last_name?: string;
    agent_status?: string;
    tracking_number?: string;
    tracking_url?: string;
};

interface DeliveryDetailsProps {
  order_id: number;
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

const DeliveryDetailsPopup: React.FC<DeliveryDetailsProps> = ({ order_id, onClose }) => {
  const [delivery, setDelivery] = useState<Delivery | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/delivery/view`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ id: order_id }),
        });
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setDelivery(data);
      } catch (error) {
        console.log("An error occurred while fetching orders.");
      }
    };
    fetchOrders();
  }, [order_id]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-3xl transform transition-all scale-100">
        <h2 className="text-2xl font-semibold text-slate-700 mb-4 text-center border-b pb-2">Delivery Details</h2>
        <div className="h-[70vh] overflow-hidden overflow-y-visible">

        
        <table className="w-full   border-collapse border border-gray-300 text-sm text-slate-700">
          <tbody>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Order #</td><td className="border px-4 py-2">{delivery?.order_number}</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Total</td><td className="border px-4 py-2">{formatNumber(delivery?.total_amount)} RWF</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Tax</td><td className="border px-4 py-2">{formatNumber(delivery?.tax_amount)} RWF</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Billing</td><td className="border px-4 py-2">{delivery?.billing_address}</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Delivery Status</td><td className={`border px-4 py-2 font-medium `}><span className={`border px-3 py-1 font-medium rounded-lg ${delivery?.delivery_status === 'Active' ? 'bg-teal-100 text-teal-600' : 'bg-red-100 text-red-600'}`}>{delivery?.delivery_status}</span></td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Order Status</td><td className="border px-4 py-2"><span className={`border px-3 py-1 font-medium rounded-lg ${delivery?.order_status === 'Active' ? 'bg-teal-100 text-teal-600' : 'bg-orange-100 text-orange-600'}`}>{delivery?.order_status}</span></td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Payment</td><td className="border px-4 py-2">{delivery?.payment_method}</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Delivery</td><td className="border px-4 py-2"><span className={` ${delivery?.delivery_allowed ? ' text-sky-600' : 'text-amber-600'}`}>{delivery?.delivery_allowed ? "Yes" : "No"}</span></td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Date</td><td className="border px-4 py-2">{formatDate(delivery?.order_date)}</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Customer Name</td><td className="border px-4 py-2">{delivery?.first_name} {delivery?.last_name}</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Email</td><td className="border px-4 py-2">{delivery?.email}</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Phone</td><td className="border px-4 py-2">{delivery?.phone}</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Account</td><td className="border px-4 py-2">{delivery?.account}</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Payer</td><td className="border px-4 py-2">{delivery?.payer_name}</td></tr>
            <tr><td className="text-nowrap border px-4 py-2 font-semibold">Payment Status</td><td className={`border px-4 py-2 font-medium `}> <span className={`border px-3 py-1 font-medium rounded-lg ${delivery?.payment_status === 'Paid' ? 'bg-teal-100 text-teal-600' : 'bg-red-100 text-red-600'}`}>{delivery?.payment_status}</span> </td></tr>
            
            {delivery?.agent_first_name && (
              <>
                <tr><td className="text-nowrap border px-4 py-2 font-semibold">Agent</td><td className="border px-4 py-2">{delivery?.agent_first_name} {delivery?.agent_last_name}</td></tr>
                <tr><td className="text-nowrap border px-4 py-2 font-semibold">Agent Status</td><td className="border px-4 py-2"><span className={`border px-3 py-1 font-medium rounded-lg ${delivery?.agent_status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{delivery?.agent_status}</span></td></tr>
              </>
            )}
            {delivery?.tracking_number && (
              <>
                <tr><td className="text-nowrap border px-4 py-2 font-semibold">Tracking Number</td><td className="border px-4 py-2">{delivery?.tracking_number}</td></tr>
                {delivery?.tracking_url && (
                  <tr>
                    <td className="text-nowrap border px-4 py-2 font-semibold">Tracking Link</td>
                    <td className="border px-4 py-2">
                      <a href={delivery?.tracking_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        Track Order
                      </a>
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
       </div>
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailsPopup;