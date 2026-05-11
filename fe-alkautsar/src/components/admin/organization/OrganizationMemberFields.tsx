import type { OrganizationMember } from "../../../data/organizationContent";

type OrganizationMemberFieldsProps = {
  title: string;
  member: OrganizationMember;
  onChange: (field: keyof OrganizationMember, value: string) => void;
  onDelete?: () => void;
};

const OrganizationMemberFields = ({
  title,
  member,
  onChange,
  onDelete,
}: OrganizationMemberFieldsProps) => (
  <article className="content-item-card organization-member-card">
    <div className="content-item-card__header">
      <div>
        <span className="admin-card__eyebrow">Anggota</span>
        <h3>{title}</h3>
      </div>
      {onDelete ? (
        <button
          type="button"
          className="content-item-card__delete"
          onClick={onDelete}
        >
          Hapus
        </button>
      ) : null}
    </div>

    <div className="content-editor__grid">
      <label className="content-field">
        <span>Nama</span>
        <input
          value={member.name}
          onChange={(event) => onChange("name", event.target.value)}
          placeholder="Nama pengurus"
        />
      </label>

      <label className="content-field">
        <span>Jabatan</span>
        <input
          value={member.position}
          onChange={(event) => onChange("position", event.target.value)}
          placeholder="Jabatan"
        />
      </label>

      <label className="content-field content-field--full">
        <span>Foto</span>
        <input
          value={member.img}
          onChange={(event) => onChange("img", event.target.value)}
          placeholder="URL gambar"
        />
      </label>

      <label className="content-field">
        <span>Pendidikan</span>
        <input
          value={member.education}
          onChange={(event) => onChange("education", event.target.value)}
          placeholder="Riwayat pendidikan"
        />
      </label>

      <label className="content-field">
        <span>Masa Pengabdian</span>
        <input
          value={member.years}
          onChange={(event) => onChange("years", event.target.value)}
          placeholder="Contoh: 5 Tahun"
        />
      </label>

      <label className="content-field content-field--full">
        <span>Bio</span>
        <textarea
          value={member.bio}
          onChange={(event) => onChange("bio", event.target.value)}
          placeholder="Deskripsi singkat"
          rows={4}
        />
      </label>
    </div>
  </article>
);

export default OrganizationMemberFields;
