import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";  
export default function Navbar() {
  return (
    <nav className="navbar">
     <img src={logo} alt="ARCHIVE logo" className="logo-img" />

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/about museum">About Museum</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
    </nav>
  );
}
