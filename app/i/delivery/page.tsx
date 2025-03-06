"use client"
import Header, { DeliveryList } from "@/app/comps/orders/deliveryPage";
import DeliveryDetailsPopup from "@/app/comps/toggles/deliveryDetails";

import FinalizeDelivery from "@/app/comps/toggles/finilize";
import { useState } from "react";

const Delivery = () => {
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [finilizeOrderId, setSetupOrderId] = useState<string | null>(null);

  const toggleDetails = (order: any) => {
    setShowDetails(order);
  };

  const closeDetails = () => {
    setShowDetails(null);
  };
 
  const handleSetupOrderClick = (OrderId: string) => {
    setSetupOrderId(OrderId); // Set the ID for the setup form
  };

  const closeFinilizeOrder = () => {
    setSetupOrderId(null); // Close the setup Order form
  };

  return (
    <>
      <header>
        <title>Delivery Status</title>
      </header>
      <div>
        <Header/>
      </div>
     
      <div className="bg-white h-[73vh] w-full rounded-lg border">
        <DeliveryList onFinilizeOrderClick={handleSetupOrderClick} onViewClick={toggleDetails}/>
      </div>
      {finilizeOrderId && (
        <FinalizeDelivery orderId={finilizeOrderId} onClose={closeFinilizeOrder} />
      )}
      {showDetails && (
        <DeliveryDetailsPopup order_id={showDetails} onClose={closeDetails}/>
      )}
    </>
  );
}
export default Delivery;