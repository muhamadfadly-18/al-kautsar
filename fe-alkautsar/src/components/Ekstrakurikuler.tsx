import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/ekstrakurikuler.css";

const EkstrakurikulerPage = () => {
  const ekstrakurikuler = [
    {
      title: "Seni & Budaya",
      icon: "bi-palette-fill",
      gradient: "linear-gradient(135deg, #1a3d2c 0%, #2ecc71 100%)",
      items: [
        "Hadroh",
        "Qosidah",
        "Marawis",
        "Tari Tradisional",
        "Angklung",
        "Drumband",
      ],
    },
    {
      title: "Olahraga",
      icon: "bi-trophy-fill",
      gradient: "linear-gradient(135deg, #0d3b5e 0%, #3498db 100%)",
      items: [
        "Futsal",
        "Voli",
        "Basket",
        "Tenis Meja",
        "Badminton",
        "Bela Diri",
      ],
    },
    {
      title: "Jam'iyyatu",
      icon: "bi-book-half",
      gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      items: ["Muballighin", "Quro'", "Huffadz", "Khatthath"],
    },
    {
      title: "Keterampilan",
      icon: "bi-cpu-fill",
      gradient: "linear-gradient(135deg, #e67e22 0%, #f1c40f 100%)",
      items: ["Multimedia", "Tata Boga", "Paskibra", "Jurnalistik"],
    },
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h6 className="text-success fw-bold text-uppercase tracking-wider">
          Bakat & Minat
        </h6>
        <h2 className="display-5 fw-bold text-dark">Ekstrakurikuler</h2>
        <p className="text-muted mx-auto mt-3" style={{ maxWidth: "600px" }}>
          Wadah eksplorasi diri bagi santri untuk mengasah potensi non-akademik
          di lingkungan islami yang suportif.
        </p>
      </div>

      <div className="row g-4">
        {ekstrakurikuler.map((group, idx) => (
          <div key={idx} className="col-lg-3 col-md-6">
            <div className="ekskul-card h-100 shadow-lg border-0 rounded-5 overflow-hidden">
              <div
                className="ekskul-header p-4 text-center text-white"
                style={{ background: group.gradient }}
              >
                <div className="icon-wrapper mb-3 mx-auto shadow">
                  <i className={`bi ${group.icon} fs-3`}></i>
                </div>
                <h4 className="fw-bold mb-0">{group.title}</h4>
              </div>

              <div className="card-body p-4 bg-white">
                <ul className="list-unstyled mb-0">
                  {group.items.map((item, i) => (
                    <li
                      key={i}
                      className="ekskul-item py-2 border-bottom border-light d-flex align-items-center"
                    >
                      <div className="dot-active me-3"></div>
                      <span className="fw-medium text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default EkstrakurikulerPage;
