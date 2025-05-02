"use client";
import React, { useEffect, useState } from 'react';
import { VictoryChart, VictoryLine, VictoryTooltip, VictoryTheme } from 'victory';
import 'leaflet/dist/leaflet.css';

interface Analytics {
    day: string;
    previous: number;
    current: number;
  }
  const formatNumber = (amount: number | any): string => {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
  }; 
const SalesAnalytics = () => {
    const [analytics, setAnalytics] = useState<Analytics[] | any>(null); // Updated to be an array
    const [loading, setLoading] = useState(false);
  
    // Calculate the total previous and current values
    const calculateTotals = (data: Analytics[]) => {
      const totals = data.reduce(
        (acc, { previous, current }) => {
          acc.previous += previous;
          acc.current += current;
          return acc;
        },
        { previous: 0, current: 0 }
      );
      return totals;
    };
  
    useEffect(() => {
      const fetchAnalytics = async () => {
        try {
          const response = await fetch(`/api/analytics/dashboard/sales`);
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

    let sum: number = 0;
    let total: number = 0;
    useEffect(() => {
      for (let i = 0; i < analytics?.length; i++) {
       const element = analytics[i];
       sum += element.previous;
      }
      for (let i = 0; i < analytics?.length; i++) {
        const element = analytics[i];
        sum += element.current;
       }
    }, [])
    

    
    // Check if analytics data is available
    const totals = analytics ? calculateTotals(analytics) : { previous: 0, current: 0 };

    return (
        <div className="flex flex-wrap">
            {/* Sales Data Chart using Victory */}
            <div className="sales w-full p-4 bg-white rounded-lg shadow-md">
                <div className="data">
                    <h1 className="text-2xl font-semibold text-gray-500 mb-2">Revenue</h1>
                    <div className='flex'>
                        <h3 className="text-xs text-gray-500 mb-2 mr-2">
                            <span className="mr-2 text-teal-500">●</span>
                            <span className="text-gray-800">Current Week</span>
                            <span className="ml-2">{formatNumber(total)}RWF</span>
                        </h3>
                        <h3 className="text-xs text-gray-500">
                            <span className="mr-2 text-pink-500">●</span>
                            <span className="text-gray-800">Previous Week</span>
                            <span className="ml-2">{formatNumber(sum)} RWF</span>
                        </h3>
                    </div>
                </div>
                <div className="chart w-full h-[50vh]">
                    <VictoryChart width={500} theme={VictoryTheme.material}>
                        <VictoryLine
                            data={analytics}
                            x="day"
                            y="current"
                            labelComponent={<VictoryTooltip />}
                            style={{
                                data: { stroke: 'rgb(75, 192, 192)' },
                                labels: { fill: 'black' },
                            }}
                        />
                        <VictoryLine
                            data={analytics}
                            x="day"
                            y="previous"
                            labelComponent={<VictoryTooltip />}
                            style={{
                                data: { stroke: 'rgb(255, 99, 132)' },
                                labels: { fill: 'black' },
                            }}
                        />
                    </VictoryChart>
                </div>
            </div>
        </div>
    );
};

export default SalesAnalytics;
