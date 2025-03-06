"use client";
import axios from "axios";
import { useEffect, useState } from "react";

interface AddAgentProps {
  onClose: () => void;
}
const message = "Invalid";
const AddAgent: React.FC<AddAgentProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    password: "",
});
const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    password: "",
});
const [responseMessage, setResponseMessage] = useState("");
const [isSuccess, setIsSuccess] = useState(false);
const [isFormValid, setIsFormValid] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);

// Form validation
useEffect(() => {
    const isValid =
        formData.firstName.length >= 3 &&
        formData.lastName.length >= 3 &&
        /^[0-9]{10}$/.test(formData.phone) &&
        /\S+@\S+\.\S+/.test(formData.email) &&
        formData.password.length >= 6;

    setIsFormValid(isValid);
}, [formData]);

// Handle form input changes
const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Input validation
    switch (name) {
        case "firstName":
        case "lastName":
            setErrors({
                ...errors,
                [name]: value.length < 3 ? `${name} must be at least 3 characters.` : "",
            });
            break;
        case "phone":
            setErrors({
                ...errors,
                phone: !/^[0-9]{10}$/.test(value) ? "Phone number must be 10 digits." : "",
            });
            break;
        case "email":
            setErrors({
                ...errors,
                email: !/\S+@\S+\.\S+/.test(value) ? "Enter a valid email address." : "",
            });
            break;
        case "password":
            setErrors({
                ...errors,
                password: value.length < 6 ? "Password must be at least 6 characters long." : "",
            });
            break;
        default:
            break;
    }
};

// Handle form submission
const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
        const res = await axios.post("/api/agents/add", formData);
        setIsSuccess(true);
        setResponseMessage(res.data.message || "Registered successfully!");
        onClose();
    } catch (error: any) {
        setIsSuccess(false);
        setResponseMessage(error.response?.data.message || "Registration failed due to server error");
    } finally {
        setIsSubmitting(false);
    }
};

  return(
    <div className="fixed flex justify-center items-center bg-slate-100 w-full h-full top-0 left-0 z-30 backdrop-blur-sm bg-opacity-40">
       <i onClick={onClose} className="bi bi-x absolute right-4 px-2 py-1 border top-7 text-2xl font-bold cursor-pointer text-red-400 border-red-300 hover:bg-slate-50 hover:border rounded-full"></i>
      <div className="max-w-2xl w-full rounded-xl px-6 py-3 bg-white border shadow-md">
        <h4 className="text-2xl font-bold text-slate-700 pb-3 pt-1 text-center">
          Add Agent
        </h4>
        <form onSubmit={handleSubmit} className="my-2" autoComplete="off">
                        {responseMessage && (
                            <div className={`text-sm px-5 py-3 my-1 rounded-md ${isSuccess ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'}`}>{responseMessage}</div>
                        )}
                        
                        <div className="flex flex-row w-full justify-between">
                            <div className="flex flex-col w-[50%] mr-1">
                                <label className="text-sm font-semibold" htmlFor="firstName">First name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter your first name"
                                    className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="text-red-500 text-sm">{errors.firstName}</span>
                            </div>

                            <div className="flex flex-col w-[50%]">
                                <label className="text-sm font-semibold" htmlFor="lastName">Last name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter your last name"
                                    className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="text-red-500 text-sm">{errors.lastName}</span>
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="text-sm font-semibold" htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                onChange={handleChange}
                                required
                            />
                            <span className="text-red-500 text-sm">{errors.email}</span>
                        </div>

                        <div className="flex flex-row w-full justify-between">
                            <div className="flex flex-col w-[50%] mr-1">
                                <label className="text-sm font-semibold" htmlFor="phone">Phone number</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Enter your phone"
                                    className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                    onChange={handleChange}
                                    required
                                />
                                <span className="text-red-500 text-sm">{errors.phone}</span>
                            </div>

                            <div className="flex flex-col w-[50%]">
                                <label className="text-sm font-semibold" htmlFor="nationality">Nationality</label>
                                <input
                                    type="text"
                                    name="nationality"
                                    placeholder="Enter your nationality"
                                    className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col w-full">
                            <label className="text-sm font-semibold" htmlFor="password">Password</label>
                            <input
                                type="text"
                                name="password"
                                placeholder="Enter your password"
                                className="px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1"
                                onChange={handleChange}
                                value={"BiaAgent@123"}
                                required
                            />
                            <span className="text-red-500 text-sm">{errors.password}</span>
                        </div>

                        <div className="flex flex-col w-full mt-4">
                            <button
                                type="submit"
                                className={`flex items-center justify-center font-bold text-sm py-3 rounded-3xl border w-full my-2 text-white ${
                                    !isFormValid ? "bg-slate-300 cursor-no-drop" : "bg-orange-400"
                                }`}
                                disabled={!isFormValid || isSubmitting}
                            >
                                {isSubmitting ? 'Registering...' : <> Register <i className="bi bi-arrow-right ml-2"></i></>}
                            </button>
                        </div>

                    </form>
      </div>
    </div>
  );
}
export default AddAgent;