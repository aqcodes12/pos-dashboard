import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Pencil, Printer, Trash2, X } from "lucide-react";
import DominoLoader from "../../components/DominoLoader";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [salesList, setSalesList] = useState([]);
  const [selectedSales, setSelectedSales] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [creating, setCreating] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [invoiceToEdit, setInvoiceToEdit] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const toggleSaleSelection = (id) => {
    setSelectedSales((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // ======================
  // Fetch All Invoices
  // ======================
  const fetchSales = async () => {
    try {
      const res = await axios.get("/sale/getAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setSalesList(res.data.data);
      }
    } catch (err) {
      console.error("Error loading sales", err);
    }
  };

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("/invoice/getAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        const sorted = res.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setInvoices(sorted);
      }
    } catch (err) {
      console.error("Failed loading invoices", err);
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async () => {
    if (selectedSales.length === 0 || !customerName.trim()) {
      alert("Please choose at least one sale and enter customer name");
      return;
    }

    try {
      setCreating(true);

      const res = await axios.post(
        "/invoice/create",
        {
          sales: selectedSales, // << MULTIPLE IDs
          customerName,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        alert("Invoice created!");

        setCreateModal(false);
        setSelectedSales([]);
        setCustomerName("");

        await fetchInvoices();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
    } finally {
      setCreating(false);
    }
  };

  const updateInvoice = async () => {
    if (selectedSales.length === 0) {
      alert("Please select at least one sale");
      return;
    }

    try {
      setCreating(true);

      const res = await axios.patch(
        `/invoice/update/${invoiceToEdit}`,
        {
          sales: selectedSales,
          customerName: customerName || "", // optional
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        alert("Invoice updated!");
        setCreateModal(false);
        setEditMode(false);
        setSelectedSales([]);
        setCustomerName("");

        await fetchInvoices();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update invoice");
    } finally {
      setCreating(false);
    }
  };

  const deleteInvoice = async (id) => {
    try {
      const res = await axios.delete(`/invoice/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        alert("Invoice deleted!");
        setDeleteConfirm(null);
        fetchInvoices();
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ======================
  // Fetch Invoice By ID
  // ======================
  const openInvoice = async (id) => {
    try {
      const res = await axios.get(`/invoice/getById/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setSelectedInvoice(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching invoice detail", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Format date
  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString("en", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const subtotal = Number(selectedInvoice?.totalNetAmount || 0);
  const vat = Number(selectedInvoice?.totalVatAmount || 0);
  const total = Number(selectedInvoice?.totalAmount || 0);

  return (
    <div className="p-6 min-h-screen">
      <div className="flex-wrap md:flex justify-center  md:justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Sales History</h2>
        <button
          onClick={() => {
            fetchSales();
            setCreateModal(true);
          }}
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          + Create Invoice
        </button>
      </div>

      {/* ===================== LOADING ===================== */}
      {loading && (
        <div className="h-screen flex justify-center items-center">
          <DominoLoader />
        </div>
      )}

      {/* ===================== SALES TABLE ===================== */}
      {!loading && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full border-collapse text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm">
              <tr>
                <th className="py-3 px-4">Invoice No</th>

                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Invoice</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 text-sm">
              {invoices.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv._id} className="border-t">
                    <td className="py-3 px-4 font-semibold">
                      #{inv.invoiceNumber}
                    </td>

                    <td className="py-3 px-4">{formatDate(inv.createdAt)}</td>

                    <td className="py-3 px-4">{inv.totalAmount} SAR</td>

                    {/* VIEW BUTTON */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => openInvoice(inv._id)}
                        className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-md hover:bg-primary/20"
                      >
                        <FileText size={16} /> View
                      </button>
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="py-3 px-4 flex items-center gap-3">
                      {/* UPDATE ICON BUTTON */}
                      <button
                        onClick={() => {
                          fetchSales();
                          setEditMode(true);
                          setInvoiceToEdit(inv._id);

                          setSelectedSales(inv.sales.map((s) => s._id));
                          setCustomerName(inv.customerName);

                          setCreateModal(true);
                        }}
                        className="p-2 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                        title="Update Invoice"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* DELETE ICON BUTTON */}
                      <button
                        onClick={() => setDeleteConfirm(inv._id)}
                        className="p-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
                        title="Delete Invoice"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-sm rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Invoice?
            </h3>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete invoice #{deleteConfirm}?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={() => deleteInvoice(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {createModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setCreateModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={22} />
            </button>

            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Create Invoice
            </h2>

            {/* Multi-Select Dropdown */}
            <label className="text-sm font-medium text-gray-700">
              Select Sales
            </label>

            <div className="relative mb-4">
              {/* Dropdown Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full border rounded-lg px-3 py-2 flex justify-between items-center bg-white"
              >
                <span className="text-gray-700">
                  {selectedSales.length === 0
                    ? "Select sales..."
                    : `${selectedSales.length} selected`}
                </span>

                <svg
                  className={`w-4 h-4 transform transition ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown List */}
              {dropdownOpen && (
                <div className="absolute z-50 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-y-auto shadow-lg">
                  {salesList.map((sale) => {
                    const checked = selectedSales.includes(sale._id);
                    return (
                      <div
                        key={sale._id}
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleSaleSelection(sale._id)}
                      >
                        <div>
                          <p className="font-medium">{sale.product?.name}</p>
                          <p className="text-xs text-gray-500">
                            {sale.quantity}× {sale.sellingPrice} SAR
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSaleSelection(sale._id)}
                          className="w-4 h-4 accent-primary"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Customer Name */}
            <label className="text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="Enter customer name"
              className="w-full border rounded-lg px-3 py-2 mt-1 mb-4"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            {/* Create Button */}
            <button
              onClick={editMode ? updateInvoice : createInvoice}
              disabled={creating}
              className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary/80 disabled:bg-gray-300"
            >
              {creating
                ? editMode
                  ? "Updating..."
                  : "Creating..."
                : editMode
                ? "Update Invoice"
                : "Create Invoice"}
            </button>
          </div>
        </div>
      )}

      {/* ===================== INVOICE MODAL ===================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 no-print">
          {/* RECEIPT WRAPPER — scroll safely inside modal */}
          <div
            className="bg-white rounded-lg shadow-lg relative w-[340px] max-h-[95vh] overflow-y-auto print:overflow-visible print:max-h-none print:shadow-none print:w-full"
            id="receipt"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 no-print"
            >
              <X size={22} />
            </button>

            {/* PRINT BUTTON */}
            <div className="p-4 pb-0 text-center no-print">
              <button
                onClick={() => window.print()}
                className="flex mx-auto gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
              >
                <Printer size={18} /> Print
              </button>
            </div>

            {/* ================= HEADER ================= */}
            <div className="text-center leading-tight p-4 pb-1">
              <h2 className="font-bold text-lg">
                مؤسسة جوهره ابراهيم
                <br />
                احمد الحمادي للدواجن
              </h2>

              <p className="text-xs text-gray-700 mt-1 leading-tight">
                7774 الامير بندر بن عبدالعزيز
                <br />
                34426 Al Khobar
              </p>

              <p className="mt-1 font-semibold text-sm">
                Tax No: 310613414700003
              </p>

              <p className="mt-2 font-bold border-t border-gray-300 pt-1">
                Simplified Tax Invoice
              </p>
            </div>

            {/* ================= DETAILS ================= */}
            <div className="text-gray-800 text-sm px-4 leading-6">
              <p>
                <strong>Invoice No:</strong> {selectedInvoice.invoiceNumber}
              </p>
              <p>
                <strong>Date:</strong> {formatDate(selectedInvoice.createdAt)}
              </p>
              <p>
                <strong>User:</strong> Admin
              </p>
              <p>
                <strong>Order:</strong> #
                {selectedInvoice.sales?.[0]?._id.slice(-4)}
              </p>
            </div>

            {/* ================= ITEMS ================= */}
            <div className="border-y border-gray-300 py-3 text-sm px-4 mt-2">
              {selectedInvoice.sales.map((item) => (
                <div key={item._id} className="mb-2">
                  {/* Product Name */}
                  <p className="font-medium">
                    {item.product?.name || "No product name"}
                  </p>

                  {/* Weight */}
                  <p className="font-medium">Item {item.weight || 1200}g</p>

                  {/* Price Row */}
                  <p className="flex justify-between text-gray-700">
                    <span>
                      {item.quantity} × {item.sellingPrice.toFixed(2)} ر.س
                    </span>
                    <span>
                      {(item.quantity * item.sellingPrice).toFixed(2)} ر.س
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* ================= TOTALS ================= */}
            <div className="text-sm px-4 space-y-1 mt-2">
              <p className="flex justify-between">
                <span>Subtotal:</span>
                <span>{subtotal.toFixed(2)} ر.س</span>
              </p>

              <p className="flex justify-between">
                <span>VAT (15%):</span>
                <span>{vat.toFixed(2)} ر.س</span>
              </p>

              <p className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{total.toFixed(2)} ر.س</span>
              </p>

              <p className="flex justify-between mt-2">
                <span>Cash:</span>
                <span>{total.toFixed(2)} ر.س</span>
              </p>
            </div>

            {/* ================= BARCODE ================= */}
            <div className="text-center mt-4">
              <img
                src={`https://barcodeapi.org/api/128/${selectedInvoice.invoiceNumber}`}
                className="mx-auto h-12"
                alt="barcode"
              />
              <p className="text-sm mt-1">{selectedInvoice.invoiceNumber}</p>
            </div>

            {/* ================= QR ================= */}
            <div className="flex justify-center mt-3 mb-4">
              <div className="flex justify-center mt-3 mb-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(
                    selectedInvoice.qrCode
                  )}`}
                  className="border p-2 bg-white"
                  alt="QR Code"
                />
              </div>
            </div>
          </div>

          {/* PRINT FIXES */}
          <style>
            {`
        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }

          body * {
            visibility: hidden !important;
          }

          #receipt, #receipt * {
            visibility: visible !important;
          }

          #receipt {
            width: 80mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
        }
      `}
          </style>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
