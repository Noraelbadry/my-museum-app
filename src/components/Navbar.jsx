import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);


  const Logo = () => (
    <svg width="180" height="44" viewBox="0 0 260 62" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5e49c"/>
          <stop offset="40%" stopColor="#d4af5a"/>
          <stop offset="80%" stopColor="#a07830"/>
          <stop offset="100%" stopColor="#c8952a"/>
        </linearGradient>
      </defs>
      <line x1="3" y1="58" x2="28" y2="4" stroke="url(#gold)" strokeWidth="3.2" strokeLinecap="round"/>
      <line x1="53" y1="58" x2="28" y2="4" stroke="url(#gold)" strokeWidth="3.2" strokeLinecap="round"/>
      <line x1="14" y1="42" x2="42" y2="42" stroke="url(#gold)" strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M12 33 Q28 20 44 33 Q28 46 12 33Z" stroke="#d4af5a" strokeWidth="1.1" fill="rgba(212,175,90,0.08)"/>
      <circle cx="28" cy="33" r="7" stroke="#d4af5a" strokeWidth="1.1" fill="none"/>
      <circle cx="28" cy="33" r="3.2" fill="#d4af5a"/>
      <circle cx="28" cy="33" r="1.3" fill="#0d0a06"/>
      <path d="M37 37 Q43 43 50 40" stroke="#d4af5a" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <text x="62" y="52" fontFamily="'Cinzel', serif" fontSize="42" fontWeight="400" letterSpacing="6" fill="url(#gold)">Rchive</text>
    </svg>
  );


  return (
    <nav className="navbar">
      <div className="nav-container">

        <Link to="/" className="logo-link">
          <Logo />
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <div className={isOpen ? "bar open" : "bar"}></div>
          <div className={isOpen ? "bar open" : "bar"}></div>
          <div className={isOpen ? "bar open" : "bar"}></div>
        </div>

        <div className={`nav-links ${isOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={location.pathname === "/" ? "nav-item active" : "nav-item"}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={location.pathname === "/about" ? "nav-item active" : "nav-item"}
            onClick={() => setIsOpen(false)}
          >
            Egypt Timeline
          </Link>
          <Link
            to="/contact"
            className={location.pathname === "/contact" ? "nav-item active" : "nav-item"}
            onClick={() => setIsOpen(false)}
          >
              About Museum
          </Link>
          <Link
            to="/timeline"
            className={location.pathname === "/timeline" ? "nav-item active" : "nav-item"}
            onClick={() => setIsOpen(false)}
          >


            Contact Us
          </Link>
        </div>

      </div>
    </nav>
  );
}