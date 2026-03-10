import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="nav-links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>

         {/*  dashboard testing */}
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/subjects">Subjects</Link>
      </div>

    </nav>
  );
}

export default Navbar;