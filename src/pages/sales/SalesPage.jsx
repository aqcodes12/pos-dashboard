import React, { useState, useEffect } from "react";
import {
  Calendar,
  FileText,
  Plus,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  X,
  Search,
} from "lucide-react";

const SalesPage = () => {
  // Dummy product list (Meat Shop)
  const productsList = [
    {
      id: 1,
      name: "Fresh Chicken Breast",
      weight: "1 KG",
      purchasePrice: 18,
      sellingPrice: 28,
    },
    {
      id: 2,
      name: "Mutton Boneless",
      weight: "1 KG",
      purchasePrice: 38,
      sellingPrice: 52,
    },
    {
      id: 3,
      name: "Chicken Wings",
      weight: "1 KG",
      purchasePrice: 12,
      sellingPrice: 18,
    },
    {
      id: 4,
      name: "Beef Mince",
      weight: "1 KG",
      purchasePrice: 22,
      sellingPrice: 34,
    },
    {
      id: 5,
      name: "Lamb Chops",
      weight: "1 KG",
      purchasePrice: 45,
      sellingPrice: 62,
    },
    {
      id: 6,
      name: "Fish Fillet",
      weight: "1 KG",
      purchasePrice: 25,
      sellingPrice: 38,
    },
  ];

  // Dummy Sales Data
  const [sales, setSales] = useState([
    {
      id: 1,
      date: "2025-01-10 10:30 AM",
      product: "Fresh Chicken Breast",
      weight: "1 KG",
      qty: 2,
      total: 56,
      profit: 20,
    },
    {
      id: 2,
      date: "2025-01-10 09:15 AM",
      product: "Mutton Boneless",
      weight: "1 KG",
      qty: 1,
      total: 52,
      profit: 14,
    },
    {
      id: 3,
      date: "2025-01-09 04:45 PM",
      product: "Chicken Wings",
      weight: "1 KG",
      qty: 3,
      total: 54,
      profit: 18,
    },
    {
      id: 4,
      date: "2025-01-09 02:20 PM",
      product: "Beef Mince",
      weight: "1 KG",
      qty: 2,
      total: 68,
      profit: 24,
    },
    {
      id: 5,
      date: "2025-01-08 11:00 AM",
      product: "Lamb Chops",
      weight: "1 KG",
      qty: 1,
      total: 62,
      profit: 17,
    },
  ]);

  // Filters
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSales = sales.filter((sale) => {
    const matchesDate = filterDate ? sale.date.startsWith(filterDate) : true;
    const matchesSearch = sale.product
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  });

  // Calculate totals
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0);
  const totalSales = filteredSales.length;

  // ADD SALE MODAL STATES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  const [cost, setCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [profit, setProfit] = useState(0);

  useEffect(() => {
    if (selectedProduct && quantity) {
      const c = selectedProduct.purchasePrice * quantity;
      const t = selectedProduct.sellingPrice * quantity;
      setCost(c);
      setTotal(t);
      setProfit(t - c);
    }
  }, [selectedProduct, quantity]);

  // Save Sale
  const handleSaveSale = () => {
    if (!selectedProduct || !quantity) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} ${
      now.getHours() >= 12 ? "PM" : "AM"
    }`;

    const newSale = {
      id: Date.now(),
      date: formattedDate,
      product: selectedProduct.name,
      weight: selectedProduct.weight,
      qty: quantity,
      total: total,
      profit: profit,
    };

    setSales([newSale, ...sales]);

    // Reset everything
    setIsModalOpen(false);
    setSelectedProduct(null);
    setQuantity("");
    setCost(0);
    setTotal(0);
    setProfit(0);
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ===================== HEADER ===================== */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Sales Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Track and manage your daily sales
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg shadow-lg hover:bg-primary transition-all hover:shadow-xl"
          >
            <Plus size={20} /> Add New Sale
          </button>
        </div>

        {/* ===================== STATS CARDS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Sales</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {totalSales}
                </p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <ShoppingCart className="text-primary" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {totalRevenue} SAR
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Profit
                </p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {totalProfit} SAR
                </p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* ===================== FILTERS ===================== */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-gray-50 flex-1">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name..."
                className="outline-none bg-transparent flex-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-gray-50">
              <Calendar size={18} className="text-gray-400" />
              <input
                type="date"
                className="outline-none bg-transparent"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
            </div>

            {(filterDate || searchTerm) && (
              <button
                onClick={() => {
                  setFilterDate("");
                  setSearchTerm("");
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ===================== SALES TABLE ===================== */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-primary to-primary text-white">
                <tr>
                  <th className="py-4 px-6 font-semibold">Date & Time</th>
                  <th className="py-4 px-6 font-semibold">Product</th>
                  <th className="py-4 px-6 font-semibold">Weight</th>
                  <th className="py-4 px-6 font-semibold">Qty</th>
                  <th className="py-4 px-6 font-semibold">Total Sale</th>
                  <th className="py-4 px-6 font-semibold">Profit</th>
                  <th className="py-4 px-6 font-semibold">Invoice</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {filteredSales.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-12 text-gray-400">
                      No sales found matching your filters
                    </td>
                  </tr>
                ) : (
                  filteredSales.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-t hover:bg-blue-50 transition ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-4 px-6 text-sm">{item.date}</td>
                      <td className="py-4 px-6 font-medium">{item.product}</td>
                      <td className="py-4 px-6 text-sm">{item.weight}</td>
                      <td className="py-4 px-6 text-sm">{item.qty}</td>
                      <td className="py-4 px-6 font-semibold text-gray-800">
                        {item.total} SAR
                      </td>
                      <td className="py-4 px-6 font-semibold text-green-600">
                        {item.profit} SAR
                      </td>
                      <td className="py-4 px-6">
                        <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-primary rounded-lg hover:bg-blue-200 transition text-sm font-medium">
                          <FileText size={16} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================== ADD SALE MODAL ===================== */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-primary to-primary text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Add New Sale</h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="hover:bg-white/20 p-2 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Product dropdown */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Product
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-primary transition bg-gray-50"
                    value={selectedProduct?.id || ""}
                    onChange={(e) => {
                      const p = productsList.find(
                        (x) => x.id === Number(e.target.value)
                      );
                      setSelectedProduct(p || null);
                    }}
                  >
                    <option value="">Choose a product...</option>
                    {productsList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.weight}) - {p.sellingPrice} SAR
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-primary transition bg-gray-50"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>

                {/* Auto calculations */}
                {selectedProduct && quantity > 0 && (
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <TrendingUp size={18} className="text-primary" />
                      Sale Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cost Price:</span>
                        <span className="font-bold text-gray-800">
                          {cost} SAR
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Selling Price:</span>
                        <span className="font-bold text-gray-800">
                          {total} SAR
                        </span>
                      </div>
                      <div className="h-px bg-blue-300 my-2"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-semibold">
                          Profit:
                        </span>
                        <span className="font-bold text-green-600 text-lg">
                          {profit} SAR
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveSale}
                    disabled={!selectedProduct || !quantity}
                    className="flex-1 bg-primary text-white px-4 py-3 rounded-lg shadow-lg hover:bg-primary transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Sale
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
