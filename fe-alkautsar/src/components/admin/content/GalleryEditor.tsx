import type { GalleryItem } from "../../../data/homeContent";
import ImageUploadField from "./ImageUploadField";

type GalleryEditorProps = {
  items: GalleryItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onFileChange: (index: number, file: File | null) => void;
  onChange: <F extends keyof GalleryItem>(
    index: number,
    field: F,
    value: GalleryItem[F],
  ) => void;
};

const GalleryEditor = ({
  items,
  onAdd,
  onRemove,
  onFileChange,
  onChange,
}: GalleryEditorProps) => {
  return (
    <div className="content-editor">
      <div className="content-editor__topbar">
        <h3>Data Gallery</h3>
        <button type="button" className="admin-button" onClick={onAdd}>
          Tambah Foto
        </button>
      </div>

      {items.map((item, index) => (
        <article key={item.id} className="content-item-card">
          <div className="content-item-card__header">
            <strong>Foto #{index + 1}</strong>
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
            <div className="content-field content-field--full">
              <ImageUploadField
                label={`Pilih Gambar Gallery #${index + 1}`}
                value={item.image}
                onFileChange={(file) => onFileChange(index, file)}
                previewAlt={item.title || `Gallery ${index + 1}`}
                emptyMessage="Pilih gambar gallery dari device untuk melihat preview."
                className="content-field--full"
              />
            </div>
          </div>

          <label className="content-field">
            <span>Caption</span>
            <textarea rows={3} value={item.caption} onChange={(event) => onChange(index, "caption", event.target.value)} />
          </label>
        </article>
      ))}
    </div>
  );
};

export default GalleryEditor;
