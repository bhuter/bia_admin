"use client";
import React, { useState, useEffect } from "react";

interface Product {
  name: string;
  price: string;
  category: string;
  description: string;
  stock: number;
  image: File | null;
}

interface Category {
  id: number;
  cat_name: string;
}

interface AddProductProps {
  onClose: () => void;
}

const AddProduct = ({ onClose }: AddProductProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    price: "",
    category: "",
    description: "",
    stock: 1,
    image: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products/category")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    setFilteredCategories(categories.filter((cat) => 
      cat.cat_name.toLowerCase().includes(term.toLowerCase())
    ));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "stock") {
      setNewProduct({ ...newProduct, [name]: isNaN(parseInt(value)) ? 0 : parseInt(value) });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewProduct({ ...newProduct, image: e.target.files[0] });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!newProduct.name) newErrors.name = "Product name is required";
    if (!newProduct.price) newErrors.price = "Product price is required";
    if (!newProduct.category) newErrors.category = "Product category is required";
    if (!newProduct.description) newErrors.description = "Product description is required";
    if (newProduct.stock < 1) newErrors.stock = "Stock must be at least 1";
    if (!newProduct.image) newErrors.image = "Product image is required"; // ensure error if image missing
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("category_id", newProduct.category);
    formData.append("description", newProduct.description);
    formData.append("stock", newProduct.stock.toString());
    if (newProduct.image) formData.append("image", newProduct.image);

    try {
      const response = await fetch("/api/products/addNew", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const data = await response.json();
      setMessage("Product added successfully ✅");
      setNewProduct({ name: "", price: "", category: "", description: "", stock: 1, image: null });
      setSearchTerm("");
      setFilteredCategories([]);
    } catch (error) {
      console.error("Error adding product:"+error, error);
      setMessage(String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: string) => {
    const selectedCategory = categories.find((cat) => cat.cat_name === category);
    if (selectedCategory) setNewProduct({ ...newProduct, category: selectedCategory.cat_name });
    setSearchTerm(category);
    setFilteredCategories([]);
  };
  return (
    <div className="fixed flex justify-center items-center bg-slate-100 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-50">
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-2 py-1 border top-7 text-2xl font-bold cursor-pointer text-red-400 border-red-300 hover:bg-slate-50 hover:border rounded-full"
      ></i>
      <div className="max-w-2xl w-full rounded-xl px-6 py-3 bg-white border shadow-md">
        <h4 className="text-2xl font-bold text-slate-700 pb-3 pt-1 text-center">
          Add New Product
        </h4>
  
        <form className="space-y-3" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="flex">

        
          <div className="w-[50%]">
         
  
          {/* Product Name */}
          <div className="flex flex-col">
            <label className="text-sm text-slate-700">Name</label>
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              placeholder="Product name"
              className="px-5 py-3 outline-none border-slate-300 text-sm border my-1 font-medium text-slate-500"
            />
            {errors.name && (
              <span className="text-red-500 text-xs">{errors.name}</span>
            )}
          </div>
  
          {/* Price */}
          <div className="flex flex-col">
            <label className="text-sm text-slate-700">Price</label>
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleInputChange}
              placeholder="Product price"
              className="px-5 py-3 outline-none border-slate-300 text-sm border my-1 font-medium text-slate-500"
            />
            {errors.price && (
              <span className="text-red-500 text-xs">{errors.price}</span>
            )}
          </div>

           {/* Category */}
           <div className="flex flex-col relative">
            <label className="text-sm text-slate-700">Category</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search category"
              className="px-5 py-3 outline-none border-slate-300 text-sm border my-1 font-medium text-slate-500"
            />
            {filteredCategories.length > 0 && (
              <ul className="absolute left-0 w-full border rounded-lg max-h-32 overflow-y-auto bg-white shadow-lg z-10">
                {filteredCategories.map((category) => (
                  <li
                    key={category.id}
                    onClick={() => handleCategorySelect(category.cat_name)}
                    className="p-2 hover:bg-blue-100 cursor-pointer"
                  >
                    {category.cat_name}
                  </li>
                ))}
              </ul>
            )}
            {/*(
              <button
                type="button"
                onClick={() => handleCategorySelect(searchTerm)} // Use searchTerm as the selected category
                className="mt-2 bg-green-500 text-white py-1 rounded-lg text-sm"
              >
                Add "{searchTerm}" to Category
              </button>
            )*/}
            {errors.category && (
              <span className="text-red-500 text-xs">{errors.category}</span>
            )}
          </div>
        </div>


        <div className="w-[50%] ml-1">
           {/* Stock */}
           <div className="flex flex-col">
            <label className="text-sm text-slate-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleInputChange}
              placeholder="Stock quantity"
              className="px-5 py-3 outline-none border-slate-300 text-sm border my-1 font-medium text-slate-500"
              min="1"
            />
            {errors.stock && (
              <span className="text-red-500 text-xs">{errors.stock}</span>
            )}
           </div>
         
           {/* Product Image */}
          <div className="flex flex-col">
            <label className="text-sm text-slate-700">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="px-5 py-2 outline-none border-slate-300 text-sm border my-1 font-medium text-slate-500"
            />
            {errors.image && (
              <span className="text-red-500 text-xs">{errors.image}</span>
            )}
          </div>
         
          {/* Description */}
          <div className="flex flex-col">
            <label className="text-sm text-slate-700">Description</label>
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleInputChange}
              placeholder="Product description"
              className="px-5 py-2 outline-none border-slate-300 text-sm border my-1 font-medium text-slate-500 h-14"
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-xs">{errors.description}</span>
            )}
          </div>
        
          </div>
        </div>
          {/* Success or Error Message */}
          {message && typeof message === "string" && (
            <div
              className={`rounded-lg ${
                message.includes("successfully") ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
  
          {/* Submit Button */}
          <button
            type="submit"
            className="flex items-center justify-center font-bold text-sm py-3 border w-full my-2 text-white bg-sky-500"
            disabled={loading}
          >
            {loading ? (
              <span className="loader border-t-2 border-r-2 border-white border-solid rounded-full h-5 w-5 animate-spin"></span>
            ) : (
              "Add Product"
            )}
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
