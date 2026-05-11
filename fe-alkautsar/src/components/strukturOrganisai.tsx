import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import type {
  OrganizationContent,
  OrganizationMember,
} from "../data/organizationContent";
import { defaultOrganizationContent } from "../data/organizationContent";
import { getOrganizationContent } from "../services/content/organization";
import { getSafeImageSrc } from "../utils/image";
import "../styles/struktur.css";

const StrukturOrganisasiPage = () => {
  const [selectedMember, setSelectedMember] =
    useState<OrganizationMember | null>(null);
  const [organization, setOrganization] = useState<OrganizationContent>(
    defaultOrganizationContent,
  );

  useEffect(() => {
    const loadOrganization = async () => {
      try {
        const result = await getOrganizationContent();
        setOrganization(result);
      } catch {
        setOrganization(defaultOrganizationContent);
      }
    };

    void loadOrganization();
  }, []);

  return (
    <div className="struktur-wrapper py-5 mt-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-emerald mb-2 ">
            {organization.title}
          </h2>
          <h5 className="text-gold fw-light tracking-widest text-uppercase">
            {organization.subtitle}
          </h5>
          <div className="divider-custom mx-auto mt-4"></div>
        </div>

        <div className="tree-level text-center mb-5">
          <div
            className="profile-card main-leader mx-auto"
            onClick={() => setSelectedMember(organization.head)}
          >
            <div className="img-container shadow-lg clickable-profile">
              <img
                src={getSafeImageSrc(organization.head.img)}
                alt={organization.head.name}
              />
              <div className="overlay-info">
                <i className="bi bi-eye"></i> Detail
              </div>
            </div>
            <div className="profile-info mt-3">
              <h4 className="fw-bold text-emerald mb-0">
                {organization.head.name}
              </h4>
              <span className="badge-position shadow-sm">
                {organization.head.position}
              </span>
            </div>
          </div>
          <div className="connector-v mx-auto"></div>
        </div>

        <div className="row justify-content-center mb-5 position-relative">
          <div
            className="connector-h position-absolute top-0 start-50 translate-middle-x d-none d-md-block"
            style={{ width: "30%", height: "2px", background: "#d4af37" }}
          ></div>
          {organization.leaders.map((person) => (
            <div
              key={person.id}
              className="col-md-4 col-6 text-center position-relative mt-3"
            >
              <div className="connector-v-small mx-auto d-none d-md-block"></div>
              <div
                className="profile-card sub-leader mx-auto"
                onClick={() => setSelectedMember(person)}
              >
                <div className="img-container-md shadow clickable-profile">
                  <img src={getSafeImageSrc(person.img)} alt={person.name} />
                </div>
                <div className="profile-info-sm mt-2">
                  <h6 className="fw-bold text-emerald mb-0">{person.name}</h6>
                  <p className="text-muted small">{person.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4 mt-5">
          {organization.sections.map((section) => (
            <div key={section.id} className="col-lg-4">
              <div className="section-card shadow-sm h-100 p-4 rounded-4">
                <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                  <div className="icon-box me-3">
                    <i className={`bi ${section.icon}`}></i>
                  </div>
                  <h5 className="fw-bold text-emerald m-0">
                    {section.section}
                  </h5>
                </div>
                <div className="members-list">
                  {section.members.map((member) => (
                    <div
                      key={member.id}
                      className="d-flex align-items-center mb-3 member-item p-2 rounded-3"
                      onClick={() => setSelectedMember(member)}
                    >
                      <img
                        src={getSafeImageSrc(member.img)}
                        alt={member.name}
                        className="rounded-circle me-3 border border-2 border-gold"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h6 className="mb-0 fw-bold text-dark">
                          {member.name}
                        </h6>
                        <small className="text-muted">{member.position}</small>
                      </div>
                      <i className="bi bi-chevron-right ms-auto text-gold small"></i>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div
            className="detail-card-modern shadow-lg p-0 overflow-hidden animate-zoom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header-gold"></div>
            <button
              className="btn-close-custom"
              onClick={() => setSelectedMember(null)}
            >
              ×
            </button>
            <div className="p-4 text-center">
              <div className="img-detail-wrapper mx-auto">
                <img
                  src={getSafeImageSrc(selectedMember.img)}
                  alt={selectedMember.name}
                />
              </div>
              <h3 className="fw-bold text-emerald mt-3 mb-1">
                {selectedMember.name}
              </h3>
              <p className="text-gold fw-bold text-uppercase small ls-2">
                {selectedMember.position}
              </p>

              <div className="info-grid mt-4">
                <div className="info-item">
                  <small>Pendidikan</small>
                  <p>
                    {selectedMember.education || "Informasi Belum Tersedia"}
                  </p>
                </div>
                <div className="info-item">
                  <small>Pengabdian</small>
                  <p>{selectedMember.years || "-"}</p>
                </div>
              </div>

              <div className="bio-section mt-4 p-3 bg-light rounded-4">
                <i className="bi bi-quote text-gold fs-4"></i>
                <p className="text-muted font-italic mb-0">
                  {selectedMember.bio ||
                    "Mendedikasikan diri untuk mencetak generasi Qurani yang kompeten di bidangnya."}
                </p>
              </div>

           
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default StrukturOrganisasiPage;
