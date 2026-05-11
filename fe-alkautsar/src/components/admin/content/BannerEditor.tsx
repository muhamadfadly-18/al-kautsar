import type { HomeContent } from "../../../data/homeContent";
import ImageUploadField from "./ImageUploadField";

type BannerEditorProps = {
  banner: HomeContent["banner"];
  onChange: (field: keyof HomeContent["banner"], value: string) => void;
  onImageChange: (file: File | null) => void;
};

const BannerEditor = ({ banner, onChange, onImageChange }: BannerEditorProps) => {
  return (
    <div className="content-editor">
      <div className="content-editor__grid">
        <label className="content-field">
          <span>Judul Banner</span>
          <input value={banner.title} onChange={(event) => onChange("title", event.target.value)} />
        </label>
        <div className="content-field">
          <span>Gambar Banner</span>
          <ImageUploadField
            label="Pilih Gambar Banner"
            value={banner.image}
            onFileChange={onImageChange}
            previewAlt={banner.title || "Banner website"}
            emptyMessage="Pilih gambar banner dari device untuk melihat preview."
          />
        </div>
      </div>

      <label className="content-field">
        <span>Deskripsi Banner</span>
        <textarea rows={4} value={banner.text} onChange={(event) => onChange("text", event.target.value)} />
      </label>

      <div className="content-editor__grid">
        <label className="content-field">
          <span>Tombol 1</span>
          <input value={banner.primaryLabel} onChange={(event) => onChange("primaryLabel", event.target.value)} />
        </label>
        <label className="content-field">
          <span>Link Tombol 1</span>
          <input value={banner.primaryHref} onChange={(event) => onChange("primaryHref", event.target.value)} />
        </label>
        <label className="content-field">
          <span>Tombol 2</span>
          <input value={banner.secondaryLabel} onChange={(event) => onChange("secondaryLabel", event.target.value)} />
        </label>
        <label className="content-field">
          <span>Link Tombol 2</span>
          <input value={banner.secondaryHref} onChange={(event) => onChange("secondaryHref", event.target.value)} />
        </label>
      </div>
    </div>
  );
};

export default BannerEditor;
