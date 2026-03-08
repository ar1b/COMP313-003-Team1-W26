// src/App.jsx
import { useState } from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import "./App.css";
import "./components/Signup.css"; 
import "./components/Login.css";  

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="app-container">
      {/* Toggle buttons */}
      <div className="toggle-buttons">
        <button
          className={showLogin ? "active" : ""}
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
        <button
          className={!showLogin ? "active" : ""}
          onClick={() => setShowLogin(false)}
        >
          Signup
        </button>
      </div>

      {/* Form area */}
      <div className="form-wrapper">
        {showLogin ? <Login /> : <Signup />}
      </div>
    </div>
  );
}

export default App;