import type { ExtracurricularGroup } from "../../../data/homeContent";

type ExtracurricularsEditorProps = {
  items: ExtracurricularGroup[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: <F extends keyof ExtracurricularGroup>(
    index: number,
    field: F,
    value: ExtracurricularGroup[F],
  ) => void;
};

const ExtracurricularsEditor = ({
  items,
  onAdd,
  onRemove,
  onChange,
}: ExtracurricularsEditorProps) => {
  return (
    <div className="content-editor">
      <div className="content-editor__topbar">
        <h3>Data Ekstrakurikuler</h3>
        <button type="button" className="admin-button" onClick={onAdd}>
          Tambah Grup
        </button>
      </div>

      {items.map((item, index) => (
        <article key={item.id} className="content-item-card">
          <div className="content-item-card__header">
            <strong>Grup #{index + 1}</strong>
            <button type="button" className="content-item-card__delete" onClick={() => onRemove(index)}>
              Hapus
            </button>
          </div>

          <div className="content-editor__grid">
            <label className="content-field">
              <span>Nama Grup</span>
              <input value={item.title} onChange={(event) => onChange(index, "title", event.target.value)} />
            </label>
            <label className="content-field">
              <span>Icon Bootstrap</span>
              <input value={item.icon} onChange={(event) => onChange(index, "icon", event.target.value)} />
            </label>
            <label className="content-field content-field--full">
              <span>Gradient CSS</span>
              <input value={item.gradient} onChange={(event) => onChange(index, "gradient", event.target.value)} />
            </label>
          </div>

          <label className="content-field">
            <span>Daftar Item (satu baris satu item)</span>
            <textarea
              rows={5}
              value={item.items.join("\n")}
              onChange={(event) =>
                onChange(
                  index,
                  "items",
                  event.target.value.split("\n").map((row) => row.trim()).filter(Boolean),
                )
              }
            />
          </label>
        </article>
      ))}
    </div>
  );
};

export default ExtracurricularsEditor;
