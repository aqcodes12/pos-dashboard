import React, { useState } from "react";
import { FileText, Printer, X } from "lucide-react";

const InvoicePage = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Dummy sales data
  const sales = [
    {
      id: 1,
      invoiceNo: "INV-1001",
      date: "2025-01-10 10:30 AM",
      product: "Fresh Chicken Breast",
      weight: "1 KG",
      qty: 2,
      price: 28,
      shopName: "Fresh Meat & Chicken Shop",
      trn: "123456789012345",
    },
    {
      id: 2,
      invoiceNo: "INV-1002",
      date: "2025-01-10 09:15 AM",
      product: "Mutton Boneless",
      weight: "1 KG",
      qty: 1,
      price: 52,
      shopName: "Fresh Meat & Chicken Shop",
      trn: "123456789012345",
    },
  ];

  // Generate QR Code text
  const makeQR = (data) => {
    return btoa(
      `Shop:${data.shopName}\nTRN:${data.trn}\nTotal:${
        data.qty * data.price
      }\nDate:${data.date}`
    );
  };

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Sales History
      </h2>

      {/* ===================== SALES TABLE ===================== */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="py-3 px-4">Invoice No</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Qty</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Invoice</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 text-sm">
            {sales.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="py-3 px-4 font-semibold">{item.invoiceNo}</td>
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4">{item.product}</td>
                <td className="py-3 px-4">{item.qty}</td>
                <td className="py-3 px-4">{item.qty * item.price} SAR</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => setSelectedInvoice(item)}
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

      {/* ===================== INVOICE MODAL ===================== */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg relative print:p-0 print:shadow-none print:max-w-full print:bg-white">
            {/* Close Button */}
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 no-print"
            >
              <X size={22} />
            </button>

            {/* Print */}
            <div className="flex justify-start mb-4 no-print">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
              >
                <Printer size={18} /> Print
              </button>
            </div>

            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold">{selectedInvoice.shopName}</h1>
              <p className="text-gray-600">TRN: {selectedInvoice.trn}</p>
            </div>

            {/* Invoice Details */}
            <div className="text-gray-700 text-sm mb-6">
              <p>
                <strong>Invoice No:</strong> {selectedInvoice.invoiceNo}
              </p>
              <p>
                <strong>Date:</strong> {selectedInvoice.date}
              </p>
            </div>

            {/* Product Table */}
            <table className="w-full border border-gray-300 text-sm mb-6">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="p-2 text-left">Product</th>
                  <th className="p-2 text-left">Weight</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="p-2">{selectedInvoice.product}</td>
                  <td className="p-2">{selectedInvoice.weight}</td>
                  <td className="p-2 text-center">{selectedInvoice.qty}</td>
                  <td className="p-2 text-right">
                    {selectedInvoice.price} SAR
                  </td>
                  <td className="p-2 text-right">
                    {selectedInvoice.qty * selectedInvoice.price} SAR
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total */}
            <div className="flex justify-end mb-6">
              <p className="text-lg font-semibold">
                Total: {selectedInvoice.qty * selectedInvoice.price} SAR
              </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${makeQR(
                  selectedInvoice
                )}`}
                alt="QR"
                className="border p-2 bg-white"
              />
              <p className="text-xs text-gray-500 mt-2">ZATCA QR Code</p>
            </div>

            {/* Print Styles */}
            <style>
              {`
              @media print {
                .no-print {
                  display: none !important;
                }
                body {
                  background: white !important;
                }
                .shadow-lg {
                  box-shadow: none !important;
                }
              }
            `}
            </style>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
