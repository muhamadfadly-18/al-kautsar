import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logoImg from "../assets/logo.png";
import "../styles/navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img src={logoImg} alt="AL-KAUTSAR Logo" style={{ height: "45px" }} />
          <span className="fw-bold ms-2 text-white">AL-KAUTSAR</span>
        </a>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {["Beranda", "Tentang Kami", "Program", "Berita"].map(
              (item, idx) => (
                <li className="nav-item" key={idx}>
                  <a
                    className="nav-link text-white px-3"
                    href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item}
                  </a>
                </li>
              ),
            )}
            <li className="nav-item">
              <a
                className="btn ms-lg-3 text-white cta-btn"
                href="#kontak"
                onClick={() => setIsOpen(false)}
              >
                Hubungi Kami
              </a>
            </li>
          </ul>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
