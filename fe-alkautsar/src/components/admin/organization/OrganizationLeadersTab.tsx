import type { OrganizationMember } from "../../../data/organizationContent";
import { getSafeImageSrc } from "../../../utils/image";

type OrganizationLeadersTabProps = {
  leaders: OrganizationMember[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onPreview: (member: OrganizationMember) => void;
};

const OrganizationLeadersTab = ({
  leaders,
  onAdd,
  onEdit,
  onDelete,
  onPreview,
}: OrganizationLeadersTabProps) => (
  <section className="content-card-list">
    <div className="content-editor__topbar">
      <div>
        <span className="admin-card__eyebrow">Lurah</span>
        <h3>Kelola baris pimpinan kedua</h3>
      </div>
      <button type="button" className="admin-button" onClick={onAdd}>
        Tambah Lurah
      </button>
    </div>

    {leaders.length ? (
      leaders.map((leader, index) => (
        <article key={leader.id} className="content-item-card">
          <div className="content-item-card__header">
            <div>
              <span className="admin-card__eyebrow">Lurah {index + 1}</span>
              <h3>{leader.name}</h3>
            </div>
            <div className="student-table__actions">
              <button
                type="button"
                className="content-tabs__item"
                onClick={() => onPreview(leader)}
              >
                Lihat
              </button>
              <button
                type="button"
                className="content-tabs__item"
                onClick={() => onEdit(leader.id)}
              >
                Edit
              </button>
              <button
                type="button"
                className="content-item-card__delete"
                onClick={() => onDelete(leader.id)}
              >
                Hapus
              </button>
            </div>
          </div>

          <div className="organization-person-row">
            <img src={getSafeImageSrc(leader.img)} alt={leader.name} />
            <div>
              <strong>{leader.position}</strong>
              <p>{leader.education || "Pendidikan belum diisi"}</p>
              <p>{leader.years || "Masa pengabdian belum diisi"}</p>
            </div>
          </div>
        </article>
      ))
    ) : (
      <article className="content-item-card">
        <p className="organization-summary-text">
          Belum ada data lurah. Tambahkan lewat tombol popup di atas.
        </p>
      </article>
    )}
  </section>
);

export default OrganizationLeadersTab;
