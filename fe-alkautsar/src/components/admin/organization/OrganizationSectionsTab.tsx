import type {
  OrganizationMember,
  OrganizationSection,
} from "../../../data/organizationContent";
import { getSafeImageSrc } from "../../../utils/image";

type OrganizationSectionsTabProps = {
  sections: OrganizationSection[];
  onSectionAdd: () => void;
  onSectionEdit: (id: string) => void;
  onSectionDelete: (id: string) => void;
  onMemberAdd: (sectionId: string) => void;
  onMemberEdit: (sectionId: string, memberId: string) => void;
  onMemberDelete: (sectionId: string, memberId: string) => void;
  onPreview: (member: OrganizationMember) => void;
};

const OrganizationSectionsTab = ({
  sections,
  onSectionAdd,
  onSectionEdit,
  onSectionDelete,
  onMemberAdd,
  onMemberEdit,
  onMemberDelete,
  onPreview,
}: OrganizationSectionsTabProps) => (
  <section className="content-card-list">
    <div className="content-editor__topbar">
      <div>
        <span className="admin-card__eyebrow">Bagian</span>
        <h3>Kelola divisi organisasi</h3>
      </div>
      <button type="button" className="admin-button" onClick={onSectionAdd}>
        Tambah Bagian
      </button>
    </div>

    {sections.length ? (
      sections.map((section, index) => (
        <article key={section.id} className="content-item-card organization-section-card">
          <div className="content-item-card__header">
            <div>
              <span className="admin-card__eyebrow">Bagian {index + 1}</span>
              <h3>{section.section}</h3>
            </div>
            <div className="student-table__actions">
              <button
                type="button"
                className="content-tabs__item"
                onClick={() => onSectionEdit(section.id)}
              >
                Edit Bagian
              </button>
              <button
                type="button"
                className="content-item-card__delete"
                onClick={() => onSectionDelete(section.id)}
              >
                Hapus Bagian
              </button>
            </div>
          </div>

          <div className="organization-section-meta">
            <span>
              <strong>Icon:</strong> {section.icon}
            </span>
            <span>
              <strong>Anggota:</strong> {section.members.length}
            </span>
          </div>

          <div className="content-editor__topbar">
            <div>
              <span className="admin-card__eyebrow">Daftar Anggota</span>
              <h3>{section.members.length} anggota</h3>
            </div>
            <button
              type="button"
              className="content-tabs__item"
              onClick={() => onMemberAdd(section.id)}
            >
              Tambah Anggota
            </button>
          </div>

          <div className="organization-member-list">
            {section.members.map((member) => (
              <div key={member.id} className="organization-member-list__item">
                <div className="organization-member-list__profile">
                  <img src={getSafeImageSrc(member.img)} alt={member.name} />
                  <div>
                    <strong>{member.name}</strong>
                    <p>{member.position}</p>
                  </div>
                </div>
                <div className="student-table__actions">
                  <button
                    type="button"
                    className="content-tabs__item"
                    onClick={() => onPreview(member)}
                  >
                    Lihat
                  </button>
                  <button
                    type="button"
                    className="content-tabs__item"
                    onClick={() => onMemberEdit(section.id, member.id)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="content-item-card__delete"
                    onClick={() => onMemberDelete(section.id, member.id)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>
      ))
    ) : (
      <article className="content-item-card">
        <p className="organization-summary-text">
          Belum ada bagian organisasi. Tambahkan lewat popup agar tampil lebih rapi.
        </p>
      </article>
    )}
  </section>
);

export default OrganizationSectionsTab;
