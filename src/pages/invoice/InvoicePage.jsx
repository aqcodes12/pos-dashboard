import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Printer, X } from "lucide-react";
import DominoLoader from "../../components/DominoLoader";

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================
  // Fetch All Invoices
  // ======================
  const fetchInvoices = async () => {
    try {
      const res = await axios.get("/invoice/getAll", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setInvoices(res.data.data);
      }
    } catch (err) {
      console.error("Failed loading invoices", err);
    } finally {
      setLoading(false);
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

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Sales History
      </h2>

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
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Invoice</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 text-sm">
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-t">
                  <td className="py-3 px-4 font-semibold">
                    #{inv.invoiceNumber}
                  </td>

                  <td className="py-3 px-4">{inv.customerName}</td>

                  <td className="py-3 px-4">{formatDate(inv.createdAt)}</td>

                  <td className="py-3 px-4">{inv.totalAmount} SAR</td>

                  <td className="py-3 px-4">
                    <button
                      onClick={() => openInvoice(inv._id)}
                      className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-md hover:bg-primary/20"
                    >
                      <FileText size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                  <p className="font-medium">Item {item.weight || 1200}g</p>
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
                <span>{selectedInvoice.totalNetAmount?.toFixed(2)} ر.س</span>
              </p>

              <p className="flex justify-between">
                <span>VAT 15%:</span>
                <span>{selectedInvoice.totalVatAmount?.toFixed(2)} ر.س</span>
              </p>

              <p className="flex justify-between font-bold text-lg border-t pt-2">
                <span>TOTAL:</span>
                <span>{selectedInvoice.totalAmount.toFixed(2)} ر.س</span>
              </p>

              <p className="flex justify-between mt-2">
                <span>Cash:</span>
                <span>{selectedInvoice.totalAmount.toFixed(2)} ر.س</span>
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
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${
                  selectedInvoice.qrCode || selectedInvoice.invoiceNumber
                }`}
                className="border p-2 bg-white"
                alt="QR Code"
              />
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
