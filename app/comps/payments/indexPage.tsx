"use client";
import React, { useState, useEffect } from "react";

interface Payment {
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
  }
  const formatNumber = (amount: number | any): string => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
};


  const timeAgo = (createdDate: string): string => {
    const now = new Date();
    const created = new Date(createdDate);

    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `Now`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
};
  
  interface Analytics {
    total_paid: number;
    total_canceled: number;
    total_pending: number;
    total_failed: number;
    total_tax_paid: number;

  }


  interface HeaderProps {
    onAddPaymentClick: () => void;
  }
 
  const Header = ({ onAddPaymentClick }: HeaderProps) => {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
         // Fetch payments
         useEffect(() => {
           const fetchpayments = async () => {
             try {
               const response = await fetch(`/api/analytics/payments`);
               if (!response.ok) throw new Error("Failed to fetch payments");
               const data = await response.json();
               setAnalytics(data);
             } catch (error) {
               console.log("An error occurred while fetching payments.");
             }
           };
           fetchpayments();
         }, []);
       
         return (
           <div>
             <div className="flex items-center justify-between">
               <h1 className="text-xl text-gray-600">Payments</h1>
               <div className="flex items-center px-2 cursor-pointer">
                 <div className="flex justify-center border rounded-md py-1 px-3 mx-3" title="Download product summary">
                   <i className="bi bi-download"></i>
                 </div>
                 <div className="flex border rounded-md py-1 px-3 bg-amber-500 text-white cursor-pointer" onClick={onAddPaymentClick}>
                   <i className="bi bi-plus-circle mr-2"></i>
                   <span>Add payment</span>
                 </div>
               </div>
             </div>
             <div className="flex justify-between items-center my-3 space-x-3">
               
               <div className="border rounded-lg w-full bg-white">
                 <div className="flex p-4 justify-between items-center py-2 border-b">
                   <h4>
                     <i className="bi bi-box-seam text-sm border border-teal-300 px-1 py-[2px] bg-teal-100 text-teal-600 rounded-md mr-3"></i>
                     <span className="text-slate-500 text-sm">Total Paid</span>
                   </h4>
                   <i className="bi bi-three-dots"></i>
                 </div>
                 <div className="p-2 flex items-center justify-center">
                   <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_paid)} RWF </div>
                 </div>
               </div>
       
               <div className="border rounded-lg w-full bg-white">
                 <div className="flex p-4 justify-between items-center py-2 border-b">
                   <h4>
                     <i className="bi bi-box-seam text-sm border border-red-300 px-1 py-[2px] bg-red-100 text-red-600 rounded-md mr-3"></i>
                     <span className="text-slate-500 text-sm">Total Failed</span>
                   </h4>
                   <i className="bi bi-three-dots"></i>
                 </div>
                 <div className="p-2 flex items-center justify-center">
                   <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_failed)} RWF</div>
                 </div>
               </div>
   
               <div className="border rounded-lg w-full bg-white">
                 <div className="flex p-4 justify-between items-center py-2 border-b">
                   <h4>
                     <i className="bi bi-box-seam text-sm border border-orange-300 px-1 py-[2px] bg-orange-100 text-orange-600 rounded-md mr-3"></i>
                     <span className="text-slate-500 text-sm">Total Pending</span>
                   </h4>
                   <i className="bi bi-three-dots"></i>
                 </div>
                 <div className="p-2 flex items-center justify-center">
                   <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_pending)} RWF</div>
                 </div>
               </div>
   
               <div className="border rounded-lg w-full bg-white">
                 <div className="flex p-4 justify-between items-center py-2 border-b">
                   <h4>
                     <i className="bi bi-box-seam text-sm border border-slate-300 px-1 py-[2px] bg-slate-100 text-slate-700 rounded-md mr-3"></i>
                     <span className="text-slate-500 text-sm">Taxes</span>
                   </h4>
                   <i className="bi bi-three-dots"></i>
                 </div>
                 <div className="p-2 flex items-center justify-center">
                   <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_tax_paid)} RWF
                   </div>
                 </div>
               </div>
       
             </div>
           </div>
       );
};

const buttons = [
    {"id":1, "name": ""},
    {"id":2, "name": "Paid"},
    {"id":3, "name": "Failed"},
    {"id":4, "name": "Canceled"},
    {"id":5, "name": "Pending"},
  ];

const PaymentList = ({ onViewClick }: { onViewClick: (payment: any) => void }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [activeId, setActiveId] = useState(1);
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] =useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 15;
  
    // Calculate total pages
    const totalPages = Math.ceil(payments.length / itemsPerPage);
  
    // Get payments for the current page
    const currentpayments = payments.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  
    // Handle pagination navigation
    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };
  
    const handleActive = (id: number) => {
      setActiveId(id);
     }

     const handleSort = (text: string) => {
       setSort(text);
     }
     const handleFilter = (text: string) => {
      setFilter(text);
     }
  
   const handleSearch = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { value } = e.target;
      setSearch((value));
    };
  


  useEffect(() => {
    const fetchpayments = async () => {
      try {
        const response = await fetch(`/api/payments?sort=${sort}&search=${search}&filter=${filter}`);
        if (!response.ok) throw new Error("Failed to fetch payments");
        const data = await response.json();
        setPayments(data);
        setLoading(false)
      } catch (error) {
        setError("An error occurred while fetching payments.");
      }
    };
    fetchpayments();
  }, [sort, filter, search]);


  const toggleDropdown = (paymentId: number) => {
      setDropdownOpen(dropdownOpen === paymentId ? null : paymentId);
  };

  if (loading) {
      return <div className="text-center py-6">Loading payments...</div>;
  }

  if (error) {
      return <div className="text-center text-red-500 py-6"> {error}</div>;
  }

  return (
    <div className="border rounded-lg p-4 bg-white">
    <div className="flex justify-between my-1 items-center">
     <div className="flex items-center space-x-1 space-y-1">
       {buttons.map((btn) => (
         <button key={btn.id}  className={`${activeId === btn.id ? 'bg-slate-200 border-slate-400 ' : ''} px-2 py-1 capitalize border rounded-md text-slate-500 font-normal text-sm`} onClick={() => {handleActive(btn.id); handleFilter(btn.name)}}>{btn.name === "" ? 'All': btn.name}</button>
       ))}
     </div>

     <div className="flex items-center space-x-2">
       <i className="bi bi-funnel text-sm border px-2 py-1 rounded-md text-slate-500 cursor-pointer border-slate-300"></i>
       <div className="border py-1 px-2 bg-white rounded-md flex items-center">
         <i className="bi bi-search text-slate-400"></i>
         <input type="search" name="search" id="search" onChange={handleSearch} placeholder="Search ..." className="bg-transparent outline-none w-[15vw] px-3 text-sm"/>
       </div>
     </div>
    </div>
    <div className="">
           {payments.length <= 0 ? (
                <div className="w-full min-h-[60vh] flex items-center justify-center">
                   <div className="flex flex-col justify-center items-center opacity-65">
                     <div className="img w-[200px] h-[200px]">
                        <img src="/icons/shopping (1).png" alt="" className="w-full h-full object-contain"/>
                     </div>
                     <i>No payments found.</i>
                   </div>
                </div>
            ) : (
                <>
           <table className="w-full mt-5">
                   <thead className="space-x-2 border-t-2 border-b-2 border-slate-100 text-sm text-slate-400 p-2 text-left">
                      <tr className="text-sm leading-tight text-gray-400 font-light">
                          <th className="py-2 px-2 font-normal">Method</th>
                          <th className="py-2 px-2 font-normal">Account</th>
                          <th className="py-2 px-2 font-normal">Amount </th>
                          <th className="py-2 px-2 font-normal">Order</th>
                          <th className="py-2 px-2 font-normal">Name</th>
                          <th className="py-2 px-2 font-normal">Email</th>
                          <th className="py-2 px-2 font-normal">Tax</th>
                          <th className="py-2 px-2 font-normal">Status</th>
                          <th className="py-2 px-2 font-normal">CreatedAt</th>
                          <th className="py-2 px-2 font-normal">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                      {currentpayments.map((payment) => (
                         
                          <tr
                              key={payment.payment_id}
                              className="border-b border-gray-200 hover:bg-gray-50"
                          >
                              <td className="py-2 px-2">{payment.payment_method}</td>
                              <td className="py-2 px-2">{payment.account}</td>
                              <td className="py-2 px-2">{payment.currency+" "+formatNumber(payment.amount)}</td>
                              <td className="py-2 px-2">#{payment.order_id}</td>
                              <td className="py-2 px-2">{payment.full_name}</td>
                              <td className="py-2 px-2">{payment.email}</td>
                              <td className="py-2 px-2">{payment.currency+" "+formatNumber(payment.tax_amount)}</td>
                              <td className="py-2 px-2">
                                  <span
                                      className={`py-1 px-3 rounded-full text-xs capitalize ${
                                          payment.status == "active"
                                              ? "bg-green-100 text-green-600"
                                              : "bg-red-100 text-red-600"
                                      }`}
                                  >
                                      {payment.status}
                                  </span>
                              </td>
                              <td className="py-2 px-2">{timeAgo(payment.created_at)}</td>
                              <td className="py-2 px-2 text-center relative">
                                  <i
                                      className="bi bi-three-dots cursor-pointer text-xl"
                                      onClick={() => toggleDropdown(payment.payment_id)}
                                  ></i>
                                  {dropdownOpen === payment.payment_id && (
                                      <div className="absolute right-0 mt-1 mr-1 w-36 bg-white border rounded-md shadow-lg z-10">
                                          <ul className="py-1 text-gray-700">
                                              <li 
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                    onViewClick(payment)
                                                    toggleDropdown(payment.payment_id); // Close the dropdown
                                                }}
                                              >
                                                  <i className="bi bi-info border rounded-full mr-2 text-orange-500 hover:bg-slate-100"></i> Details
                                              </li>
                                              
                                          </ul>
                                      </div>
                                  )}
                              </td>
                          </tr>
                          
                      ))}
                  </tbody>
              </table>
                            {/* Pagination Controls */}
<div className="flex justify-center items-center space-x-2 mt-4">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
      currentPage === 1
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-white text-gray-700 hover:bg-gray-100 hover:text-black"
    }`}
  >
    Previous
  </button>

  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index + 1}
      className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
        currentPage === index + 1
          ? "bg-amber-400 text-white border-amber-500"
          : "bg-white text-gray-700 hover:bg-gray-100 hover:text-black"
      }`}
      onClick={() => handlePageChange(index + 1)}
    >
      {index + 1}
    </button>
  ))}

  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className={`px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
      currentPage === totalPages
        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-white text-gray-700 hover:bg-gray-100 hover:text-black"
    }`}
  >
    Next
  </button>
</div>
              </>
            )}
          </div>
      </div>
  );
};

export default Header;
export {PaymentList};