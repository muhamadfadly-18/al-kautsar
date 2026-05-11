import type {
  OrganizationContent,
  OrganizationMember,
} from "../../../data/organizationContent";
import { getSafeImageSrc } from "../../../utils/image";

type OrganizationGeneralTabProps = {
  content: OrganizationContent;
  onEditMeta: () => void;
  onEditHead: () => void;
  onPreviewMember: (member: OrganizationMember) => void;
};

const OrganizationGeneralTab = ({
  content,
  onEditMeta,
  onEditHead,
  onPreviewMember,
}: OrganizationGeneralTabProps) => (
  <section className="content-card-list">
    <article className="content-item-card">
      <div className="content-item-card__header">
        <div>
          <span className="admin-card__eyebrow">Informasi Halaman</span>
          <h3>{content.title}</h3>
        </div>
        <button type="button" className="content-tabs__item" onClick={onEditMeta}>
          Edit
        </button>
      </div>
      <p className="organization-summary-text">{content.subtitle}</p>
    </article>

    <article className="content-item-card">
      <div className="content-item-card__header">
        <div>
          <span className="admin-card__eyebrow">Kepala Pondok</span>
          <h3>{content.head.name}</h3>
        </div>
        <div className="student-table__actions">
          <button
            type="button"
            className="content-tabs__item"
            onClick={() => onPreviewMember(content.head)}
          >
            Lihat
          </button>
          <button type="button" className="content-tabs__item" onClick={onEditHead}>
            Edit
          </button>
        </div>
      </div>

      <div className="organization-person-row">
        <img src={getSafeImageSrc(content.head.img)} alt={content.head.name} />
        <div>
          <strong>{content.head.position}</strong>
          <p>{content.head.education || "Pendidikan belum diisi"}</p>
          <p>{content.head.years || "Masa pengabdian belum diisi"}</p>
        </div>
      </div>
    </article>
  </section>
);

export default OrganizationGeneralTab;
