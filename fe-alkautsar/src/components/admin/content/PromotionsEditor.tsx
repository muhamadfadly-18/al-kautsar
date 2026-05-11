import type { PromoItem } from "../../../data/homeContent";
import ImageUploadField from "./ImageUploadField";

type PromotionsEditorProps = {
  items: PromoItem[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onImageChange: (index: number, file: File | null) => void;
  onChange: <F extends keyof PromoItem>(
    index: number,
    field: F,
    value: PromoItem[F],
  ) => void;
};

const PromotionsEditor = ({
  items,
  onAdd,
  onRemove,
  onImageChange,
  onChange,
}: PromotionsEditorProps) => {
  return (
    <div className="content-editor">
      <div className="content-editor__topbar">
        <h3>Data Iklan / Promo</h3>
        <button type="button" className="admin-button" onClick={onAdd}>
          Tambah Iklan
        </button>
      </div>

      {items.map((promo, index) => (
        <article key={promo.id} className="content-item-card">
          <div className="content-item-card__header">
            <strong>Iklan #{index + 1}</strong>
            <button type="button" className="content-item-card__delete" onClick={() => onRemove(index)}>
              Hapus
            </button>
          </div>

          <div className="content-editor__grid">
            <label className="content-field">
              <span>Judul</span>
              <input value={promo.title} onChange={(event) => onChange(index, "title", event.target.value)} />
            </label>
            <label className="content-field">
              <span>Tag</span>
              <input value={promo.tag} onChange={(event) => onChange(index, "tag", event.target.value)} />
            </label>
            <label className="content-field">
              <span>Warna Accent</span>
              <input value={promo.accent} onChange={(event) => onChange(index, "accent", event.target.value)} />
            </label>
            <div className="content-field">
              <span>Gambar</span>
              <ImageUploadField
                label={`Pilih Gambar Promo #${index + 1}`}
                value={promo.image}
                onFileChange={(file) => onImageChange(index, file)}
                previewAlt={promo.title || `Promo ${index + 1}`}
                emptyMessage="Pilih gambar promo dari device untuk melihat preview."
              />
            </div>
          </div>

          <label className="content-field">
            <span>Deskripsi</span>
            <textarea rows={3} value={promo.text} onChange={(event) => onChange(index, "text", event.target.value)} />
          </label>

          <div className="content-editor__grid">
            <label className="content-field">
              <span>Teks Tombol Utama</span>
              <input value={promo.buttonText} onChange={(event) => onChange(index, "buttonText", event.target.value)} />
            </label>
            <label className="content-field">
              <span>Teks Tombol Detail</span>
              <input value={promo.detailText} onChange={(event) => onChange(index, "detailText", event.target.value)} />
            </label>
          </div>
        </article>
      ))}
    </div>
  );
};

export default PromotionsEditor;
