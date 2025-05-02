"use client";
import React, { useState, useEffect } from "react";
import AlertNotification from "../toggles/notify";

interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    orders: number; // Assuming you have an orders field in your API response
    status: string; // This can be 'In Stock', 'Out of Stock', etc.
    stock: number;
    image: string; // Assuming you have an image field in your API response
  }

interface ProductHeaderProps{
  onAddProductClick: () => void;
}


interface Product {
  id: number;
  status: string;
  title: string;
  producter: string;
  year: string;
  progress_status: string;//ie. ongoing, completed
  created_at: string;
  hashed_id: string;
}

interface Analytics {
  total_products: number,
  total_archived: number,
  total_pending: number,
  total_active: number,
}




const Header = ({onAddProductClick}: ProductHeaderProps) => {

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  // Fetch products
  useEffect(() => {
    const fetchproducts = async () => {
      try {
        const response = await fetch(`/api/analytics/products`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.log("An error occurred while fetching products.");
      }
    };
    fetchproducts();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-gray-600">Products</h1>
        <div className="flex items-center px-2 cursor-pointer">
          <div className="flex justify-center border rounded-md py-1 px-3 mx-3" title="Download product summary">
            <i className="bi bi-download"></i>
          </div>
          <div onClick={onAddProductClick} className="flex border rounded-md py-1 px-3 bg-amber-500 text-white cursor-pointer" >
            <i className="bi bi-plus-circle mr-2"></i>
            <span>Add product</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center my-3 space-x-10">
        
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
              <span className="text-slate-500 text-sm">Archive</span>
            </h4>
            <i className="bi bi-three-dots"></i>
          </div>
          <div className="p-2 flex items-center justify-center">
            <div className="text-2xl text-slate-800"> {analytics?.total_archived} </div>
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
              <i className="bi bi-box-seam text-sm border border-orange-300 px-1 py-[2px] bg-orange-100 text-orange-600 rounded-md mr-3"></i>
              <span className="text-slate-500 text-sm">Total Products</span>
            </h4>
            <i className="bi bi-three-dots"></i>
          </div>
          <div className="p-2 flex items-center justify-center">
            <div className="text-2xl text-slate-800"> {analytics?.total_products} </div>
          </div>
        </div>


      </div>
    </div>
  );
}

  const buttons = [
    {"id":1, "name": ""},
    {"id":2, "name": "Active"},
    {"id":3, "name": "Archived"},
    {"id":4, "name": "Pending"},
    {"id":5, "name": "Stock Out"},
  ];

const ProductList = ({ onSetupProductClick }: { onSetupProductClick: (productId: number) => void }) => {
  const [products, setProducts] = useState<Product[]>([]);
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
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Get products for the current page
  const currentProducts = products.slice(
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

   const toggleDropdown = (id: number) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
   };
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
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?sort=${sort}&search=${search}&filter=${filter}`);
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
        setLoading(false)
      } catch (error) {
        setError("An error occurred while fetching Products.");
      }
    };
    fetchProducts();
  }, [sort, filter, search]);



  const handleArchive = async (productId: number) => {
    const response = await fetch(`/api/products/archive`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ id: productId }),
    });
      if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json(); // Try to parse JSON
        } catch (err) {
            // If parsing fails, handle it here
            setError("Failed to archive product: Server returned an error without JSON.");
            return;
        }
        
        setError(errorData.message || "Failed to archive product");
        return;
    }

      // Update the products list to remove the archived product or update its status
      setProducts((prevProducts) => 
          prevProducts.map(product => 
              product.id === productId ? { ...product, status: 'Archived' } : product
          )
      );
  };

const handleDelete = async (productId: number) => {
  const response = await fetch(`/api/products/delete`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ id: productId }),
  });

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (err) {
            setError("Failed to delete product: Server returned an error without JSON.");
            return;
        }
        
        setError("Failed to delete product");
        return;
    }

    // Update the products list to remove the deleted product
    setProducts((prevProducts) => 
        prevProducts.filter(product => product.id !== productId)
    );
};

  if (loading) {
      return <div className="text-center py-6">Loading products...</div>;
  }


  return (
    <>
    {error && <AlertNotification message={""+error} type="error" />}
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
          <div className="overflow-x-auto">
           {products.length <= 0 ? (
                <div className="w-full min-h-[60vh] flex items-center justify-center">
                   <div className="flex flex-col justify-center items-center opacity-65">
                     <div className="img w-[200px] h-[200px]">
                        <img src="/icons/shopping (1).png" alt="" className="w-full h-full object-contain"/>
                     </div>
                     <i>No products found.</i>
                   </div>
                </div>
            ) : (
                <>
              <table className="w-full mt-5">
                   <thead className="space-x-2 border-t-2 border-b-2 border-slate-100 text-sm text-slate-400 p-2 text-left">
                      <tr className="text-sm leading-tight text-gray-400 font-light">
                          <th className="py-2 px-2 font-normal">Product Name</th>
                          <th className="py-2 px-2 font-normal">Category</th>
                          <th className="py-2 px-2 font-normal">Price</th>
                          <th className="py-2 px-2 font-normal">Orders</th>
                          <th className="py-2 px-2 font-normal">Status</th>
                          <th className="py-2 px-2 font-normal">Stock</th>
                          <th className="py-2 px-2 font-normal">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                      {currentProducts.map((product) => (
                          <tr
                              key={product.id}
                              className="border-b border-gray-200 hover:bg-gray-50"
                          >
                              <td className="py-2 pr-6 text-left flex items-center space-x-2">
                                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                                      <img
                                          src={product.image || "/icons/no-photo.png"}
                                          alt={product.name}
                                          className="w-full h-full object-cover"
                                      />
                                  </div>
                                  <span>{product.name}</span>
                              </td>
                              <td className="py-2 px-6">{product.category}</td>
                              <td className="py-2 px-6">RF {product.price}</td>
                              <td className="py-2 px-6">{product.orders}</td>
                              <td className="py-2 px-6 text-center"> <span className={`
                ${product.status === 'Active' || product.status === "Approved" ? 'bg-green-100 text-green-600 border-green-300 '
                : product.status === 'Pending' || product.status === 'Draft' 
                ? 'bg-yellow-100 text-yellow-600 border-yellow-300' 
                : product.status === 'Archived' 
                ? 'bg-amber-800 bg-opacity-30 text-amber-900 border-amber-800'
                : 'bg-slate-100 text-slate-600 border-slate-300 '
                } rounded px-1 border`}>{product.status}</span></td>
                              <td className="py-2 px-6">
                                  <span
                                      className={`py-1 px-3 rounded-full text-xs ${
                                          product.stock > 0
                                              ? "bg-green-100 text-green-600"
                                              : "bg-red-100 text-red-600"
                                      }`}
                                  >
                                      {product.stock > 0 ? "In Stock: " + product.stock : "Out of Stock"}
                                  </span>
                              </td>
                              <td className="py-2 px-6 text-center relative">
                                  <i
                                      className="bi bi-three-dots cursor-pointer text-xl"
                                      onClick={() => toggleDropdown(product.id)}
                                  ></i>
                                  {dropdownOpen === product.id && (
                                      <div className="absolute right-0 mt-1 mr-1 w-36 bg-white border rounded-md shadow-lg z-10">
                                          <ul className="py-1 text-gray-700">
                                              {role !== 'admin' ? (
                                              <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      onSetupProductClick(product.id); // Trigger the setup product click
                                                      toggleDropdown(product.id); // Close the dropdown
                                                  }}
                                              >
                                                  <i className="bi bi-gear-fill mr-2 text-blue-500 hover:bg-slate-100"></i> Publish
                                              </li>
                                            ) : (
                                              <>
                                              <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      onSetupProductClick(product.id); // Trigger the setup product click
                                                      toggleDropdown(product.id); // Close the dropdown
                                                  }}
                                              >
                                                  <i className="bi bi-gear-fill mr-2 text-blue-500 hover:bg-slate-100"></i> Publish
                                              </li>
                                              <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      handleArchive(product.id); // Archive the product
                                                      toggleDropdown(product.id); // Close the dropdown
                                                  }}
                                              >
                                                  <i className="bi bi-archive-fill mr-2 text-orange-500 hover:bg-slate-100"></i> Archive
                                              </li>
                                              <li
                                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center"
                                                  onClick={() => {
                                                      handleDelete(product.id); // Delete the product
                                                      toggleDropdown(product.id); // Close the dropdown
                                                  }}
                                              >
                                                  <i className="bi bi-trash mr-2 text-red-500 hover:bg-slate-100"></i> Delete
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
      </>
  );
};

export default Header;
export {ProductList};