// import React from "react";

// const LiveOrders = () => {
//   const orders = [
//     {
//       id: 1,
//       name: "Mohammed",
//       product: "Fresh Chicken Breast",
//       quantity: 2,
//       time: "Today at 12:30",
//     },
//     {
//       id: 2,
//       name: "Akbar",
//       product: "Mutton Boneless",
//       quantity: 1,
//       time: "Today at 09:15",
//     },
//     {
//       id: 3,
//       name: "Zain",
//       product: "Chicken Wings",
//       quantity: 3,
//       time: "Yesterday at 18:30",
//     },
//   ];

//   return (
//     <div className="w-full max-w-sm">
//       <h2 className="text-lg font-semibold text-gray-800 mb-2">Live Orders</h2>
//       <div className="bg-white border border-gray-100 rounded-2xl p-5">
//         {/* Header */}

//         {/* Orders List */}
//         <div className="divide-y divide-gray-100">
//           {orders.map((order) => (
//             <div
//               key={order.id}
//               className="flex items-start justify-between py-3 hover:bg-gray-50 rounded-xl px-2 transition"
//             >
//               <div>
//                 <p className="text-gray-800 text-sm font-medium">
//                   <span className="text-gray-600 font-normal">
//                     purchased {order.quantity}× {order.product}
//                   </span>
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">{order.time}</p>
//               </div>
//               <button className="text-primary text-sm font-medium hover:underline">
//                 View
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveOrders;

import React, { useEffect, useState } from "react";
import axios from "axios";

const LiveOrders = () => {
  const [orders, setOrders] = useState([]);

  // Format date → "Today at 12:40" or "07 Dec at 18:30"
  const formatTime = (iso) => {
    const d = new Date(iso);
    const today = new Date();

    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    const time = d.toLocaleTimeString("en", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today at ${time}`;

    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en", { month: "short" });
    return `${day} ${month} at ${time}`;
  };

  const fetchLiveOrders = async () => {
    try {
      const res = await axios.get("/sale/recent-orders");

      if (res.data.success) {
        const latest = res.data.data.slice(0, 3); // 🔥 Only first 3

        const formatted = latest.map((order) => ({
          id: order._id,
          product: order.product?.name || "Unknown",
          quantity: order.quantity,
          time: formatTime(order.createdAt),
        }));

        setOrders(formatted);
      }
    } catch (err) {
      console.error("Failed loading live orders", err);
    }
  };

  useEffect(() => {
    fetchLiveOrders();
  }, []);

  return (
    <div className="w-full max-w-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Live Orders</h2>

      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="divide-y divide-gray-100">
          {orders.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">
              No live orders
            </p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-start justify-between py-3 hover:bg-gray-50 rounded-xl px-2 transition"
              >
                <div>
                  <p className="text-gray-800 text-sm font-medium">
                    purchased {order.quantity}×{" "}
                    <span className="text-gray-600">{order.product}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                </div>

                <button className="text-primary text-sm font-medium hover:underline">
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveOrders;
