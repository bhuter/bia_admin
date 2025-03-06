"use client";
import Header, { CustomersList } from "@/app/comps/customers/indexPage";
import { useState } from "react";

const Customers = () => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [setupCustomerId, setSetupCustomerId] = useState<number | null>(null);

  const toggleAddCustomer = () => {
    setShowAddCustomer(true);
  };

  const closeAddCustomer = () => {
    setShowAddCustomer(false);
  };

  const handleSetupCustomerClick = (CustomerId: number) => {
    setSetupCustomerId(CustomerId); // Set the ID for the setup form
  };

  const closeSetupCustomer = () => {
    setSetupCustomerId(null); // Close the setup Customer form
  };

  return (
    <>
      <header>
        <title>Customers</title>
      </header>
      <div>
        <Header onAddCustomerClick={toggleAddCustomer}/>
      </div>
      
      <div className="bg-white h-[73vh] w-full rounded-lg bCustomer">
        <CustomersList/>
      </div>
    </>
  );
}
export default Customers;