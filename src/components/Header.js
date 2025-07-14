import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const logoUrl = "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg";

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <img src={logoUrl} alt="Logo" />
          <span>Mrs. DK Food</span>
        </div>
        <nav className={`nav ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Beranda</Link>
          <Link to="/produk" onClick={() => setMenuOpen(false)}>Produk</Link>
          <Link to="/kontak" onClick={() => setMenuOpen(false)}>Kontak</Link>
          <Link to="/tentang" onClick={() => setMenuOpen(false)}>Tentang Kami</Link>
        </nav>
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
