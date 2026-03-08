import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#222", color: "white" }}>
      
      <Link to="/" style={{ marginRight: "15px" }}>Home</Link>

      <Link to="/signup" style={{ marginRight: "15px" }}>Signup</Link>

      <Link to="/login" style={{ marginRight: "15px" }}>Login</Link>

      <Link to="/student-dashboard" style={{ marginRight: "15px" }}>
        Student
      </Link>

      <Link to="/instructor-dashboard" style={{ marginRight: "15px" }}>
        Instructor
      </Link>

      <Link to="/admin-dashboard" style={{ marginRight: "15px" }}>
        Admin
      </Link>

      <Link to="/guest">
        Guest
      </Link>

    </nav>
  );
}

export default Navbar;