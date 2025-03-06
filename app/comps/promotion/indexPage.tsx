"use client";
import React, { useState, useEffect } from "react";

interface Promotion {
    id: number;
    promotion_type: string;
    product_id: string;
    product: string;
    promotion: string;
    created_date: string; 
    expiry_date: string; 
    status: string;
  }
  const formatNumber = (amount: number | any): string => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
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
    total_active: number;
    total_inactive: number;
    total_expired: number;
    total_promotions: number;

  }

  interface HeaderProps {
    onAddPromotionClick: () => void;
  }
 
  const Header = ({ onAddPromotionClick }: HeaderProps) => {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
         // Fetch Promotions
         useEffect(() => {
           const fetchPromotions = async () => {
             try {
               const response = await fetch(`/api/analytics/promotions`);
               if (!response.ok) throw new Error("Failed to fetch promotions");
               const data = await response.json();
               setAnalytics(data);
             } catch (error) {
               console.log("An error occurred while fetching promotions.");
             }
           };
           fetchPromotions();
         }, []);
       
         return (
           <div>
             <div className="flex items-center justify-between">
               <h1 className="text-xl text-gray-600">Promotions</h1>
               <div className="flex items-center px-2 cursor-pointer">
                 <div className="flex justify-center border rounded-md py-1 px-3 mx-3" title="Download product summary">
                   <i className="bi bi-download"></i>
                 </div>
                 <div className="flex border rounded-md py-1 px-3 bg-amber-500 text-white cursor-pointer" onClick={onAddPromotionClick}>
                   <i className="bi bi-plus-circle mr-2"></i>
                   <span>Add Promotion</span>
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
                   <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_active)} </div>
                 </div>
               </div>
       
               <div className="border rounded-lg w-full bg-white">
                 <div className="flex p-4 justify-between items-center py-2 border-b">
                   <h4>
                     <i className="bi bi-box-seam text-sm border border-red-300 px-1 py-[2px] bg-red-100 text-red-600 rounded-md mr-3"></i>
                     <span className="text-slate-500 text-sm">Exipred</span>
                   </h4>
                   <i className="bi bi-three-dots"></i>
                 </div>
                 <div className="p-2 flex items-center justify-center">
                   <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_expired)}</div>
                 </div>
               </div>
   
               <div className="border rounded-lg w-full bg-white">
                 <div className="flex p-4 justify-between items-center py-2 border-b">
                   <h4>
                     <i className="bi bi-box-seam text-sm border border-orange-300 px-1 py-[2px] bg-orange-100 text-orange-600 rounded-md mr-3"></i>
                     <span className="text-slate-500 text-sm">Inactive</span>
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
                     <i className="bi bi-box-seam text-sm border border-slate-300 px-1 py-[2px] bg-slate-100 text-slate-700 rounded-md mr-3"></i>
                     <span className="text-slate-500 text-sm">Total promotions</span>
                   </h4>
                   <i className="bi bi-three-dots"></i>
                 </div>
                 <div className="p-2 flex items-center justify-center">
                   <div className="text-2xl text-slate-800"> {formatNumber(analytics?.total_promotions)}
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
    {"id":3, "name": "expired"},
    {"id":4, "name": "inactive"},
    {"id":5, "name": "pending"},
  ];

const PromotionList = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
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
    const totalPages = Math.ceil(promotions.length / itemsPerPage);
  
    // Get Promotions for the current page
    const currentPromotions = promotions.slice(
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
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`/api/promotion?sort=${sort}&search=${search}&filter=${filter}`);
        if (!response.ok) throw new Error("Failed to fetch promotions");
        const data = await response.json();
        setPromotions(data);
        setLoading(false)
      } catch (error) {
        setError("An error occurred while fetching promotions.");
      }
    };
    fetchPromotions();
  }, [sort, filter, search]);


  const toggleDropdown = (promotionId: number) => {
      setDropdownOpen(dropdownOpen === promotionId ? null : promotionId);
  };

  const handleUpdate = async (promotionId: number) => {
    const response = await fetch(`/api/promotion/inactivate`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: promotionId }),
    });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (err) {
            setError("Failed to approve promotion: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to approve promotion");
        return;
    }

    // Update the promotions list to set the approved status
    setPromotions((prevPromotions) => 
        prevPromotions.map(promotion => 
            promotion.id === promotionId ? { ...promotion, status: 'Inactive' } : promotion
        )
    );
};

const handleDelete = async (promotionId: number) => {
   const response = await fetch(`/api/promotion/delete`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id: promotionId }),
  });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (err) {
            setError("Failed to delete promotion: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to delete promotion");
        return;
    }

    // Update the promotions list to remove the deleted promotion
    setPromotions((prevPromotions) => 
        prevPromotions.filter(promotion => promotion.id !== promotionId)
    );
};

  if (loading) {
      return <div className="text-center py-6">Loading promotions...</div>;
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
           {promotions.length <= 0 ? (
                <div className="w-full min-h-[60vh] flex items-center justify-center">
                   <div className="flex flex-col justify-center items-center opacity-65">
                     <div className="img w-[200px] h-[200px]">
                        <img src="/icons/shopping (1).png" alt="" className="w-full h-full object-contain"/>
                     </div>
                     <i>No promotions found.</i>
                   </div>
                </div>
            ) : (
                <>
           <table className="w-full mt-5">
                   <thead className="space-x-2 border-t-2 border-b-2 border-slate-100 text-sm text-slate-400 p-2 text-left">
                      <tr className="text-sm leading-tight text-gray-400 font-light">
                          <th className="py-2 px-2 font-normal">Type</th>
                          <th className="py-2 px-2 font-normal">Promotion</th>
                          <th className="py-2 px-2 font-normal">Target </th>
                          <th className="py-2 px-2 font-normal">Initiated Date</th>
                          <th className="py-2 px-2 font-normal">Expiry Date</th>
                          <th className="py-2 px-2 font-normal">Status</th>
                          <th className="py-2 px-2 font-normal">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                      {currentPromotions.map((promotion) => (
                         
                          <tr
                              key={promotion.id}
                              className="border-b border-gray-200 hover:bg-gray-50"
                          >
                              <td className="py-2 px-2">{promotion.promotion_type}</td>
                              <td className="py-2 px-2">{promotion.promotion}%</td>
                              <td className="py-2 px-2 capitalize">{promotion.product || promotion.product_id}</td>
                              <td className="py-2 px-2">{timeAgo(promotion.created_date)}</td>
                              <td className="py-2 px-2">{timeAgo(promotion.expiry_date)}</td>
                              <td className="py-2 px-2">
                                  <span
                                      className={`py-1 px-3 rounded-full text-xs capitalize ${
                                          promotion.status == "active"
                                              ? "bg-green-100 text-green-600"
                                              : "bg-red-100 text-red-600"
                                      }`}
                                  >
                                      {promotion.status}
                                  </span>
                              </td>
                              <td className="py-2 px-2 text-center relative">
                                  <i
                                      className="bi bi-three-dots cursor-pointer text-xl"
                                      onClick={() => toggleDropdown(promotion.id)}
                                  ></i>
                                  {dropdownOpen === promotion.id && (
                                      <div className="absolute right-0 mt-1 mr-1 w-36 bg-white border rounded-md shadow-lg z-10">
                                          <ul className="py-1 text-gray-700">
                                              <li 
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                    handleUpdate(promotion.id); // Approve the promotion
                                                    toggleDropdown(promotion.id); // Close the dropdown
                                                }}
                                              >
                                                  <i className="bi bi-archive border rounded-full mr-2 text-orange-500 hover:bg-slate-100"></i> Inactivate
                                              </li>
                                              
                                              <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      handleDelete(promotion.id); // Delete the promotion
                                                      toggleDropdown(promotion.id); // Close the dropdown
                                                  }}
                                              >
                                                  <i className="bi bi-trash mr-2 text-red-500 hover:bg-slate-100"></i> Delete
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
export {PromotionList};