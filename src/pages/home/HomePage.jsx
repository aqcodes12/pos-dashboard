import React, { useEffect, useState } from "react";
import StatCard from "./components/StatCard";
import { CircleDollarSign, Coffee, NotepadText, User } from "lucide-react";
import NewM from "./components/NewM";
import TodaysPerformance from "./components/TodaysPerformance";
import RevenueSales from "./components/RevenueSales";
import LiveOrders from "./components/LiveOrders";
import TopSelling from "./components/TopSelling";
import RecentOrders from "./components/RecentOrders";
import axios from "axios";
import DominoLoader from "../../components/DominoLoader";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [statss, setStats] = useState({
    todaysSales: 0,
    todaysProfit: 0,
    todaysOrders: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // ============================
  // FETCH TODAY'S SUMMARY
  // ============================
  const getTodayStats = async () => {
    try {
      const res = await axios.get("/sale/today");

      if (res.data.success) {
        const today = res.data.msg;

        setStats({
          todaysSales: today.totalSales ?? 0,
          todaysProfit: today.totalProfit ?? 0,
          todaysOrders: today.totalOrders ?? 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch today's stats:", error);
    }
  };

  useEffect(() => {
    getTodayStats();
  }, []);

  const stats = [
    {
      id: 1,
      title: "Total Sales Today",
      value: `SAR ${statss.todaysSales}`,
      icon: CircleDollarSign,
      percentage: "",
      period: "Today",
      change: "",
    },
    {
      id: 2,
      title: "Total Profit Today",
      value: `SAR ${statss.todaysProfit}`,
      icon: CircleDollarSign,
      percentage: "",
      period: "Today",
      change: "",
    },
    {
      id: 3,
      title: "Total Orders Today",
      value: `${statss.todaysOrders}`,
      icon: NotepadText,
      percentage: "",
      period: "Today",
      change: "",
    },
  ];

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <DominoLoader />
      </div>
    );
  }

  return (
    <>
      {/* Responsive parent container */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-6 p-4">
          {/* Left section – 70% width on large screens, full width on small */}
          <div className="w-full lg:w-[70%] space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 place-items-center">
              {stats.map((item) => (
                <StatCard
                  key={item.id}
                  title={item.title}
                  value={item.value}
                  icon={item.icon}
                  percentage={item.percentage}
                  period={item.period}
                  change={item.change}
                />
              ))}
            </div>
            <RevenueSales />
            <RecentOrders />
          </div>

          {/* Right section – 30% width on large screens, full width on small */}
          <div className="w-full lg:w-[30%] space-y-4 grid place-items-center">
            <NewM />
            <TodaysPerformance />
            <LiveOrders />
            <TopSelling />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
