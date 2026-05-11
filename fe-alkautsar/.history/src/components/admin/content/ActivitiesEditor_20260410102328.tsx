import type { ActivityItem } from "../../../data/homeContent";
import ImageUploadField from "./ImageUploadField";

type ActivitiesEditorProps = {
  items: ActivityItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onImageChange: (index: number, file: File | null) => void;
  onChange: <F extends keyof ActivityItem>(
    index: number,
    field: F,
    value: ActivityItem[F],
  ) => void;
};

const ActivitiesEditor = ({
  items,
  onAdd,
  onRemove,
  onImageChange,
  onChange,
}: ActivitiesEditorProps) => {
  return (
    <div className="content-editor">
      <div className="content-editor__topbar">
        <h3>Data Kegiatan</h3>
        <button type="button" className="admin-button" onClick={onAdd}>
          Tambah Kegiatan
        </button>
      </div>

      {items.map((item, index) => (
        <article key={item.id} className="content-item-card">
          <div className="content-item-card__header">
            <strong>Kegiatan #{index + 1}</strong>
            <button type="button" className="content-item-card__delete" onClick={() => onRemove(index)}>
              Hapus
            </button>
          </div>

          <div className="content-editor__grid">
            <label className="content-field">
              <span>Judul</span>
              <input value={item.title} onChange={(event) => onChange(index, "title", event.target.value)} />
            </label>
            <label className="content-field">
              <span>Kategori</span>
              <input value={item.category} onChange={(event) => onChange(index, "category", event.target.value)} />
            </label>
            <label className="content-field">
              <span>Tanggal</span>
              <input value={item.date} onChange={(event) => onChange(index, "date", event.target.value)} />
            </label>
            <div className="content-field">
              <span>Gambar</span>
              <ImageUploadField
                label={`Pilih Gambar Kegiatan #${index + 1}`}
                value={item.image}
                onFileChange={(file) => onImageChange(index, file)}
                previewAlt={item.title || `Kegiatan ${index + 1}`}
                emptyMessage="Pilih gambar kegiatan dari device untuk melihat preview."
              />
            </div>
          </div>

          <label className="content-field">
            <span>Deskripsi</span>
            <textarea rows={4} value={item.desc} onChange={(event) => onChange(index, "desc", event.target.value)} />
          </label>
        </article>
      ))}
    </div>
  );
};

export default ActivitiesEditor;
