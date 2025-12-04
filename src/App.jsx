import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/home/HomePage";
import Login from "./pages/auth/Login";
import LoginPage from "./pages/auth/Login";
import ProductsPage from "./pages/products/ProductsPage";
import SalesPage from "./pages/sales/SalesPage";
import InvoicePage from "./pages/invoice/InvoicePage";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Sidebar />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/invoice" element={<InvoicePage />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
