type ImageUploadFieldProps = {
  label: string;
  value: string;
  onFileChange: (file: File | null) => void;
  previewAlt: string;
  emptyMessage?: string;
  className?: string;
};

const ImageUploadField = ({
  label,
  value,
  onFileChange,
  previewAlt,
  emptyMessage = "Pilih file gambar dari device untuk melihat preview.",
  className = "",
}: ImageUploadFieldProps) => {
  return (
    <div className={`content-image-field ${className}`.trim()}>
      <label className="content-field content-field--full">
        <span>{label}</span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        />
      </label>

      <div className="content-image-preview">
        {value ? (
          <img src={value} alt={previewAlt} />
        ) : (
          <div className="content-image-preview__empty">{emptyMessage}</div>
        )}
      </div>
    </div>
  );
};

export default ImageUploadField;
