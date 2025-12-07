import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/home/HomePage";
import Login from "./pages/auth/Login";
import LoginPage from "./pages/auth/Login";
import ProductsPage from "./pages/products/ProductsPage";
import SalesPage from "./pages/sales/SalesPage";
import InvoicePage from "./pages/invoice/InvoicePage";
import SettingsPage from "./pages/settings/SettingsPage";
import Signup from "./pages/auth/Signup";
import ForgetPassword from "./pages/auth/ForgetPassword";
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Sidebar />}>
                <Route path="/dashboard" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/sales" element={<SalesPage />} />
                <Route path="/invoice" element={<InvoicePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
