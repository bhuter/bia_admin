"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SalesAnalytics from "./chartAnalytics";


interface ChatAnalyticsProps {
  data: { day: string; previous: number; current: number }[];
}


interface Analytics {
  day: string;
  previous: number;
  current: number;
}


const ChatAnalytics: React.FC<ChatAnalyticsProps> = ({ data }) => {
  const [analytics, setAnalytics] = useState<Analytics | any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics/dashboard/orders`);
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        console.error("An error occurred while fetching analytics.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="text-amber-500 p-5">Loading ...</div>;
  }

  /** if (!analytics) {
    return <p>No data available</p>;
  }
  */
  return (
    <div className="flex space-x-6">
    
    <div className="w-full p-5 my-4 rounded-2xl bg-white">
                <div className="data pb-5">
                    <h1 className="text-2xl font-semibold text-gray-500 mb-2">Weekly Sales </h1>
                    <div className='flex'>
                        <h3 className="text-xs text-gray-500 mb-2 mr-2">
                            <span className="mr-2 text-teal-500">●</span>
                            <span className="text-gray-800">Current Week</span>
                            
                        </h3>
                        <h3 className="text-xs text-gray-500">
                            <span className="mr-2 text-pink-500">●</span>
                            <span className="text-gray-800">Previous Week</span>
                        </h3>
                    </div>
                </div>
      <ResponsiveContainer width={500} height={321} className={`text-sm`}>
        <BarChart data={analytics} className="text-sm">
          <XAxis dataKey="day" className="text-gray-600" />
          <YAxis className="text-gray-600" />
          <Tooltip contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }} />
          <Legend wrapperStyle={{ color: "#4b5563" }} />
          <Bar dataKey="previous" fill="#ec4899" name="Previous" radius={[4, 4, 0, 0]} />
          <Bar dataKey="current" fill="#14b8a6" name="Current" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="w-full p-4 my-4 rounded-2xl bg-white">
       <SalesAnalytics />
    </div>
    
  
    </div>
    
  );
};

export default ChatAnalytics;
