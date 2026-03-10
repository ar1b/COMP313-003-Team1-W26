// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";

import "./App.css";
import "./components/Signup.css";
import "./components/Login.css";
import "./components/Navbar.css";


function App() {
  return (
    <Router>
      <div className="app-container">

        {/* Navigation Bar */}
        <Navbar />

        {/* Routes only for completed features */}
        <div className="page-container">
          <Routes>

            {/* Default page */}
            <Route path="/" element={<Login />} />

            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/dashboard" element={<Dashboard />} />

          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;