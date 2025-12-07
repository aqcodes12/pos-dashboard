import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { Calendar } from "lucide-react";

// Convert 1–12 → Jan–Dec
const MONTH_NAMES = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const revenue = payload.find((p) => p.dataKey === "revenue");
    const sale = payload.find((p) => p.dataKey === "sale");

    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm shadow-md">
        <p className="font-medium">{`${label}, 2025`}</p>

        {revenue && (
          <p className="flex items-center gap-2 text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
            {revenue.value.toFixed(2)} Revenue
          </p>
        )}

        {sale && (
          <p className="flex items-center gap-2 text-yellow-400">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            {sale.value.toFixed(2)} Sales
          </p>
        )}
      </div>
    );
  }
  return null;
};

const RevenueSales = () => {
  const [chartData, setChartData] = useState([]);

  // ==============================
  // LOAD MONTHLY REVENUE & SALES
  // ==============================
  const getChartData = async () => {
    try {
      const res = await axios.get("/sale/monthly-revenue-sales");

      if (res.data.success) {
        const apiData = res.data.data;

        // Convert backend structure to chart structure
        const formatted = apiData.map((item) => ({
          month: MONTH_NAMES[item.month],
          revenue: item.totalRevenue,
          sale: item.totalSales,
        }));

        setChartData(formatted);
      }
    } catch (error) {
      console.error("Failed to load chart", error);
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-lg font-semibold text-gray-800">
          Revenues VS Sales
        </h2>
        <button className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">
          <Calendar size={16} />
          Monthly
        </button>
      </div>

      {/* Chart */}
      <div className="w-full h-72">
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              iconSize={10}
              wrapperStyle={{ top: -20, right: 0, fontSize: "12px" }}
            />

            {/* Revenue Line */}
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2D336B"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />

            {/* Sales Line */}
            <Line
              type="monotone"
              dataKey="sale"
              stroke="#FACC15"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueSales;
