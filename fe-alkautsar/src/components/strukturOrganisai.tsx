import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/struktur.css";

type Member = {
  name: string;
  position: string;
  img: string;
  bio?: string;
  education?: string;
  years?: string;
};

const strukturData = {
  kepala: {
    name: "Ust. Ahmad Fadly",
    position: "Kepala Pondok",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    bio: "Berdedikasi dalam mengembangkan kurikulum berbasis adab dan teknologi.",
    education: "S2 Pendidikan Islam - Al-Azhar Cairo",
    years: "15 Tahun",
  },
  lurah: [
    {
      name: "Ust. Nur Aulia",
      position: "Lurah 1",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      bio: "Fokus pada pengembangan disiplin dan karakter santri asrama.",
      education: "S1 Syariah - LIPIA Jakarta",
      years: "8 Tahun",
    },
    {
      name: "Ust. Hidayat",
      position: "Lurah 2",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      bio: "Mengelola manajemen fasilitas dan kesejahteraan santri.",
      education: "S1 Manajemen - Universitas Indonesia",
      years: "6 Tahun",
    },
  ],
  bagian: [
    {
      section: "Kesiswaan",
      icon: "bi-people-fill",
      members: [
        {
          name: "Ust. Siti Rahma",
          position: "Koordinator",
          img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
          bio: "Ahli dalam konseling remaja dan pengembangan bakat.",
          education: "S1 Psikologi",
          years: "5 Tahun",
        },
        {
          name: "Ust. Fadli",
          position: "Staff",
          img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
          bio: "Koordinator kegiatan ekstrakurikuler santri.",
          education: "S1 Olahraga",
          years: "3 Tahun",
        },
      ],
    },
    {
      section: "Akademik",
      icon: "bi-book-fill",
      members: [
        {
          name: "Ust. Rahmat",
          position: "Koordinator",
          img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
          bio: "Pengawas kualitas pengajaran dan kurikulum.",
          education: "S2 Kurikulum",
          years: "10 Tahun",
        },
        {
          name: "Ust. Lina",
          position: "Staff",
          img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
          bio: "Adminitrasi nilai dan data akademik santri.",
          education: "S1 Administrasi",
          years: "4 Tahun",
        },
      ],
    },
    {
      section: "Keuangan",
      icon: "bi-cash-stack",
      members: [
        {
          name: "Ust. Hidayat",
          position: "Bendahara",
          img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=200",
          bio: "Transparansi dan manajemen finansial pesantren.",
          education: "S1 Akuntansi",
          years: "7 Tahun",
        },
      ],
    },
  ],
};

const StrukturOrganisasiPage = () => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <div className="struktur-wrapper py-5 mt-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-emerald mb-2 ">
            Struktur Organisasi
          </h2>
          <h5 className="text-gold fw-light tracking-widest text-uppercase">
            Pondok Pesantren Al-Kautsar
          </h5>
          <div className="divider-custom mx-auto mt-4"></div>
        </div>

        <div className="tree-level text-center mb-5">
          <div
            className="profile-card main-leader mx-auto"
            onClick={() => setSelectedMember(strukturData.kepala)}
          >
            <div className="img-container shadow-lg clickable-profile">
              <img
                src={strukturData.kepala.img}
                alt={strukturData.kepala.name}
              />
              <div className="overlay-info">
                <i className="bi bi-eye"></i> Detail
              </div>
            </div>
            <div className="profile-info mt-3">
              <h4 className="fw-bold text-emerald mb-0">
                {strukturData.kepala.name}
              </h4>
              <span className="badge-position shadow-sm">
                {strukturData.kepala.position}
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
          {strukturData.lurah.map((person, idx) => (
            <div
              key={idx}
              className="col-md-4 col-6 text-center position-relative mt-3"
            >
              <div className="connector-v-small mx-auto d-none d-md-block"></div>
              <div
                className="profile-card sub-leader mx-auto"
                onClick={() => setSelectedMember(person)}
              >
                <div className="img-container-md shadow clickable-profile">
                  <img src={person.img} alt={person.name} />
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
          {strukturData.bagian.map((section, idx) => (
            <div key={idx} className="col-lg-4">
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
                  {section.members.map((member, i) => (
                    <div
                      key={i}
                      className="d-flex align-items-center mb-3 member-item p-2 rounded-3"
                      onClick={() => setSelectedMember(member)}
                    >
                      <img
                        src={member.img}
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
                <img src={selectedMember.img} alt={selectedMember.name} />
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
