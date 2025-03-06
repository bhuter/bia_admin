import React, { useState } from "react";

interface FinalizeDeliveryProps {
    orderId: string;
    onClose: () => void;
}

const FinalizeDelivery: React.FC<FinalizeDeliveryProps> = ({ orderId, onClose }) => {
    const [userInput, setUserInput] = useState("");
    const [message, setMessage] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) {
            setMessage("User ID or Email is required");
            return;
        }
        setMessage("");
        
        try {
            const response = await fetch("/api/delivery/finilize/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, userInput })
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to finalize delivery");
            }
            setMessage("Delivery finalized successfully");
        } catch (err: any) {
            setMessage(err.message);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[40vw]">
                <button onClick={onClose} className="flex justify-self-end"><i className="bi bi-x text-3xl"></i></button>
                <h2 className="text-lg font-semibold mb-4">Finalize Delivery</h2>
                <p className="mb-2">Order : <strong>{orderId}</strong></p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter User ID or Email"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="w-full p-2 border rounded mb-2 outline-none"
                    />
                    {message && <p className={`${message.includes("successfully") ? 'text-teal-500' : 'text-red-500'} text-sm mb-2`}>{message}</p>}
                    <div className="flex justify-end space-x-2">
                        <button type="submit" className="px-4 py-2 bg-amber-500 text-white rounded">Finilize</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FinalizeDelivery;
