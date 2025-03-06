"use client";
import { useState } from "react";
import Header, { OrderList } from "@/app/comps/orders/indexPage";
import Assign from "@/app/comps/toggles/assign";
import OrderDetailsPopup from "@/app/comps/toggles/orderDetails";

const Orders = () => {
  const [showDetails, setShowDetails] = useState<Object | any>(null);
  const [setupProductId, setSetupProductId] = useState<string | null>(null);

  const toggleDetails = (order: any) => {
    setShowDetails(order);
  };

  const closeDetails = () => {
    setShowDetails(false);
  };

  const handleSetupProductClick = (productId: string) => {
    setSetupProductId(productId); // Set the ID for the setup form
  };

  const closeSetupProduct = () => {
    setSetupProductId(null); // Close the setup product form
  };

  return (
    <>
      <header>
        <title>Orders</title>
      </header>
      <div>
        <Header />
      </div>
      
      {setupProductId && (
        <div className="block">
          <Assign OrderId={setupProductId} onClose={closeSetupProduct} />
        </div>
      )}
      <div className="bg-white h-[73vh] w-full rounded-lg border">
        <OrderList onSetupOrderClick={handleSetupProductClick} onViewDetailsClick={toggleDetails}/>
      </div>
      {showDetails && (
        <OrderDetailsPopup order={showDetails} onClose={closeDetails}/>
      )}
    </>
  );
};

export default Orders;
