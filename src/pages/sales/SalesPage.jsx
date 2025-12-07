import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { showSuccessToast } from "../../utils/toastConfig";
import DominoLoader from "../../components/DominoLoader";

const SalesPage = () => {
  // ============================
  // BACKEND STATES
  // ============================
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalProfit: 0,
  });

  // ============================
  // FILTERS
  // ============================
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ============================
  // MODAL STATES
  // ============================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  const [cost, setCost] = useState(0);
  const [total, setTotal] = useState(0);
  const [profit, setProfit] = useState(0);

  // ============================
  // LOAD ALL PRODUCTS
  // ============================
  const getProducts = async () => {
    try {
      const res = await axios.get("/product/getAll");
      if (res.data.success) setProducts(res.data.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  // ============================
  // LOAD ALL SALES
  // ============================
  const getSales = async () => {
    try {
      const res = await axios.get("/sale/getAll");
      if (res.data.success) setSales(res.data.data);
    } catch (error) {
      console.error("Failed to fetch sales", error);
    }
  };

  // ============================
  // LOAD DASHBOARD STATS
  // ============================
  const getStats = async () => {
    try {
      const res = await axios.get("/sale/stats");
      if (res.data.success) setStats(res.data.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
  };

  // ============================
  // ON PAGE LOAD
  // ============================
  useEffect(() => {
    getProducts();
    getSales();
    getStats();
  }, []);

  // ============================
  // AUTO CALCULATE TOTALS
  // ============================
  useEffect(() => {
    if (selectedProduct && quantity) {
      const cp = selectedProduct.purchasePrice * quantity;
      const sp = selectedProduct.sellingPrice * quantity;

      setCost(cp);
      setTotal(sp);
      setProfit(sp - cp);
    }
  }, [selectedProduct, quantity]);

  // ============================
  // SAVE SALE (POST /sale/create)
  // ============================
  const handleSaveSale = async () => {
    if (!selectedProduct || !quantity) return;

    try {
      const payload = {
        product: selectedProduct._id,
        quantity: Number(quantity),
        sellingPrice: selectedProduct.sellingPrice,
        purchasePrice: selectedProduct.purchasePrice,
      };

      const res = await axios.post("/sale/create", payload);

      if (res.data.success) {
        showSuccessToast("Sale added successfully");
        getSales();
        getStats();

        // Reset
        setIsModalOpen(false);
        setSelectedProduct(null);
        setQuantity("");
      }
    } catch (error) {
      console.error("Failed to create sale", error);
    }
  };

  // ============================
  // FILTER SALES
  // ============================
  const filteredSales = sales.filter((s) => {
    const matchesDate = filterDate ? s.createdAt.startsWith(filterDate) : true;

    const matchesSearch = s.product?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesDate && matchesSearch;
  });

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <DominoLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ===================== HEADER ===================== */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Sales Dashboard
            </h1>
            <p className="text-gray-500 mt-1">Track and manage your sales</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-lg shadow-lg hover:bg-primary transition-all"
          >
            <Plus size={20} /> Add New Sale
          </button>
        </div>

        {/* ===================== STATS ===================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Sales"
            value={stats.totalSales}
            icon={<ShoppingCart className="text-primary" size={24} />}
          />

          <StatCard
            title="Total Revenue"
            value={`${stats.totalRevenue} SAR`}
            icon={<DollarSign className="text-green-600" size={24} />}
          />

          <StatCard
            title="Total Profit"
            value={`${stats.totalProfit} SAR`}
            icon={<TrendingUp className="text-green-600" size={24} />}
          />
        </div>

        {/* ===================== FILTERS ===================== */}
        <Filters
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* ===================== SALES TABLE ===================== */}
        <SalesTable sales={filteredSales} />

        {/* ===================== ADD SALE MODAL ===================== */}
        {isModalOpen && (
          <AddSaleModal
            products={products}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            quantity={quantity}
            setQuantity={setQuantity}
            cost={cost}
            total={total}
            profit={profit}
            onClose={() => setIsModalOpen(false)}
            handleSaveSale={handleSaveSale}
          />
        )}
      </div>
    </div>
  );
};

export default SalesPage;

/* -----------------------------------------------------------
   REUSABLE COMPONENTS
----------------------------------------------------------- */

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-full">{icon}</div>
    </div>
  </div>
);

const Filters = ({ filterDate, setFilterDate, searchTerm, setSearchTerm }) => (
  <div className="bg-white p-4 rounded-xl shadow-md border">
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search */}
      <div className="flex items-center gap-2 border rounded-lg px-4 py-2 bg-gray-50 flex-1">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search product..."
          className="outline-none bg-transparent flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Date Filter */}
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
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          Clear Filters
        </button>
      )}
    </div>
  </div>
);

const SalesTable = ({ sales }) => (
  <div className="bg-white rounded-xl shadow-md border overflow-hidden">
    <table className="w-full text-left">
      <thead className="bg-primary text-white">
        <tr>
          <th className="py-4 px-6">Date</th>
          <th className="py-4 px-6">Product</th>
          <th className="py-4 px-6">Unit</th>
          <th className="py-4 px-6">Qty</th>
          <th className="py-4 px-6">Total</th>
          <th className="py-4 px-6">Profit</th>
          <th className="py-4 px-6">Invoice</th>
        </tr>
      </thead>

      <tbody>
        {sales.length === 0 ? (
          <tr>
            <td colSpan="7" className="text-center py-12 text-gray-400">
              No sales found
            </td>
          </tr>
        ) : (
          sales.map((sale) => (
            <tr key={sale._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">{sale.createdAt.substring(0, 16)}</td>

              <td className="px-6 py-4">{sale.product.name}</td>

              <td className="px-6 py-4">
                {sale.product.unit === "WEIGHT"
                  ? `${sale.weight}g`
                  : `${sale.quantity} pcs`}
              </td>

              <td className="px-6 py-4">{sale.quantity}</td>

              <td className="px-6 py-4 font-semibold">
                {sale.totalWithVat} SAR
              </td>

              <td className="px-6 py-4 text-green-600 font-semibold">
                {sale.profit} SAR
              </td>

              <td className="px-6 py-4">
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-primary rounded-lg">
                  <FileText size={16} /> View
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

/* -----------------------------------------------------------
   ADD SALE MODAL
----------------------------------------------------------- */

const AddSaleModal = ({
  products,
  selectedProduct,
  setSelectedProduct,
  quantity,
  setQuantity,
  cost,
  total,
  profit,
  handleSaveSale,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <div className="bg-white w-full max-w-lg rounded-xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-white p-5 flex justify-between items-center">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Plus size={20} /> Add Sale
        </h3>
        <button onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className="p-6 space-y-5">
        {/* Product Select */}
        <div>
          <label className="block font-medium mb-1">Select Product</label>
          <select
            className="w-full px-4 py-3 border rounded-lg bg-gray-50"
            value={selectedProduct?._id || ""}
            onChange={(e) => {
              const p = products.find((x) => x._id === e.target.value);
              setSelectedProduct(p);
            }}
          >
            <option value="">Choose...</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} — {p.sellingPrice} SAR
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            min="1"
            className="w-full px-4 py-3 border rounded-lg bg-gray-50"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>

        {/* Summary */}
        {selectedProduct && quantity > 0 && (
          <div className="p-4 bg-blue-50 border rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Cost:</span>
              <span>{cost} SAR</span>
            </div>
            <div className="flex justify-between">
              <span>Total (VAT included):</span>
              <span>{total} SAR</span>
            </div>
            <div className="flex justify-between font-bold text-green-600">
              <span>Profit:</span>
              <span>{profit} SAR</span>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button className="flex-1 border rounded-lg py-2" onClick={onClose}>
            Cancel
          </button>

          <button
            className="flex-1 bg-primary text-white rounded-lg py-2"
            disabled={!selectedProduct || !quantity}
            onClick={handleSaveSale}
          >
            Save Sale
          </button>
        </div>
      </div>
    </div>
  </div>
);
