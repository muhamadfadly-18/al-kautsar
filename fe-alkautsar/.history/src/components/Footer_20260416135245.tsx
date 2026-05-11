import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logoImg from "../assets/logo.png";
import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer-modern pt-5 pb-3">
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="d-flex align-items-center mb-3">
              <img src={logoImg} alt="Logo" style={{ height: "45px" }} />
              <span className="ms-2 fw-bold fs-4 text-white ls-1">
                AL-KAUTSAR
              </span>
            </div>
            <p className="text-light-50 small">
              Mewujudkan pendidikan islami berkualitas, berkarakter qur'ani, dan
              berwawasan global untuk masa depan gemilang.
            </p>
            <div className="d-flex gap-2 mt-4">
              <a href="#" className="social-icon">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-youtube"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4 ms-lg-auto">
            <h5 className="footer-title">Navigasi</h5>
            <ul className="list-unstyled footer-links">
              <li>
                <a href="#beranda">Beranda</a>
              </li>
              <li>
                <a href="#tentang">Tentang Kami</a>
              </li>
              <li>
                <a href="#akademik">Unit Pendidikan</a>
              </li>
              <li>
                <a href="#prestasi">Prestasi</a>
              </li>
              <li>
                <a href="/ppdb">PPDB 2026</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="footer-title">Hubungi Kami</h5>
            <ul className="list-unstyled text-light-50 small">
              <li className="d-flex mb-3">
                <i className="bi bi-geo-alt-fill text-success me-3 fs-5"></i>
                <span>
                  Jl. Pendidikan No. 123, Kota Bekasi, Jawa Barat 17123
                </span>
              </li>
              <li className="d-flex mb-3">
                <i className="bi bi-telephone-fill text-success me-3 fs-5"></i>
                <span>(021) 1234 5678 / +62 812 3456 789</span>
              </li>
              <li className="d-flex mb-3">
                <i className="bi bi-envelope-fill text-success me-3 fs-5"></i>
                <span>info@alkautsar.sch.id</span>
              </li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="footer-title">Lokasi Sekolah</h5>
            <div className="rounded-4 overflow-hidden shadow-sm border border-secondary border-opacity-25">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0573062124!2d106.9744!3d-6.2559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTUnMjEuMiJTIDEwNsKwNTgnMjcuOCJF!5e0!3m2!1sid!2sid!4v1700000000000"
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-5 pt-4 text-center">
          <p className="mb-0 text-light-50 small">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-white fw-bold">Yayasan Al-Kautsar</span>. All
            rights reserved. Made with{" "}
            <i className="bi bi-heart-fill text-danger mx-1"></i>
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
