import type { BannerContent } from "../data/homeContent";
import { defaultHomeContent } from "../data/homeContent";
import "../styles/banner.css";

type BannerProps = {
  content?: BannerContent;
};

const Banner = ({ content = defaultHomeContent.banner }: BannerProps) => {
  const banner = content;

  return (
    <section
      className={`banner ${banner.image ? "has-image" : "no-image"}`}
      style={banner.image ? { backgroundImage: `url(${banner.image})` } : {}}
    >
      <div className="banner-overlay"></div>

      <div className="banner-content">
        <h1 className="banner-title">{banner.title}</h1>
        <p className="banner-text">{banner.text}</p>

        <div className="banner-actions">
          <a
            className="btn-outline"
            href={banner.primaryHref}
            style={{ textDecoration: "none" }}
          >
            {banner.secondaryLabel}
          </a>
          <a
            className="btn-primary"
            style={{ textDecoration: "none" }}
            href={banner.secondaryHref}
          >
            {banner.secondaryLabel}
          </a>
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
