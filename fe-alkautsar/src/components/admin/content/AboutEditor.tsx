import type { HomeContent } from "../../../data/homeContent";
import ImageUploadField from "./ImageUploadField";

type AboutEditorProps = {
  about: HomeContent["about"];
  onChange: (
    field: keyof HomeContent["about"],
    value: string | string[],
  ) => void;
  onImageChange: (file: File | null) => void;
};

const AboutEditor = ({ about, onChange, onImageChange }: AboutEditorProps) => {
  return (
    <div className="content-editor">
      <div className="content-editor__grid">
        <label className="content-field">
          <span>Badge</span>
          <input value={about.badge} onChange={(event) => onChange("badge", event.target.value)} />
        </label>
        <label className="content-field">
          <span>Judul</span>
          <input value={about.title} onChange={(event) => onChange("title", event.target.value)} />
        </label>
        <label className="content-field">
          <span>Highlight</span>
          <input value={about.highlight} onChange={(event) => onChange("highlight", event.target.value)} />
        </label>
        <div className="content-field">
          <span>Gambar</span>
          <ImageUploadField
            label="Pilih Gambar About"
            value={about.image}
            onFileChange={onImageChange}
            previewAlt={about.title || "About sekolah"}
            emptyMessage="Pilih gambar section about dari device untuk melihat preview."
          />
        </div>
      </div>

      <label className="content-field">
        <span>Deskripsi</span>
        <textarea rows={4} value={about.description} onChange={(event) => onChange("description", event.target.value)} />
      </label>

      <div className="content-editor__grid">
        <label className="content-field">
          <span>Judul Visi</span>
          <input value={about.visionTitle} onChange={(event) => onChange("visionTitle", event.target.value)} />
        </label>
        <label className="content-field">
          <span>Judul Motto</span>
          <input value={about.mottoTitle} onChange={(event) => onChange("mottoTitle", event.target.value)} />
        </label>
        <label className="content-field">
          <span>Judul Fasilitas</span>
          <input value={about.facilityTitle} onChange={(event) => onChange("facilityTitle", event.target.value)} />
        </label>
      </div>

      <label className="content-field">
        <span>Isi Visi</span>
        <textarea rows={3} value={about.visionText} onChange={(event) => onChange("visionText", event.target.value)} />
      </label>

      <label className="content-field">
        <span>Item Motto (satu baris satu item)</span>
        <textarea
          rows={4}
          value={about.mottoItems.join("\n")}
          onChange={(event) =>
            onChange(
              "mottoItems",
              event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
            )
          }
        />
      </label>

      <label className="content-field">
        <span>Fasilitas (satu baris satu item)</span>
        <textarea
          rows={4}
          value={about.facilities.join("\n")}
          onChange={(event) =>
            onChange(
              "facilities",
              event.target.value.split("\n").map((item) => item.trim()).filter(Boolean),
            )
          }
        />
      </label>
    </div>
  );
};

export default AboutEditor;
