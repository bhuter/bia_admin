"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import AlertNotification from "./notify";


interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string | null;
  archived_at: string | null;
  status: string;
  stock: number;
  sizes: string | "";
  colors: string | "";
  state: string | "";
  delivery_days: number;
  relational_images: string[] | [];
}

interface FormData {
  sizes: string;
  colors: string;
  state: string;
  stock: string;
  name: string;
  price: string;
  category: string;
  description: string;
  delivery_days: number;
  id: number;
  mainPhoto: File | null;
  relationalImages: File[];
}

interface Category {
  id: number;
  cat_name: string;
}

interface SetupProductProps {
  productId: number;
  onClose: () => void;
}
function formatDate(dateString: any) {
  // Convert the string to a Date object
  const date = new Date(dateString);

  // Array of month names
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Extract parts of the date
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Construct the formatted date
  return `${month}, ${day} ${year} ${hours}:${minutes}:${seconds}`;
}

function truncateText(text: string, maxLength: number) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text; // Return the original text if it's within the limit
}

const SetupProduct: React.FC<SetupProductProps> = ({ productId, onClose }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [productData, setProductData] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>({
    sizes: productData?.sizes ?? "", // Default to empty string if undefined
    colors: productData?.colors ?? "",
    state: productData?.state ?? "",
    stock: productData?.stock.toString() ?? "",
    name: productData?.name ?? "",
    price: productData?.price ?? "",
    category: productData?.category ?? "",
    description: productData?.description ?? "",
    delivery_days: productData?.delivery_days ?? 0,
    id: productData?.id ?? 0,
    mainPhoto: null, // Assuming mainPhoto is a separate field
    relationalImages: [] // Assuming relationalImages is an array
  });

  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);


  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
        const response = await fetch(`/api/products/id`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ id: productId }),
        })
        const results = await response.json();
        setProductData(results);
        if (!response.ok) {
         try {
          const res = await response.json();
          setIsError(true);
          setProductData(res) // Try to parse JSON
          } catch (err) {
            setIsError(true)
            setMessage(""+err)
          }
    };
    
  }
    if(productId) { fetchProduct() };
  }, [productId]);

   useEffect(() => {
      fetch("/api/products/category")
        .then((response) => response.json())
        .then((data) => setCategories(data))
        .catch((error) => setMessage("Error fetching categories"));
    }, []);
  
    // Once productData is available, update formData using useEffect
useEffect(() => {
  if (productData) {
    setFormData({
      sizes: productData.sizes,
      colors: productData.colors,
      state: productData.state,
      stock: productData.stock.toString(),
      name: productData.name,
      price: productData.price,
      category: productData.category,
      description: productData.description,
      delivery_days: productData.delivery_days,
      id: productData.id,
      mainPhoto:  null,
      relationalImages:  [],
    });
  }
}, [productData]); // Run effect when productData changes
  
  // Handle form changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file change for main photo
  const handleMainPhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        mainPhoto: file,
      });
    }
  };
  
  // Handle file change for relational images
  const handleRelationalImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files) {
      
      const imagePreviews = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewImages(imagePreviews);

      setFormData({
        ...formData,
        relationalImages: Array.from(files),
      });
    }
  };
  

  // Validate required fields
  const validateForm = () => {
    const requiredFields = ["sizes", "colors", "state", "stock", "name", "price", "category", "description", "delivery_days"];
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        setMessage("Please fill out all required fields.");
        setIsError(true);
        return false;
      }
    }
    setMessage(null);
    return true;
  };

  // Update relational images separately
  const updateRelationalImages = async () => {
    const relationalFormData = new FormData();
    formData.relationalImages.forEach((image: File) => {
      relationalFormData.append("relational_images", image);
      
    });
    relationalFormData.append("id", productId.toString());
    try {
      await axios.put(`/api/products/p_images`, relationalFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setIsError(false);
    } catch (error: any) {
      setIsError(true);
      const errorMsg = error.response?.data?.error || "Error updating relational images";
      setMessage(errorMsg);
      
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) return; // Prevent submission if validation fails

    const form = new FormData();
    form.append("sizes", formData.sizes || productData?.sizes || "");
    form.append("colors", formData.colors || productData?.colors || "");
    form.append("state", formData.state || productData?.state || "");
    form.append("stock", formData.stock || productData?.stock?.toString() || "");
    form.append("name", formData.name || productData?.name?.toString() || "");
    form.append("price", formData.price || productData?.price?.toString() || "");
    form.append("category", formData.category || productData?.category || "");
    form.append("description", formData.description || productData?.description || "");
    form.append("delivery_days", formData.delivery_days.toString() || productData?.delivery_days.toString() || "");
    form.append("id", productId.toString() || productData?.id.toString() || "");

    // Append main photo
    form.append("image", formData.mainPhoto || productData?.image || "");
   
    try {
      await axios.put(`/api/products/edit`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Product updated successfully!");
      setIsError(false);
      try { 
        await updateRelationalImages();
        setMessage("Product details, images updated successully");
        setIsError(false);
       } catch (error: any) { 
        setMessage("Images updating failed!");
        setIsError(true);
       };
      
     
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "Error updating product";
      setMessage(errorMsg);
      setIsError(true);
    }
  };
  const str = "" + productData?.colors;

  const errorType: any = isError ? "error" : "success";

  return (
    <div className="fixed flex justify-center items-center bg-slate-400 w-full h-full top-0 left-0 z-30 backdrop-blur-0 bg-opacity-50">
      {message && (<AlertNotification message={message} type ={errorType} />)}
      <div className="relative w-[60vw] h-[90vh] bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-2xl"
        >
          <i className="bi bi-x"></i>
        </button>
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-700">
            {productData?.name} 
          </h1>
          <p className="text-sm text-gray-500">
            {truncateText(""+productData?.description, 50)}
          </p>
        </div>
        
        {/* Content */}
        <form  className="setupbar p-6 overflow-y-auto max-h-[65vh]">
          {/* Product Image */}
          <div className="w-full flex justify-center space-x-5 mb-4">
            <div className="p-1 shadow w-[30vw] h-[30vh]">
              <img 
               src={productData?.image} 
               alt="Product" 
               className="h-full w-full object-contain rounded-md"
              />
            </div>
            <div className="flex flex-wrap w-full space-x-2 gap-y-2 max-h-[31vh] overflow-hidden overflow-y-visible">
              {productData && productData?.relational_images.map((image, i) => (
                <div key={i} className="p-1 mb-2 shadow w-[10vw] h-[10vh]">
                <img 
                  src={image} 
                  alt="Product" 
                  className="h-full w-full object-contain rounded-md"
                />
               </div>
              ))}
              
              
            </div>
            
          </div>

          {/* Additional Images Section */}
      <div className="w-full">
        <h4 className="flex justify-between items-center text-sm text-slate-500 mb-2">Additional Images 
          <label htmlFor="fileInput" className="bg-slate-100 rounded-md py-1.5 px-4 text-sm cursor-pointer hover:bg-slate-200 transition">
            <i className="bi bi-plus-circle mr-1"></i> Add
            <input type="file" id="fileInput" accept="image/*" multiple className="hidden" onChange={handleRelationalImagesChange} />
          </label>
        </h4>
        <div className="other p-2 flex flex-wrap gap-2">
          {previewImages?.map((src, index) => (
            <div key={index} className="pic w-24 h-20 p-1 rounded-md bg-zinc-100 flex items-center justify-center">
              <img src={src} alt="" className="w-full h-full object-contain rounded-md"/>
            </div>
          ))}
        </div>
      </div>

  
          {/* Form Fields */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <label className="text-gray-500">Name:</label>
              <input type="text" name="name" value={formData?.name} onChange={handleChange} 
                className="border-b outline-none px-2 py-1 w-[80%] text-gray-700" 
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-500">Price:</label>
              <input type="text" name="price" value={formData?.price} onChange={handleChange} 
                className="border-b outline-none px-2 py-1 w-[80%] text-gray-700" 
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-500">Category:</label>
              <select name="category" value={formData.category} onChange={handleChange} 
                className="border-b outline-none px-2 py-1 w-[80%] text-gray-700 bg-transparent">
                <option value={formData.category} disabled>{formData.category}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.cat_name}>{category.cat_name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-500">Stock:</label>
              <input type="text" name="stock" value={formData?.stock} onChange={handleChange} 
                className="border-b outline-none px-2 py-1 w-[80%] text-gray-700" 
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-500">Sizes:</label>
              <input type="text" name="sizes" value={formData?.sizes?.toUpperCase()} onChange={handleChange} 
                className="border-b outline-none px-2 py-1 w-[80%] text-gray-700" 
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-500">Delivery (days):</label>
              <input type="text" name="delivery_days" value={formData?.delivery_days} onChange={handleChange} 
                className="border-b outline-none px-2 py-1 w-[80%] text-gray-700" 
              /> 
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-500">State:</label>
              <select name="state" value={formData.state} onChange={handleChange} 
               className="border-b outline-none px-2 py-1 w-[80%] text-gray-700 bg-transparent">
                <option value={formData.state} disabled>{formData.state}</option>
                <option value="new">New</option>
                <option value="old">Old</option>
                <option value="second_hand">Second hand</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-gray-500">Colors:</label>
              <input type="text" name="colors" value={formData?.colors?.toLowerCase()} onChange={handleChange} 
                className="border-b outline-none px-2 py-1 w-[80%] text-gray-700" 
              />
            </div>
          </div>
        </form>
  
        {/* Footer */}
        <div className="p-6 border-t flex justify-between items-center">
          <div className="text-gray-500 text-xs">
            <p>Last update: {productData?.updated_at ? formatDate(productData?.updated_at) : "No updates yet"}</p>
            <p>Uploaded at: {formatDate(productData?.created_at)}</p>
          </div>
          <button 
            type="submit"
            onClick={handleSubmit}
            className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetupProduct;
