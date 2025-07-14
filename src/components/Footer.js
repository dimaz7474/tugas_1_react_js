import React from "react";
import "./Footer.css";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <h2>Mrs. DK Food</h2>
          <p>Mie Goreng & Mie Nyemek khas rumahan, lezat dan halal.</p>
        </div>

        <div className="footer-info">
          <h4>Kontak</h4>
          <p>Jl. Lezat No. 17, Jakarta</p>
          <p>WA: 0813-8008-6961</p>
          <p>Jam Buka: 10.00 - 21.00</p>
        </div>

        <div className="footer-social">
          <h4>Ikuti Kami</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://wa.me/6281380086961" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp />
            </a>
          </div>
        </div>

      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Mrs. DK Food. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
