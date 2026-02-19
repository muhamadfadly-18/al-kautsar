import { useEffect, useState } from "react";
import "../styles/banner.css";

interface BannerData {
  id: number;
  title: string;
  text: string;
  image: string;
}

const Banner = () => {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/banners`)
      .then((res) => res.json())
      .then((data: BannerData[]) => {
        setBanner(data[0]);
      })
      .catch(console.error);
  }, [API_URL]);

  if (!banner)
    return (
      <h1 style={{ color: "white", textAlign: "center", marginTop: "20%" }}>
        Loading...
      </h1>
    );

  return (
    <section
      className={`banner ${banner.image ? "has-image" : "no-image"}`}
      style={
        banner.image
          ? { backgroundImage: `url(${API_URL}/assets/${banner.image})` }
          : {}
      }
    >
      <div className="banner-overlay"></div>

      <div className="banner-content">
        <h1 className="banner-title">{banner.title}</h1>
        <p className="banner-text">{banner.text}</p>

        <div className="banner-actions">
          <button className="btn-outline">Tentang ALKA</button>
          <button className="btn-primary">PPDB ALKA 2025</button>
        </div>
      </div>
      
      <div className="wave">
        <svg
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax">
            <use href="#gentle-wave" x="48" y="0" />
            <use href="#gentle-wave" x="48" y="3" />
            <use href="#gentle-wave" x="48" y="5" />
            <use href="#gentle-wave" x="48" y="7" />
          </g>
        </svg>
      </div>
    </section>
  );
};

export default Banner;
