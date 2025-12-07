import React, { useState } from "react";
import {
  LayoutDashboard,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  User,
  NotebookPen,
  ShoppingBasket,
  LogOut,
} from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navigate = useNavigate();
  const location = useLocation();

  const routes = {
    Dashboard: "/dashboard",
    Products: "/products",
    Sales: "/sales",
    Invoice: "/invoice",
    Settings: "/settings",
  };

  const mainMenuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Products", icon: ShoppingBasket },
    { name: "Sales", icon: BarChart3 },
    { name: "Invoice", icon: NotebookPen },
    { name: "Settings", icon: Settings },
  ];

  const handleMenuClick = (itemName) => {
    setIsSidebarOpen(false);
    navigate(routes[itemName]);
  };

  const activeItem =
    mainMenuItems.find((item) => routes[item.name] === location.pathname)
      ?.name || "Dashboard";

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-600 rounded-lg sm:hidden hover:bg-gray-100"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen bg-bgColor transform transition-transform duration-300 ease-in-out 
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 sm:hidden text-gray-600 hover:text-gray-800 bg-gray-200 rounded-full p-1"
        >
          <X size={22} />
        </button>

        {/* Logo Section */}
        <div className="px-6 py-8 flex items-center justify-center gap-3">
          <span className="text-3xl md:text-4xl font-[700] text-primary tracking-widest">
            POS
          </span>
        </div>

        {/* Main Menu */}
        <div className="px-6 pb-4">
          <nav className="space-y-1">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === routes[item.name];

              return (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item.name)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-sm transition-colors ${
                    isActive
                      ? "bg-white text-primary border-l-4 border-primary"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? "text-primary" : "text-gray-400"
                    }`}
                  />
                  <span className="text-base font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
          {/* Logout Button */}
          <div className="mt-4">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition bg-red-500/10 rounded-md"
            >
              <LogOut className="w-6 h-6" />
              <span className="text-base font-medium">LOGOUT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile outside click */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 sm:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="p-4 sm:ml-64 bg-bgColor min-h-screen">
        <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm flex flex-col min-h-[85vh]">
          {/* Header */}
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 border-b pb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {activeItem}
            </h1>

            {/* Search & User */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Bell className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/5 p-2 rounded-full">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name || "User"}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-grow">
            <Outlet />
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-80 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Are you sure you want to logout?
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              You will be redirected to login.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-sm rounded-md border"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
