import { adminRoleOptions, adminStatusOptions } from "./constants";
import type { AdminUserFormState } from "./types";

type AdminSettingsFormProps = {
  form: AdminUserFormState;
  isEditing: boolean;
  saving: boolean;
  statusMessage: string;
  errorMessage: string;
  onInputChange: (field: keyof AdminUserFormState, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
};

const AdminSettingsForm = ({
  form,
  isEditing,
  saving,
  statusMessage,
  errorMessage,
  onInputChange,
  onSubmit,
  onReset,
}: AdminSettingsFormProps) => (
  <article className="student-form-card settings-form-card">
    <div className="admin-card__header">
      <div>
        <span className="admin-card__eyebrow">Form</span>
        <h3>{isEditing ? "Edit akun admin" : "Tambah akun admin"}</h3>
      </div>
      {isEditing ? (
        <button
          type="button"
          className="content-tabs__item"
          onClick={onReset}
          disabled={saving}
        >
          Batal Edit
        </button>
      ) : null}
    </div>

    <div className="student-form-grid">
      <label className="content-field">
        <span>Nama admin</span>
        <input
          value={form.name}
          onChange={(event) => onInputChange("name", event.target.value)}
          placeholder="Nama lengkap admin"
        />
      </label>

      <label className="content-field">
        <span>Email admin</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => onInputChange("email", event.target.value)}
          placeholder="admin@alkautsar.sch.id"
        />
      </label>

      <label className="content-field">
        <span>
          Password {isEditing ? "(opsional, atur dari backend bila perlu)" : ""}
        </span>
        <input
          type="password"
          value={form.password}
          onChange={(event) => onInputChange("password", event.target.value)}
          placeholder={
            isEditing
              ? "Kosongkan jika password tidak diubah"
              : "Minimal isi password admin"
          }
        />
      </label>

      <label className="content-field">
        <span>Role</span>
        <select
          value={form.role}
          onChange={(event) => onInputChange("role", event.target.value)}
        >
          {adminRoleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="content-field">
        <span>Status</span>
        <select
          value={form.status}
          onChange={(event) => onInputChange("status", event.target.value)}
        >
          {adminStatusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>

    {statusMessage ? (
      <div className="content-status content-status--success">{statusMessage}</div>
    ) : null}

    {errorMessage ? (
      <div className="content-status content-status--error">{errorMessage}</div>
    ) : null}

    <div className="settings-form-actions">
      <button
        type="button"
        className="admin-button"
        onClick={onSubmit}
        disabled={saving}
      >
        {saving ? "Menyimpan..." : isEditing ? "Update Admin" : "Simpan Admin"}
      </button>
    </div>
  </article>
);

export default AdminSettingsForm;
