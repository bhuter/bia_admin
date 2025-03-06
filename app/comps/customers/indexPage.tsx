"use client";
import React, { useState, useEffect } from "react";

interface Customer {
    id: number;
    phone: string;
    email: string;
    status: string;
    created_at: string;
    first_name: string;
    last_name: string;
    photo: string;
    nationality: string;
    orders: number;
  }


  interface HeaderProps {
    onAddCustomerClick: () => void;
  }

function getTimeDifference(dateInput: string | Date): string {
    const date = new Date(dateInput);
    const now = new Date();

    // Difference in seconds
    const diffInSeconds = Math.abs((now.getTime() - date.getTime()) / 1000);

    // Determine the time unit
    if (diffInSeconds < 60) {
        return `${Math.floor(diffInSeconds)} seconds ago`;
    } else if (diffInSeconds < 3600) { // Less than an hour
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) { // Less than a day
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 31536000) { // Less than a year
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 315360000) { // Less than a decade
        const years = Math.floor(diffInSeconds / 31536000);
        return `${years} year${years > 1 ? "s" : ""} ago`;
    } else { // Decades
        const decades = Math.floor(diffInSeconds / 315360000);
        return `${decades} decade${decades > 1 ? "s" : ""} ago`;
    }
}

const formatNumber = (amount: number | any): string => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};
 interface Analytics {
    total_active: number;
    total_pending: number;
    total_inactive: number;
    total_customers: number;

  }

  const Header = ({ onAddCustomerClick}: HeaderProps) => {
     const [analytics, setAnalytics] = useState<Analytics | null>(null);
              // Fetch customers
              useEffect(() => {
                const fetchCustomers = async () => {
                  try {
                    const response = await fetch(`/api/analytics/customers`);
                    if (!response.ok) throw new Error("Failed to fetch customers");
                    const data = await response.json();
                    setAnalytics(data);
                  } catch (error) {
                    console.log("An error occurred while fetching customers.");
                  }
                };
                fetchCustomers();
              }, []);
            
              return (
                <div>
                  <div className="flex items-center justify-between">
                    <h1 className="text-xl text-gray-600">Customers</h1>
                    <div className="flex items-center px-2 cursor-pointer">
                      <div className="flex justify-center border rounded-md py-1 px-3 mx-3" title="Download product summary">
                        <i className="bi bi-download"></i>
                      </div>
                      <div className="flex border rounded-md py-1 px-3 bg-black text-white cursor-pointer" onClick={onAddCustomerClick}>
                        <i className="bi bi-box-arrow-up mr-2"></i>
                        <span>Export</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center my-3 space-x-3">
                    
                    <div className="border rounded-lg w-full bg-white">
                      <div className="flex p-4 justify-between items-center py-2 border-b">
                        <h4>
                          <i className="bi bi-people text-sm border border-teal-300 px-1 py-[2px] bg-teal-100 text-teal-600 rounded-md mr-3"></i>
                          <span className="text-slate-500 text-sm">Active</span>
                        </h4>
                        <i className="bi bi-three-dots"></i>
                      </div>
                      <div className="p-2 flex items-center justify-center">
                        <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_active)} </div>
                      </div>
                    </div>
            
                    <div className="border rounded-lg w-full bg-white">
                      <div className="flex p-4 justify-between items-center py-2 border-b">
                        <h4>
                          <i className="bi bi-people text-sm border border-orange-300 px-1 py-[2px] bg-orange-100 text-orange-600 rounded-md mr-3"></i>
                          <span className="text-slate-500 text-sm">Pending</span>
                        </h4>
                        <i className="bi bi-three-dots"></i>
                      </div>
                      <div className="p-2 flex items-center justify-center">
                        <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_inactive)}</div>
                      </div>
                    </div>
        
                    <div className="border rounded-lg w-full bg-white">
                      <div className="flex p-4 justify-between items-center py-2 border-b">
                        <h4>
                          <i className="bi bi-people text-sm border border-red-300 px-1 py-[2px] bg-red-100 text-red-600 rounded-md mr-3"></i>
                          <span className="text-slate-500 text-sm">Inactive</span>
                        </h4>
                        <i className="bi bi-three-dots"></i>
                      </div>
                      <div className="p-2 flex items-center justify-center">
                        <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_pending)}</div>
                      </div>
                    </div>
        
                    <div className="border rounded-lg w-full bg-white">
                      <div className="flex p-4 justify-between items-center py-2 border-b">
                        <h4>
                          <i className="bi bi-people text-sm border border-sky-300 px-1 py-[2px] bg-sky-100 text-sky-700 rounded-md mr-3"></i>
                          <span className="text-slate-500 text-sm">Total customers</span>
                        </h4>
                        <i className="bi bi-three-dots"></i>
                      </div>
                      <div className="p-2 flex items-center justify-center">
                        <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_customers)}
                        </div>
                      </div>
                    </div>
            
                  </div>
                </div>
            );
};
  const buttons = [
    {"id":1, "name": ""},
    {"id":2, "name": "active"},
    {"id":3, "name": "inactive"},
    {"id":4, "name": "univerified"},
    {"id":5, "name": "pending"},
  ];

const CustomersList = () => {
  const [Customers, setCustomers] = useState<Customer[]>([]);
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
    const totalPages = Math.ceil(Customers.length / itemsPerPage);
  
    // Get Customers for the current page
    const currentCustomers = Customers.slice(
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
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`/api/customers?sort=${sort}&search=${search}&filter=${filter}`);
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data);
        setLoading(false)
      } catch (error) {
        setError("An error occurred while fetching customers.");
      }
    };
    fetchCustomers();
  }, [sort, filter, search]);



  const toggleDropdown = (CustomerId: number) => {
      setDropdownOpen(dropdownOpen === CustomerId ? null : CustomerId);
  };

  const handleBlock = async (CustomerId: number) => {
    const response = await fetch(`/api/customers/lock`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: CustomerId }),
      });

      if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json(); // Try to parse JSON
        } catch (err) {
            // If parsing fails, handle it here
            setError("Failed to cancel Customer: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to cancel Customer");
        return;
    }

      // Update the Customers list to remove the archived Customer or update its status
      setCustomers((prevCustomers) => 
          prevCustomers.map(Customer => 
              Customer.id === CustomerId ? { ...Customer, status: 'Locked' } : Customer
          )
      );
  };
  const handleApprove = async (CustomerId: number) => {
    const response = await fetch(`/api/customers/approve`, {
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ id: CustomerId }),
      });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (err) {
            setError("Failed to approve Customer: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to approve Customer");
        return;
    }

    // Update the Customers list to set the approved status
    setCustomers((prevCustomers) => 
        prevCustomers.map(Customer => 
            Customer.id === CustomerId ? { ...Customer, status: 'active' } : Customer
        )
    );
};

  if (loading) {
      return <div className="text-center py-6">Loading customers...</div>;
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
           {Customers.length <= 0 ? (
                <div className="w-full min-h-[60vh] flex items-center justify-center">
                   <div className="flex flex-col justify-center items-center opacity-65">
                     <div className="img w-[200px] h-[200px]">
                        <img src="/icons/shopping (1).png" alt="" className="w-full h-full object-contain"/>
                     </div>
                     <i>No customers found.</i>
                   </div>
                </div>
            ) : (
            <>
              <table className="w-full mt-5">
                   <thead className="space-x-2 border-t-2 border-b-2 border-slate-100 text-sm text-slate-400 p-2 text-left">
                      <tr className="text-sm leading-tight text-gray-400 font-light">
                          <th className="py-2 px-2 font-normal">Name</th>
                          <th className="py-2 px-2 font-normal">Phone</th>
                          <th className="py-2 px-2 font-normal">Email</th>
                          <th className="py-2 px-2 font-normal">Nationality</th>
                          <th className="py-2 px-2 font-normal">Orders</th>
                          <th className="py-2 px-2 font-normal">Created At</th>
                          <th className="py-2 px-2 font-normal">Status</th>
                          <th className="py-2 px-2 font-normal">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                      {currentCustomers.map((customer) => (
                          <tr
                          key={customer.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                            >
                              <td className="py-2 px-2 text-left flex items-center flex-nowrap space-x-2">
                                  <div className="w-10 h-10 rounded-full overflow-hidden bcustomer bcustomer-gray-200">
                                      <img
                                          src={customer.photo || "/icons/profile.png"}
                                          alt={customer.first_name}
                                          className="w-full h-full object-cover"
                                      />
                                  </div>
                                  <span className="text-nowrap">{customer.first_name +" "+customer.last_name}</span>
                              </td>
                              <td className="py-2 px-2 text-nowrap ">{customer.phone}</td>
                              <td className="py-2 px-2">{customer.email}</td>
                              <td className="py-2 px-2">{customer.nationality}</td>
                              <td className="py-2 px-2">{customer.orders}</td>
                              <td className="py-2 px-2">{getTimeDifference(customer.created_at)}</td>
                              <td className="py-2 px-2">
                                <span
                                      className={`py-1 px-3 rounded text-xs text-nowrap capitalize  ${
                                          (customer.status === "Active")
                                              ? "bg-green-100 text-green-600"
                                              : "bg-orange-100 text-orange-500"
                                      }`}
                                  >
                                      {customer.status}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-center relative">
                                  <i
                                      className="bi bi-three-dots cursor-pointer text-xl"
                                      onClick={() => toggleDropdown(customer.id)}
                                  ></i>
                                  {dropdownOpen === customer.id && (
                                      <div className="absolute right-0 mt-1 mr-1 w-36 bg-white bCustomer rounded-md shadow-lg z-10">
                                          <ul className="py-1 text-gray-700">
                                              <li 
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                    handleApprove(customer.id); // Approve the Customer
                                                    toggleDropdown(customer.id); // Close the dropdown
                                                }}
                                              >
                                                  <i className="bi bi-check-circle mr-2 text-green-500 hover:bg-slate-100"></i> Approve
                                              </li>
                                              <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      handleBlock(customer.id); // Trigger the setup Customer click
                                                      toggleDropdown(customer.id); // Close the dropdown
                                                  }}
                                              >
                                                  <i className="bi bi-slash-circle mr-2 text-red-500 hover:bg-slate-100"></i> Lock
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
export {CustomersList};
