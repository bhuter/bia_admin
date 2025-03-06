"use client"; // Ensure this is at the top of the file

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Logout: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        const logoutUser = async () => {
            try {
                // Retrieve the session from localStorage
                const session = localStorage.getItem('adminSession');
                
                if (!session) {
                    localStorage.removeItem('adminSession');
                    router.push('/'); // Redirect to home if no session found
                    window.location.assign("/auth/login");
                    return;
                }

                // Parse the session and get the session ID
                const { session_id } = JSON.parse(session);

                // Call the logout API endpoint with the session ID
                //const response = await axios.post("/api/auth/logout", { session_id });

                // If logout is successful, remove the session from local storage
               // if (response.status === 200) {
                    localStorage.removeItem('adminSession');
                    localStorage.clear();
                  //  console.log(response.data.message); // Log the success message
                    router.push('/auth/login'); // Redirect to home page
               // }
            } catch (error) {
                // Handle API errors or connectivity issues
                console.error("Error logging out:", error);
                alert("Error logging out. Please try again.");
            }
        };

        logoutUser();
    }, [router]);

    return (
        <div className="flex justify-center items-center h-screen">
            <head>
                <title>Signing out</title>
            </head>
            <h1 className="text-2xl">Logging out...</h1>
        </div>
    );
};

export default Logout;
