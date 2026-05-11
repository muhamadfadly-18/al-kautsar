import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import type { ExtracurricularGroup } from "../data/homeContent";
import { defaultHomeContent } from "../data/homeContent";
import "../styles/ekstrakurikuler.css";

type EkstrakurikulerPageProps = {
  items?: ExtracurricularGroup[];
};

const EkstrakurikulerPage = ({
  items = defaultHomeContent.extracurriculars,
}: EkstrakurikulerPageProps) => {
  const ekstrakurikuler =
    items.length > 0 ? items : defaultHomeContent.extracurriculars;

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
        {ekstrakurikuler.map((group) => (
          <div key={group.id} className="col-lg-3 col-md-6">
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
                  {group.items.map((item) => (
                    <li
                      key={item}
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
