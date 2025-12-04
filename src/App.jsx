import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/home/HomePage";
import Login from "./pages/auth/Login";
import LoginPage from "./pages/auth/Login";

function App() {
  return (
    <>
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Sidebar />}>
              <Route path="/" element={<HomePage />} />
            </Route>
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
