import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/tentang.css";

const Tentang = () => {
  return (
    <section className="tentang-section">
      <div className="container position-relative z-2">
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <h6 className="text-gold fw-bold text-uppercase ls-3 mb-3">
              Discovery Our Essence
            </h6>
            <h2 className="display-4 fw-bold text-dark mb-4 header-title">
              Membangun Peradaban Melalui <br />
              <span className="text-emerald">Pendidikan Islami</span>
            </h2>
            <div className="accent-line-gold mb-4"></div>
            <p className="lead text-dark opacity-75 lh-lg fw-medium">
              Lembaga Al-Kautsar hadir bukan sekadar sebagai tempat belajar,
              melainkan sebuah ekosistem pertumbuhan karakter yang memadukan
              kedalaman spiritual dengan kecakapan teknologi masa depan.
            </p>
          </div>
          <div className="col-lg-6 text-center">
            <div className="visual-wrapper">
              <div className="img-shadow-decor"></div>
              <img
                src="https://images.unsplash.com/photo-1577100078279-b3445dee847c?auto=format&fit=crop&q=80&w=800"
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
              <h3 className="text-dark fw-bold h4 mb-3">Visi Utama</h3>
              <p className="text-dark opacity-75">
                Menjadi pusat keunggulan pendidikan Islam yang melahirkan
                pemimpin masa depan berkarakter{" "}
                <strong className="text-gold">Ahlussunnah Wal Jama'ah</strong>.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="light-glass-card h-100 featured-card">
              <div className="icon-box-modern mb-4">
                <i className="bi bi-rocket-takeoff text-emerald fs-2"></i>
              </div>
              <h3 className="text-dark fw-bold h4 mb-3">Moto Perjuangan</h3>
              <div className="moto-list-modern">
                <div className="moto-item-new">
                  <span className="dot-solid gold"></span>
                  <span className="text-dark fw-bold">Akhlak</span>
                </div>
                <div className="moto-item-new">
                  <span className="dot-solid emerald"></span>
                  <span className="text-dark fw-bold">Ilmu</span>
                </div>
                <div className="moto-item-new">
                  <span className="dot-solid blue"></span>
                  <span className="text-dark fw-bold">Amal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="light-glass-card h-100 fasilitas-card">
              <div className="icon-box-modern mb-4">
                <i className="bi bi-building-check text-gold fs-2"></i>
              </div>
              <h3 className="text-dark fw-bold h4 mb-3">Fasilitas Modern</h3>
              <ul className="list-unstyled">
                <li className="mb-2 text-dark opacity-75 fw-medium">
                  <i className="bi bi-check2-circle me-2 text-emerald"></i>Smart
                  Classrooms
                </li>
                <li className="mb-2 text-dark opacity-75 fw-medium">
                  <i className="bi bi-check2-circle me-2 text-emerald"></i>
                  Asrama Premium
                </li>
                <li className="mb-2 text-dark opacity-75 fw-medium">
                  <i className="bi bi-check2-circle me-2 text-emerald"></i>Sport
                  Center & Gym
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tentang;
