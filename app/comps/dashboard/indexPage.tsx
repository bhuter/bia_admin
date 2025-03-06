"use client";

import { useEffect, useState } from "react";

interface Analytics {
  total_sales: number;
  total_orders: number;
  total_revenue: number | 0;
  total_customers: number;
  count_change: {
    total_sales: number;
    total_orders: number;
    total_revenue: number | 0;
    total_customers: number;
  };
  percentage_change: {
    sales_growth: number;
    orders_growth: number;
    revenue_growth: number | 0;
    customers_growth: number;
  };
}
const Header = () => {
    return (
      <>
        <div className="flex">
          <div className="border border-slate-100 bg-white py-2 px-2 text-xs text-slate-400 mx-2 flex items-center rounded-md">
            <select name="timeby" id="timeby" className="outline-none">
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
              <option value="annually">Annually</option>
              <option value="all">All</option>
            </select>
          </div>
          <div className="border border-slate-100 bg-white py-2 px-2 text-xs text-slate-400 flex items-center rounded-md">
            <i className="bi bi-calendar mr-1"></i>
            <div>1 May 2024 - 7 May 2024</div>
          </div>
          <button className="bg-blue-500 py-1 px-6 text-white rounded-md mx-2">
            <i className="bi bi-circle-arrow-up"></i> Export
          </button>
        </div>
      </>
    );
  };
  
  const SalesDash = () => {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(false);
      // Fetch Analytics
      useEffect(() => {
        setLoading(true)
        const userSession = JSON.parse(localStorage.getItem('Analyticsession') || '{}');
        let id = "";
        if(userSession && userSession.id){
          id = userSession.id;
        }
        const fetchAnalytics = async () => {
          try {
            const response = await fetch(`/api/analytics/dashboard`);
            if (!response.ok) throw new Error("Failed to fetch analytics");
            const data = await response.json();
            setAnalytics(data);
            setLoading(false);
          } catch (error) {
            console.log("An error occurred while fetching Analytics.");
          }
        };
        fetchAnalytics();
      }, []);
    return (
        <>
        <div className="bg-white border px-4 py-3 w-[250px] rounded-md mb-5">
            <div className="flex justify-between items-center text-slate-400 text-base pb-1">
                <h4 className="text-base font-medium text-slate-400">Total Sales</h4>
                <i className="bi bi-cart-plus cart-plus text-xl mx-2 text-green-600 py-1 px-2 bg-green-50 rounded-full"></i>
            </div>
            <div className="text-xl font-bold text-slate-600 py-2">{analytics?.total_sales} <span className="text-xs font-medium text-slate-400">{analytics?.count_change?.total_sales}</span></div>
           <div className="flex items-center"> 
           <div className={`${Number(analytics?.percentage_change?.sales_growth) > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'} bg-opacity-80 font-semibold p-1 mr-3 rounded-md  w-max text-xs`}><i className={`bi bi-graph-${Number(analytics?.percentage_change?.sales_growth) > 0 ? 'up' : 'down' }-arrow mr-[1px]`}></i>{analytics?.percentage_change?.sales_growth}%</div>
            <div className="font-normal text-base ml-2 text-slate-400">in the last week</div>
           </div>
        </div>
        <div className="bg-white border px-4 py-3 gap-4 w-[250px] rounded-md mb-5">
            <div className="flex justify-between items-center text-slate-400 text-base pb-1">
                <h4 className="text-base font-medium text-slate-400">Total Orders</h4>
                <i className="bi bi-three-dots cart-plus text-xl mx-2 text-green-600 py-1 px-2 bg-green-50 rounded-full"></i>
            </div>
            <div className="text-xl font-bold text-slate-600 py-2">{analytics?.total_orders} <span className="text-xs font-medium text-slate-400">{analytics?.count_change?.total_orders}</span></div>
           <div className="flex items-center"> 
           <div className={`${Number(analytics?.percentage_change?.orders_growth) > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'} bg-opacity-80 font-semibold p-1 mr-3 rounded-md  w-max text-xs`}><i className={`bi bi-graph-${Number(analytics?.percentage_change?.orders_growth) > 0 ? 'up' : 'down' }-arrow mr-[1px]`}></i> {analytics?.percentage_change?.orders_growth}%</div>
            <div className="font-normal text-base ml-2 text-slate-400">in the last week</div>
           </div>
        </div>
        <div className="bg-white border px-4 py-3 w-[250px] rounded-md mb-5">
            <div className="flex justify-between items-center text-slate-400 text-base pb-1">
                <h4 className="text-base font-medium text-slate-400">Total Revenue</h4>
                <i className="bi bi-three-dots cart-plus text-xl mx-2 text-green-600 py-1 px-2 bg-green-50 rounded-full"></i>
            </div>
            <div className="text-xl font-bold text-slate-600 py-2">{analytics?.total_revenue} <span className="text-xs font-medium text-slate-400">{analytics?.count_change?.total_revenue}</span></div>
           <div className="flex items-center"> 
           <div className={`${Number(analytics?.percentage_change?.revenue_growth) > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'} bg-opacity-80 font-semibold p-1 mr-3 rounded-md  w-max text-xs`}><i className={`bi bi-graph-${Number(analytics?.percentage_change?.revenue_growth) > 0 ? 'up' : 'down' }-arrow mr-[1px]`}></i> {analytics?.percentage_change?.revenue_growth}%</div>
            <div className="font-normal text-base ml-2 text-slate-400">in the last week</div>
           </div>
        </div>
        <div className="bg-white border px-4 py-3 w-[250px] rounded-md mb-5">
            <div className="flex justify-between items-center text-slate-400 text-base pb-1">
                <h4 className="text-base font-medium text-slate-400">Total Customer</h4>
                <i className="bi bi-people text-xl mx-2 text-green-600 py-1 px-2 bg-green-50 rounded-full"></i>
            </div>
            <div className="text-xl font-bold text-slate-600 py-2">{analytics?.total_customers} <span className="text-xs font-medium text-slate-400">{analytics?.count_change?.total_customers}</span></div>
           <div className="flex items-center"> 
            <div className={`${Number(analytics?.percentage_change?.customers_growth) > 0 ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'} bg-opacity-80 font-semibold p-1 mr-3 rounded-md  w-max text-xs`}><i className={`bi bi-graph-${Number(analytics?.percentage_change?.customers_growth) > 0 ? 'up' : 'down' }-arrow mr-[1px]`}></i> {analytics?.percentage_change?.customers_growth}%</div>
            <div className="font-normal text-base ml-2 text-slate-400">in the last week</div>
           </div>
        </div>
       
        </>
    );
  };
  
 

  // Default export for Header
  export default Header;
  
  // Named export for SalesDash
  export { SalesDash };
  