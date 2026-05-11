import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logoImg from "../assets/logo.png";
import "../styles/navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menu = [
    { label: "Tentang Kami", target: "tentangkami" },
    { label: "Pimpinan", target: "pimpinan" },
    { label: "Kegiatan", target: "kegiatan" },
    { label: "Prestasi", target: "prestasi" },
    { label: "Gallery", target: "gallery" },
    { label: "Ekstrakurikuler", target: "ekstrakurikuler" },
    { label: "Promo", target: "promo" },
  ];

 const handleScroll = (target: string) => {
  if (window.location.pathname === "/") {
    // kalau sudah di landing → langsung scroll
    document.getElementById(target)?.scrollIntoView({
      behavior: "smooth",
    });
  } else {
    // kalau dari halaman lain → navigate dulu
    navigate(`/#${target}`);
  }

  setIsOpen(false);
};

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logoImg} alt="AL-KAUTSAR Logo" style={{ height: "45px" }} />
          <span className="fw-bold ms-2 text-white">AL-KAUTSAR</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {menu.map((item, idx) => (
              <li className="nav-item" key={idx}>
                <a
                  className="nav-link text-white px-3"
                  onClick={() => handleScroll(item.target)}
                  style={{ cursor: "pointer" }}
                >
                  {item.label}
                </a>
              </li>
            ))}


            <li className="nav-item">
              <a
                className="btn ms-lg-3 text-white cta-btn"
                onClick={() => handleScroll("kontak")}
                style={{ cursor: "pointer" }}
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