import React, { useState } from "react";
import { Settings, Save, Store, Hash, MapPin, Phone } from "lucide-react";

const SettingsPage = () => {
  const [formData, setFormData] = useState({
    shopName: "Fresh Meat & Chicken Shop",
    trn: "123456789012345",
    address: "King Fahd Road, Al Olaya, Riyadh, Saudi Arabia",
    phone: "+966 50 123 4567",
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setIsSaved(false);
  };

  const handleSave = () => {
    // TODO: Save to backend/storage
    console.log("Settings saved:", formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="text-primary" size={28} />
            Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your shop information
          </p>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="space-y-5">
            {/* Shop Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Store size={16} className="text-primary" />
                Shop Name
              </label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Enter shop name"
              />
            </div>

            {/* TRN */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Hash size={16} className="text-primary" />
                Tax Registration Number (TRN)
              </label>
              <input
                type="text"
                name="trn"
                value={formData.trn}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Enter TRN"
                maxLength="15"
              />
              <p className="text-xs text-gray-500 mt-1">
                15-digit tax registration number
              </p>
            </div>

            {/* Address */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={16} className="text-primary" />
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-blue-200 transition resize-none"
                placeholder="Enter shop address"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone size={16} className="text-primary" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-blue-200 transition"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
            >
              <Save size={18} />
              {isSaved ? "Settings Saved!" : "Save Changes"}
            </button>
          </div>

          {/* Success Message */}
          {isSaved && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">
                ✓ Settings saved successfully!
              </p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-primary">
            <span className="font-semibold">Note:</span> These details will
            appear on all your invoices and receipts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
