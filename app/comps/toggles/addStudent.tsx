"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface AddStudentProps {
  onClose: () => void;
}
const message = "Invalid";
const AddStudent: React.FC<AddStudentProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    phone: '',
    email: '',
    district: '',
    sector: '',
    cell: '',
    village: '',
    status: '',
    gender: '',
    dob: '',
  });

  const [message, setMessage] = useState(''); // For user feedback

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/students/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Application submitted successfully!");
      } else {
        setMessage(result.message || "Failed to submit application.");
      }
    } catch (error) {
      setMessage("An error occurred while submitting the application.");
      console.error("Error:", error);
    }
  };
  return(
    <div className="fixed flex justify-center items-center bg-slate-100 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40">
       <i onClick={onClose} className="bi bi-x absolute right-4 px-2 py-1 border top-7 text-2xl font-bold cursor-pointer text-red-400 border-red-300 hover:bg-slate-50 hover:border rounded-full"></i>
      <div className="max-w-2xl w-full rounded-xl px-6 py-3 bg-white border shadow-md">
        <h4 className="text-2xl font-bold text-slate-700 pb-3 pt-1 text-center">
          Add Student
        </h4>
         {/* Application Form */}
         <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="firstName" className="block text-xs font-medium text-gray-700">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                id="firstName"
                placeholder="Enter your first name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="secondName" className="block text-xs font-medium text-gray-700">Second Name *</label>
              <input
                type="text"
                name="secondName"
                value={formData.secondName}
                onChange={handleInputChange}
                id="secondName"
                placeholder="Enter your second name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="phone" className="block text-xs font-medium text-gray-700">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                id="phone"
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="email" className="block text-xs font-medium text-gray-700">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                id="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="district" className="block text-xs font-medium text-gray-700">District *</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                id="district"
                placeholder="Enter your district"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="sector" className="block text-xs font-medium text-gray-700">Sector *</label>
              <input
                type="text"
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                id="sector"
                placeholder="Enter your sector"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="cell" className="block text-xs font-medium text-gray-700">Cell *</label>
              <input
                type="text"
                name="cell"
                value={formData.cell}
                onChange={handleInputChange}
                id="cell"
                placeholder="Enter your cell"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              />
            </div>
            <div className="w-full">
              <label htmlFor="village" className="block text-xs font-medium text-gray-700">Village *</label>
              <input
                type="text"
                name="village"
                value={formData.village}
                onChange={handleInputChange}
                id="village"
                placeholder="Enter your village"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <label htmlFor="status" className="block text-xs font-medium text-gray-700">Marital Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                id="status"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
              </select>
            </div>
            <div className="w-full">
              <label htmlFor="gender" className="block text-xs font-medium text-gray-700">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                id="gender"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="w-full">
              <label htmlFor="dob" className="block text-xs font-medium text-gray-700">Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                id="dob"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-2 text-xs"
                required
              />
            </div>
          </div>
          {message && <p className={`text-center ${message.includes('success') ? 'text-green-500 ': 'text-red-500'} `}>{message}</p>}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition duration-300 text-xs"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
export default AddStudent;