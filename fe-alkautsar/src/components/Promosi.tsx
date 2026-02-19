import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/promosi.css";

const PromoPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const promos = [
    {
      title: "Program Ramadhan Spesial",
      tag: "Event Tahunan",
      text: "Pertajam spiritualitas dan jalin ukhuwah di bulan suci bersama mentor berpengalaman.",
      btn: "Daftar Sekarang",
      img: "https://images.unsplash.com/photo-1585036156171-3839efc1a446?auto=format&fit=crop&q=80&w=1200",
      accent: "#2ecc71",
    },
    {
      title: "Donasi Pembangunan Masjid",
      tag: "Amal Jariyah",
      text: "Wujudkan rumah ibadah yang nyaman. Setiap bata yang Anda sumbangkan adalah pahala yang mengalir.",
      btn: "Infaq Sekarang",
      img: "https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&q=80&w=1200",
      accent: "#1abc9c",
    },
    {
      title: "Kelas Mengaji Online",
      tag: "E-Learning",
      text: "Metode belajar praktis dari nol hingga fasih. Fleksibel, interaktif, dan terbimbing.",
      btn: "Gabung Kelas",
      img: "https://images.unsplash.com/photo-1584281723351-90bd57529967?auto=format&fit=crop&q=80&w=1200",
      accent: "#3498db",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [promos.length]);

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div
          className="position-relative overflow-hidden rounded-5 shadow-lg"
          style={{ height: "550px" }}
        >
          {promos.map((promo, index) => (
            <div
              key={index}
              className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.2)), url(${promo.img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: currentSlide === index ? 1 : 0,
                transform: currentSlide === index ? "scale(1)" : "scale(1.1)",
                zIndex: currentSlide === index ? 2 : 1,
                padding: "0 8%",
              }}
            >
              <div
                className={`text-white p-4 p-md-5 rounded-4 animate-content ${currentSlide === index ? "active" : ""}`}
                style={{
                  maxWidth: "600px",
                  backdropFilter: "blur(4px)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <span
                  className="badge mb-3 px-3 py-2 rounded-pill shadow-sm"
                  style={{ backgroundColor: promo.accent, fontSize: "0.85rem" }}
                >
                  {promo.tag}
                </span>
                <h1 className="display-4 fw-bold mb-3 lh-sm">{promo.title}</h1>
                <p className="lead opacity-75 mb-4 fs-5">{promo.text}</p>

                <div className="d-flex gap-3">
                  <a
                    href="#"
                    className="btn btn-lg px-4 py-3 fw-bold rounded-4 shadow"
                    style={{
                      background: promo.accent,
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    {promo.btn}
                  </a>
                  <button className="btn btn-lg btn-outline-light px-4 py-3 rounded-4 fw-bold">
                    Detail Info
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div
            className="position-absolute bottom-0 start-0 w-100 d-flex justify-content-center pb-4"
            style={{ zIndex: 10 }}
          >
            {promos.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="mx-1"
                style={{
                  width: currentSlide === idx ? "40px" : "12px",
                  height: "8px",
                  backgroundColor:
                    currentSlide === idx ? "#fff" : "rgba(255,255,255,0.4)",
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default PromoPage;
