import type { AchievementItem } from "../../../data/homeContent";
import ImageUploadField from "./ImageUploadField";

type AchievementsEditorProps = {
  items: AchievementItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onImageChange: (index: number, file: File | null) => void;
  onChange: <F extends keyof AchievementItem>(
    index: number,
    field: F,
    value: AchievementItem[F],
  ) => void;
};

const AchievementsEditor = ({
  items,
  onAdd,
  onRemove,
  onImageChange,
  onChange,
}: AchievementsEditorProps) => {
  return (
    <div className="content-editor">
      <div className="content-editor__topbar">
        <h3>Data Prestasi</h3>
        <button type="button" className="admin-button" onClick={onAdd}>
          Tambah Prestasi
        </button>
      </div>

      {items.map((item, index) => (
        <article key={item.id} className="content-item-card">
          <div className="content-item-card__header">
            <strong>Prestasi #{index + 1}</strong>
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
              <span>Tahun</span>
              <input value={item.year} onChange={(event) => onChange(index, "year", event.target.value)} />
            </label>
            <label className="content-field">
              <span>Kategori</span>
              <input value={item.category} onChange={(event) => onChange(index, "category", event.target.value)} />
            </label>
            <div className="content-field">
              <span>Gambar</span>
              <ImageUploadField
                label={`Pilih Gambar Prestasi #${index + 1}`}
                value={item.img}
                onFileChange={(file) => onImageChange(index, file)}
                previewAlt={item.title || `Prestasi ${index + 1}`}
                emptyMessage="Pilih gambar prestasi dari device untuk melihat preview."
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

export default AchievementsEditor;
