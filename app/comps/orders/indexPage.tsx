"use client";
import React, { useState, useEffect } from "react";


interface Order {
    order_id: number;
    order_number: number;
    total_amount: string;
    Orders: string;
    details: string;
    status: string;
    created_at: string;
    user_id: number;
    first_name: string;
    last_name: string;
    photo: string;
    payment_id: number; 
    payment_status: string;
    count: string;
  }

  interface Analytics {
    total_orders: number;
    total_active: number;
    total_pending: number;
    total_approved: number;
    total_delivered: number;
    total_canceled: number;
  }

  interface OrderListProprs{
    onSetupOrderClick: (productId: string) => void;
    onViewDetailsClick: (order: any) => void;
  }
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
  const Header = () => {
    
      const [analytics, setAnalytics] = useState<Analytics | null>(null);
      // Fetch orders
      useEffect(() => {
        const fetchOrders = async () => {
          try {
            const response = await fetch(`/api/analytics/orders`);
            if (!response.ok) throw new Error("Failed to fetch orders");
            const data = await response.json();
            setAnalytics(data);
          } catch (error) {
            console.log("An error occurred while fetching orders.");
          }
        };
        fetchOrders();
      }, []);
    
      return (
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl text-gray-600">Orders</h1>
            <div className="flex items-center px-2 cursor-pointer">
              <div className="flex justify-center border rounded-md py-1 px-3 mx-3" title="Download product summary">
                <i className="bi bi-download"></i>
              </div>
              <div className="flex border rounded-md py-1 px-3 bg-amber-500 text-white cursor-pointer" >
                <i className="bi bi-plus-circle mr-2"></i>
                <span>Export</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center my-3 space-x-3">
            
            <div className="border rounded-lg w-full bg-white">
              <div className="flex p-4 justify-between items-center py-2 border-b">
                <h4>
                  <i className="bi bi-box-seam text-sm border border-teal-300 px-1 py-[2px] bg-teal-100 text-teal-600 rounded-md mr-3"></i>
                  <span className="text-slate-500 text-sm">Active</span>
                </h4>
                <i className="bi bi-three-dots"></i>
              </div>
              <div className="p-2 flex items-center justify-center">
                <div className="text-2xl text-slate-800"> {analytics?.total_active} </div>
              </div>
            </div>
    
            <div className="border rounded-lg w-full bg-white">
              <div className="flex p-4 justify-between items-center py-2 border-b">
                <h4>
                  <i className="bi bi-box-seam text-sm border border-slate-300 px-1 py-[2px] bg-slate-100 text-slate-600 rounded-md mr-3"></i>
                  <span className="text-slate-500 text-sm">Approved</span>
                </h4>
                <i className="bi bi-three-dots"></i>
              </div>
              <div className="p-2 flex items-center justify-center">
                <div className="text-2xl text-slate-800"> {analytics?.total_approved} </div>
              </div>
            </div>

            <div className="border rounded-lg w-full bg-white">
              <div className="flex p-4 justify-between items-center py-2 border-b">
                <h4>
                  <i className="bi bi-box-seam text-sm border border-teal-300 px-1 py-[2px] bg-teal-100 text-teal-600 rounded-md mr-3"></i>
                  <span className="text-slate-500 text-sm">Delivered</span>
                </h4>
                <i className="bi bi-three-dots"></i>
              </div>
              <div className="p-2 flex items-center justify-center">
                <div className="text-2xl text-slate-800"> {analytics?.total_delivered} </div>
              </div>
            </div>

            <div className="border rounded-lg w-full bg-white">
              <div className="flex p-4 justify-between items-center py-2 border-b">
                <h4>
                  <i className="bi bi-box-seam text-sm border border-amber-300 px-1 py-[2px] bg-amber-100 text-amber-700 rounded-md mr-3"></i>
                  <span className="text-slate-500 text-sm">Pending</span>
                </h4>
                <i className="bi bi-three-dots"></i>
              </div>
              <div className="p-2 flex items-center justify-center">
                <div className="text-2xl text-slate-800"> {analytics?.total_pending} 
                </div>
              </div>
            </div>

            <div className="border rounded-lg w-full bg-white">
              <div className="flex p-4 justify-between items-center py-2 border-b">
                <h4>
                  <i className="bi bi-box-seam text-sm border border-red-300 px-1 py-[2px] bg-red-100 text-red-700 rounded-md mr-3"></i>
                  <span className="text-slate-500 text-sm">Canceled</span>
                </h4>
                <i className="bi bi-three-dots"></i>
              </div>
              <div className="p-2 flex items-center justify-center">
                <div className="text-2xl text-slate-800"> {analytics?.total_canceled} 
                </div>
              </div>
            </div>
    
            <div className="border rounded-lg w-full bg-white">
              <div className="flex p-4 justify-between items-center py-2 border-b">
                <h4>
                  <i className="bi bi-box-seam text-sm border border-orange-300 px-1 py-[2px] bg-orange-100 text-orange-600 rounded-md mr-3"></i>
                  <span className="text-slate-500 text-sm">Total Orders</span>
                </h4>
                <i className="bi bi-three-dots"></i>
              </div>
              <div className="p-2 flex items-center justify-center">
                <div className="text-2xl text-slate-800"> {analytics?.total_orders} </div>
              </div>
            </div>
    
    
          </div>
        </div>
    );
};

 const buttons = [
    {"id":1, "name": ""},
    {"id":2, "name": "Active"},
    {"id":3, "name": "Delivered"},
    {"id":4, "name": "Paid"},
    {"id":5, "name": "Pending"},
    {"id":6, "name": "Shipped"},
    {"id":7, "name": "Canceled"},
  ];

const OrderList = ({ onSetupOrderClick, onViewDetailsClick } : OrderListProprs) => {
  const [Orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
    const [activeId, setActiveId] = useState(1);
    const [sort, setSort] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] =useState("");
    const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState("");

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("adminSession") || "null");
    setRole(session?.role);
  }, [role])

    const itemsPerPage = 15;
  
    // Calculate total pages
    const totalPages = Math.ceil(Orders.length / itemsPerPage);
  
    // Get Orders for the current page
    const currentOrders = Orders.slice(
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
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?sort=${sort}&search=${search}&filter=${filter}`);
        if (!response.ok) throw new Error("Failed to fetch Orders");
        const data = await response.json();
        setOrders(data);
        setLoading(false)
      } catch (error) {
        setError("An error occurred while fetching Orders.");
      }
    };
    fetchOrders();
  }, [sort, filter, search]);



  const toggleDropdown = (OrderId: number) => {
      setDropdownOpen(dropdownOpen === OrderId ? null : OrderId);
  };

  const handleArchive = async (OrderId: number) => {
    const response = await fetch(`/api/orders/cancel`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: OrderId }),
    });

      if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json(); // Try to parse JSON
        } catch (err) {
            // If parsing fails, handle it here
            setError("Failed to cancel Order: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to cancel Order");
        return;
    }

      // Update the Orders list to remove the archived Order or update its status
      setOrders((prevOrders) => 
          prevOrders.map(Order => 
              Order.order_id === OrderId ? { ...Order, status: 'Canceled' } : Order
          )
      );
  };



  if (loading) {
      return <div className="text-center py-6">Loading Orders...</div>;
  }

  if (error) {
      return <div className="text-center text-red-500 py-6"> {error}</div>;
  }

  if(role !== "admin"){
    <div className="fixed w-full h-full z-50 pointer-events-none"></div>
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
           {Orders.length <= 0 ? (
                <div className="w-full min-h-[60vh] flex items-center justify-center">
                   <div className="flex flex-col justify-center items-center opacity-65">
                     <div className="img w-[200px] h-[200px]">
                        <img src="/icons/shopping (1).png" alt="" className="w-full h-full object-contain"/>
                     </div>
                     <i>No order found.</i>
                   </div>
                </div>
            ) : (
                <>
              <table className="w-full mt-5">
                   <thead className="space-x-2 border-t-2 border-b-2 border-slate-100 text-sm text-slate-400 p-2 text-left">
                      <tr className="text-sm leading-tight text-gray-400 font-light">
                          <th className="py-2 px-2 font-normal">Order Number</th>
                          <th className="py-2 px-2 font-normal">Customer</th>
                          <th className="py-2 px-2 font-normal">Amount</th>
                          <th className="py-2 px-2 font-normal">Products</th>
                          <th className="py-2 px-2 font-normal">Status</th>
                          <th className="py-2 px-2 font-normal">Payment Status</th>
                          <th className="py-2 px-2 font-normal">Date</th>
                          <th className="py-2 px-2 font-normal">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                      {currentOrders.map((order) => (
                          <tr
                              key={order.order_id}
                              className="border-b border-gray-200 hover:bg-gray-50"
                          >  
                              <td className="py-2 px-2">#{order.order_number}</td>
                              <td className="py-2 pr-6 text-left flex items-center space-x-2">
                              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                      <img
                                          src={order.photo || "/icons/profile.png"}
                                          alt={order.first_name}
                                          className="w-full h-full object-cover"
                                      />
                                  </div>
                                  <span>{order.first_name +" "+order.last_name}</span>
                              </td>
                              <td className="py-2 px-2">RF {order.total_amount}</td>
                              <td className="py-2 px-2">{order.count}</td>
                              <td className="py-2 px-2 text-center"> <span className={`
                                ${order.status === 'Delivered'  ? 'bg-green-100 text-green-600 border-green-300 '
                                : order.status === 'Pending' || order.status === "Approved" || order.status === 'Draft' 
                                ? 'bg-yellow-100 text-yellow-600 border-yellow-300' 
                                : order.status === 'Archived' 
                                ? 'bg-amber-800 bg-opacity-30 text-amber-900 border-amber-800'
                                : 'bg-slate-100 text-slate-600 border-slate-300 '
                                } rounded px-1 border`}>{order.status}</span></td>
                              <td className="py-2 px-2">
                                    <span
                                      className={`py-1 px-3 rounded text-xs ${
                                          order.payment_status == "Paid"
                                              ? "bg-green-100 text-green-600"
                                              : "bg-orange-100 text-orange-500"
                                      }`}
                                  >
                                      {order.payment_status || "Not paid"}
                                  </span>
                              </td>
                              <td className="py-2 px-2">{formatDate(order.created_at)}</td>
                              <td className="py-2 px-2 text-center relative">
                                  <i
                                      className="bi bi-three-dots cursor-pointer text-xl"
                                      onClick={() => toggleDropdown(order.order_id)}
                                  ></i>
                                  {dropdownOpen === order.order_id && (
                                      <div className="absolute right-0 mt-1 mr-1 w-36 bg-white border rounded-md shadow-lg z-10">
                                          <ul className="py-1 text-gray-700">
                                              {order.status === "Delivered" && order.payment_status === "Paid"? (
                                                <li
                                                className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                onClick={() => {
                                                    onViewDetailsClick(order);
                                                    toggleDropdown(order.order_id); // Close the dropdown
                                                }}
                                                >
                                                <i className="bi bi-info mr-2 text-blue-500 hover:bg-slate-100"></i> Details
                                                </li>
                                              ) : order.payment_status === "Paid" && order.status === "Pending" ? (
                                                <>
                                                {order.payment_status === "Paid" && (<li 
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                    onSetupOrderClick(order.order_number+", "+order.order_id); // Assign the Order
                                                    toggleDropdown(order.order_id); // Close the dropdown
                                                }}
                                                >
                                                  <i className="bi bi-check-circle mr-2 text-green-500 hover:bg-slate-100"></i> Assign
                                                </li>)}
                                                
                                                <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      onViewDetailsClick(order);
                                                      toggleDropdown(order.order_id); // Close the dropdown
                                                  }}
                                                >
                                                  <i className="bi bi-info mr-2 text-blue-500 hover:bg-slate-100"></i> Details
                                                </li>
                                                </>
                                              ) : order.status === "Approved" ? (
                                                <>
                                                <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      onViewDetailsClick(order);
                                                      toggleDropdown(order.order_id); // Close the dropdown
                                                  }}
                                                >
                                                  <i className="bi bi-info mr-2 text-blue-500 hover:bg-slate-100"></i> Details
                                                </li>
                                                 <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      handleArchive(order.order_id); // Archive the Order
                                                      toggleDropdown(order.order_id); // Close the dropdown
                                                  }}
                                                  >
                                                  <i className="bi bi-archive-fill mr-2 text-orange-500 hover:bg-slate-100"></i> Cancel
                                                 </li>
                                                </>
                                              ) : order.status === "Canceled" ? (
                                                <>
                                                 {order.payment_status === "Paid" && (<li 
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                    onSetupOrderClick(order.order_number+", "+order.order_id); // Assign the Order
                                                    toggleDropdown(order.order_id); // Close the dropdown
                                                }}
                                                >
                                                  <i className="bi bi-check-circle mr-2 text-green-500 hover:bg-slate-100"></i> Assign
                                                </li>)}
                                                <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      onViewDetailsClick(order);
                                                      toggleDropdown(order.order_id); // Close the dropdown
                                                  }}
                                                >
                                                  <i className="bi bi-info mr-2 text-blue-500 hover:bg-slate-100"></i> Details
                                                </li>
                                                </>
                                              ) : (
                                                <>
                                                 {order.payment_status === "Paid" && (<li 
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                    onSetupOrderClick(order.order_number+", "+order.order_id); // Assign the Order
                                                    toggleDropdown(order.order_id); // Close the dropdown
                                                }}
                                                >
                                                  <i className="bi bi-check-circle mr-2 text-green-500 hover:bg-slate-100"></i> Assign
                                                </li>)}
                                                <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      onViewDetailsClick(order);
                                                      toggleDropdown(order.order_id); // Close the dropdown
                                                  }}
                                                >
                                                  <i className="bi bi-info mr-2 text-blue-500 hover:bg-slate-100"></i> Details
                                                </li>
                                                 <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      handleArchive(order.order_id); // Archive the Order
                                                      toggleDropdown(order.order_id); // Close the dropdown
                                                  }}
                                                  >
                                                  <i className="bi bi-archive-fill mr-2 text-orange-500 hover:bg-slate-100"></i> Cancel
                                                 </li>
                                                </>
                                              )}
                                              
                                             
                                            
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
export {OrderList};
