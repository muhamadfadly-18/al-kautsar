import "bootstrap/dist/css/bootstrap.min.css";
import type { AboutContent } from "../data/homeContent";
import { defaultHomeContent } from "../data/homeContent";
import "../styles/tentang.css";

type TentangProps = {
  content?: AboutContent;
};

const Tentang = ({ content = defaultHomeContent.about }: TentangProps) => {
  return (
    <section className="tentang-section" id="tentangtentangkami">
      <div className="container position-relative z-2">
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h6 className="text-gold fw-bold text-uppercase ls-3 mb-3">
              {content.badge}
            </h6>
            <h2 className="display-4 fw-bold text-dark mb-4 header-title">
              {content.title} <br />
              <span className="text-emerald">{content.highlight}</span>
            </h2>
            <div className="accent-line-gold mb-4"></div>
            <p className="lead text-dark opacity-75 lh-lg fw-medium">
              {content.description}
            </p>
          </div>
          <div className="col-lg-6 text-center">
            <div className="visual-wrapper">
              <div className="img-shadow-decor"></div>
              <img
                src={content.image}
                alt="Education"
                className="img-fluid rounded-5 shadow-lg main-img-frame"
              />
            </div>
          </div>
        </div>

        <div className="row g-4 mt-5">
          <div className="col-md-4">
            <div className="light-glass-card h-100 visi-card">
              <div className="icon-box-modern mb-4">
                <i className="bi bi-bullseye text-gold fs-2"></i>
              </div>
              <h3 className="text-dark fw-bold h4 mb-3">{content.visionTitle}</h3>
              <p className="text-dark opacity-75">
                {content.visionText}
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="light-glass-card h-100 featured-card">
              <div className="icon-box-modern mb-4">
                <i className="bi bi-rocket-takeoff text-emerald fs-2"></i>
              </div>
              <h3 className="text-dark fw-bold h4 mb-3">{content.mottoTitle}</h3>
              <div className="moto-list-modern">
                {content.mottoItems.map((item, index) => (
                  <div key={item} className="moto-item-new">
                    <span
                      className={`dot-solid ${index === 0 ? "gold" : index === 1 ? "emerald" : "blue"}`}
                    ></span>
                    <span className="text-dark fw-bold">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="light-glass-card h-100 fasilitas-card">
              <div className="icon-box-modern mb-4">
                <i className="bi bi-building-check text-gold fs-2"></i>
              </div>
              <h3 className="text-dark fw-bold h4 mb-3">{content.facilityTitle}</h3>
              <ul className="list-unstyled">
                {content.facilities.map((item) => (
                  <li key={item} className="mb-2 text-dark opacity-75 fw-medium">
                    <i className="bi bi-check2-circle me-2 text-emerald"></i>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tentang;
