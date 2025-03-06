"use client";
import { useState } from "react";
import Header, { PaymentList } from "@/app/comps/payments/indexPage";
import AddPayment from "@/app/comps/toggles/addPayment";
import PaymentDetailsPopup from "@/app/comps/toggles/paymentDetails";

const Payment = () => {
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showDetails, setShowDetails] = useState<Object | any>(null);

  const toggleAddPayment = () => {
    setShowAddPayment(true);
  };

  const closeAddPayment = () => {
    setShowAddPayment(false);
  };
  const toggleDetails = (order: any) => {
    setShowDetails(order);
  };

  const closeDetails = () => {
    setShowDetails(false);
  };


  return (
    <>
      <header>
        <title>Payments</title>
      </header>
      <div>
        <Header onAddPaymentClick={toggleAddPayment}/>
      </div>
      {showAddPayment && (
        <div className="block">
          <AddPayment onClose={closeAddPayment} />
        </div>
      )}
      
      <div className="bg-white h-[73vh] w-full rounded-lg border">
        <PaymentList onViewClick={toggleDetails}/>
      </div>
      {showDetails && (
        <PaymentDetailsPopup payment={showDetails} onClose={closeDetails}/>
      )}
    </>
  );
};

export default Payment;