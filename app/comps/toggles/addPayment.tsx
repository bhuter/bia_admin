"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
}

const paymentTypes = [
  "Product Discount",
  "Self Delivery",
  "From 20 ",
  "From 50",
  "From 100",
  "From 200",
  "From 500 and Above",
  "Delivery Bonus",
  "Membership Bonus",
];

const AddPayment: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    paymentType: "",
    productId: "",
    payment: "",
    expiryDate: "",
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all products
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        const sortedProducts = response.data.sort((a: Product, b: Product) =>
          a.name.localeCompare(b.name)
        );
        setProducts(sortedProducts);
      } catch (err) {
        setError("Failed to fetch products.");
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query) {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleProductSelect = (productId: string, productName: string) => {
    setFormData({ ...formData, productId });
    setSearchQuery(productName);
    setFilteredProducts([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      await axios.post("/api/payment/add", formData);
      setMessage("Payment added successfully.");
      onClose();
    } catch (err: any) {
      setError("Failed to add payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed flex justify-center items-center bg-slate-100 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40">
      <i
        onClick={onClose}
        className="bi bi-x absolute right-4 px-2 py-1 border top-7 text-2xl font-bold cursor-pointer text-red-400 border-red-300 hover:bg-slate-50 hover:border rounded-full"
      ></i>
      <div className="max-w-2xl w-full rounded-xl px-6 py-3 bg-white border shadow-md">
        <h4 className="text-2xl font-bold text-slate-700 pb-3 pt-1 text-center">
          Add Payment
        </h4>
        <form className="my-2" autoComplete="off" onSubmit={handleSubmit}>
          <div className="flex flex-col w-full mb-3">
            <label className="text-sm font-semibold" htmlFor="paymentType">
              Payment Type
            </label>
            <select
              name="paymentType"
              className="px-4 py-2 outline-none border-slate-300 text-sm border my-1 font-semibold text-slate-500"
              value={formData.paymentType}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Payment Type --</option>
              {paymentTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-full mb-3">
            <label className="text-sm font-semibold" htmlFor="productSearch">
              Target Product
            </label>
            <input
              id="productSearch"
              type="text"
              placeholder="Search product..."
              className="px-4 py-2 border text-sm border-slate-300 my-1"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {filteredProducts.length > 0 && (
              <ul className="bg-white border rounded shadow-md max-h-60 overflow-auto absolute mt-16 max-w-xl  w-full">
                <li 
                    className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleProductSelect("system ","System")}
                  
                >System</li>
                <li 
                    className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleProductSelect("All Products ","All products")}
                  
                >All products</li>
                 <li 
                    className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleProductSelect("all agents","All agents")}
                  
                >All agents</li>
                 <li 
                    className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleProductSelect("all customers","All cutomers")}
                  
                >All cutomers</li>
                {filteredProducts.map((product) => (
                  <li
                    key={product.id}
                    className="px-4 py-2 cursor-pointer hover:bg-slate-100"
                    onClick={() => handleProductSelect(product.id.toString(), product.name)}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex flex-col w-full mb-3">
            <label className="text-sm font-semibold" htmlFor="payment">
              Payment Details
            </label>
            <input
              type="number"
              name="payment"
              className="px-4 py-2 border text-sm border-slate-300 my-1"
              placeholder="Enter payment number in percentage (%)"
              value={formData.payment}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col w-full mb-3">
            <label className="text-sm font-semibold" htmlFor="expiryDate">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              className="px-4 py-2 border text-sm border-slate-300 my-1"
              value={formData.expiryDate}
              onChange={handleChange}
              required
            />
          </div>
          {message || error ? (
            <p
              className={`${
                error ? "bg-red-100 text-red-500" : "bg-green-100 text-green-500"
              } text-sm my-2 px-3 py-2 rounded-md`}
            >
              {message || error}
            </p>
          ) : null}
          <button
            type="submit"
            className={`font-bold text-sm py-3 rounded-md w-full text-white ${
              isSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-orange-400"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Add Payment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPayment;
