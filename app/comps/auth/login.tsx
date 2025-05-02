"use client"; // Make sure this is at the top of the file

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import AlertNotification from '../toggles/notify';

const LoginForm: React.FC = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        userName: "",
        password: ""
    });
    const [responseMessage, setResponseMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false); // Add loading state

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const { userName, password } = formData;

        if (!userName || !password) {
            setResponseMessage("Both fields are required.");
            setIsError(true);
            setIsSuccess(false);
            return;
        }

        setLoading(true); // Start loading
        try {
            const response = await axios.post("/api/auth/login", formData);
            
            // Update localStorage with the new session
            localStorage.setItem('adminSession', JSON.stringify({
                id: response.data.user.id,
                name: response.data.user.name,
                session_id: response.data.user.session_id,
                photo: response.data.user.photo,
                role: response.data.user.role,
            }));

            setResponseMessage(response.data.message || "Login successfully!");
            setIsSuccess(true);
            setIsError(false);
            window.location.assign("/");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                setResponseMessage(error.response?.data.message || "Login failed due to server error.");
                setIsError(true);
                setIsSuccess(false);
            } else if (error instanceof Error) {
                setResponseMessage(error.message || "An unknown error occurred.");
                setIsError(true);
                setIsSuccess(false);
            } else {
                setResponseMessage("An unexpected error occurred.");
                setIsError(true);
                setIsSuccess(false);
            }
        } finally {
            setLoading(false); // Stop loading
        }

        // Clear message after a few seconds
        setTimeout(() => {
            setResponseMessage("");
        }, 5000);
    };
    const typ: any = isSuccess ? "success" : "error";
    return (
    <>
        {responseMessage && (<AlertNotification message={responseMessage} type={typ} /> )}
        <div className='flex items-center w-full sm:w-[40%] h-screen px-14 py-5'>
          <div className='w-full'>
            <h1 className='text-3xl font-semibold py-2'>Sign into your account</h1>
            <p className='text-sm text-slate-500 mb-8'>Enter your credintials to view all insights</p>
            <form className='my-2' method='post' onSubmit={handleLogin} autoComplete='off'>
                        {responseMessage && (
                            <div className={`text-sm px-5 py-3 my-1 rounded-md ${isSuccess ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'}`}>{responseMessage}</div>
                        )}
                        
                <div className='flex flex-col w-full'>
                    <label className='text-sm font-semibold' htmlFor="userName">Username or email</label>
                    <input type="text" name="userName" id="userName" placeholder='Enter username or email' className='px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1' onChange={handleChange} required/>
                </div>
                <div className='flex flex-col w-full'>
                    <label className='text-sm font-semibold' htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder='Enter your password' className='px-5 py-3 outline-none border-slate-300 text-sm border rounded-3xl my-1'onChange={handleChange} required/>
                </div>
                <div className='flex flex-col w-full mt-4'>
                    <button 
                    type="submit"  
                    className='flex items-center justify-center font-bold text-sm py-3 rounded-3xl border w-full my-2 text-white bg-orange-400'
                    disabled={loading}
                    >{loading ? 'Logging in...' : <>Sign in <i className="bi bi-arrow-right ml-2"></i></>}</button>
                </div>
            </form>
          </div>
        </div>
        
    </>
    );
};

export default LoginForm;
