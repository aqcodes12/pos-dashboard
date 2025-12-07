import React, { useEffect, useState } from "react";
import axios from "axios";

const TodaysPerformance = () => {
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [todaySales, setTodaySales] = useState(0);

  const [yesterdayRevenue, setYesterdayRevenue] = useState(0);
  const [yesterdaySales, setYesterdaySales] = useState(0);

  // Gauge fill percentages (calculated, not shown on UI)
  const [revenuePct, setRevenuePct] = useState(0);
  const [salesPct, setSalesPct] = useState(0);

  // ============================
  // FETCH DAILY REVENUE DATA
  // ============================
  const fetchDailyStats = async () => {
    try {
      const res = await axios.get("/sale/daily-revenue");

      if (res.data.success) {
        const t = res.data.data.today;
        const y = res.data.data.yesterday;

        // Store raw values
        setTodayRevenue(t.totalRevenue ?? 0);
        setTodaySales(t.totalSales ?? 0);

        setYesterdayRevenue(y.totalRevenue ?? 0);
        setYesterdaySales(y.totalSales ?? 0);

        // Calculate gauge percentages internally
        const revPct = y.totalRevenue
          ? Math.min((t.totalRevenue / y.totalRevenue) * 100, 100)
          : 0;

        const salPct = y.totalSales
          ? Math.min((t.totalSales / y.totalSales) * 100, 100)
          : 0;

        setRevenuePct(revPct);
        setSalesPct(salPct);
      }
    } catch (error) {
      console.error("Failed to load daily revenue", error);
    }
  };

  useEffect(() => {
    fetchDailyStats();
  }, []);

  return (
    <div className="p-5 bg-white rounded-2xl border border-gray-100 w-full max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Today Performance
        </h2>
        <button className="text-sm text-primary font-medium">Detail</button>
      </div>

      {/* Semi-circle Gauge */}
      <div className="relative flex justify-center">
        <svg
          viewBox="0 0 200 120"
          className="w-full max-w-[280px] overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Track */}
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            pathLength="100"
            fill="none"
            stroke="#F3F4F6"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Outer Progress (Revenue) */}
          <path
            d="M20 100 A80 80 0 0 1 180 100"
            pathLength="100"
            fill="none"
            stroke="#2D336B"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${revenuePct} 100`}
          />

          {/* Inner Track */}
          <path
            d="M35 100 A65 65 0 0 1 165 100"
            pathLength="100"
            fill="none"
            stroke="#F5F6F8"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Inner Progress (Sales) */}
          <path
            d="M35 100 A65 65 0 0 1 165 100"
            pathLength="100"
            fill="none"
            stroke="#FACC15"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${salesPct} 100`}
          />

          {/* Center Text */}
          <text
            x="100"
            y="72"
            textAnchor="middle"
            className="fill-gray-800"
            fontSize="16"
            fontWeight="600"
          >
            SAR {todayRevenue.toFixed(2)}
          </text>

          <text
            x="100"
            y="92"
            textAnchor="middle"
            className="fill-gray-500"
            fontSize="12"
          >
            Today Revenue
          </text>
        </svg>
      </div>

      {/* Bottom Stats (RAW API VALUES) */}
      <div className="mt-5 space-y-3 text-sm">
        {/* Revenue */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-gray-700 font-medium">Revenue</span>
          </div>
          <span className="text-gray-800 font-semibold">
            SAR {todayRevenue.toFixed(2)}
          </span>
        </div>

        {/* Sales */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span className="text-gray-700 font-medium">Sales</span>
          </div>
          <span className="text-gray-800 font-semibold">
            SAR {todaySales.toFixed(2)}
          </span>
        </div>

        {/* Yesterday */}
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-gray-700 font-medium">Yesterday</span>
          </div>
          <span className="text-gray-800 font-semibold">
            SAR {yesterdayRevenue.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TodaysPerformance;
