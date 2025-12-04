import React from "react";
import StatCard from "./components/StatCard";
import { CircleDollarSign, Coffee, NotepadText, User } from "lucide-react";
import NewM from "./components/NewM";
import TodaysPerformance from "./components/TodaysPerformance";
import RevenueSales from "./components/RevenueSales";
import LiveOrders from "./components/LiveOrders";
import TopSelling from "./components/TopSelling";
import RecentOrders from "./components/RecentOrders";

const HomePage = () => {
  const stats = [
    {
      id: 1,
      title: "Total Sales Today",
      value: "SAR 4,850",
      icon: CircleDollarSign,
      percentage: "+12%",
      period: "Today",
      change: "Positive",
    },
    {
      id: 2,
      title: "Total Profit Today",
      value: "SAR 1,320",
      icon: CircleDollarSign,
      percentage: "+8%",
      period: "Today",
      change: "Positive",
    },
    {
      id: 3,
      title: "Total Items Sold",
      value: "178",
      icon: NotepadText,
      percentage: "+5%",
      period: "Today",
      change: "Positive",
    },
  ];

  return (
    <>
      {/* Responsive parent container */}
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
    </>
  );
};

export default HomePage;
