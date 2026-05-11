import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  createAdminUser,
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from "../../../services/admin/settings";
import { createEmptyAdminUserForm } from "./constants";
import AdminSettingsForm from "./AdminSettingsForm";
import AdminSettingsHeader from "./AdminSettingsHeader";
import AdminSettingsStats from "./AdminSettingsStats";
import AdminSettingsTable from "./AdminSettingsTable";
import { filterAdminUsers, getAdminStats } from "./helpers";
import type { AdminUserFormState, AdminUserRecord } from "./types";

const AdminSettingsManager = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<AdminUserFormState>(createEmptyAdminUserForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const result = await getAdminUsers();
        setUsers(result);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal memuat data admin dari server.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return filterAdminUsers(users, search);
  }, [search, users]);

  const { totalActive, totalAdmins, totalSuperAdmins } = useMemo(
    () => getAdminStats(users),
    [users],
  );

  const resetForm = () => {
    setForm(createEmptyAdminUserForm());
    setEditingId(null);
  };

  const handleInputChange = (
    field: keyof AdminUserFormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleEdit = (user: AdminUserRecord) => {
    setEditingId(user.id);
    setStatusMessage("");
    setErrorMessage("");
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role || "admin",
      status: user.status || "active",
    });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();

    if (!trimmedName || !trimmedEmail) {
      setSaving(false);
      setErrorMessage("Nama dan email admin wajib diisi.");
      return;
    }

    if (!editingId && !form.password.trim()) {
      setSaving(false);
      setErrorMessage("Password wajib diisi saat membuat admin baru.");
      return;
    }

    try {
      const payload = {
        ...form,
        name: trimmedName,
        email: trimmedEmail,
      };

      if (editingId) {
        const updated = await updateAdminUser(editingId, payload);
        setUsers((current) =>
          current.map((user) => (user.id === editingId ? updated : user)),
        );
        setStatusMessage("Data admin berhasil diperbarui.");
      } else {
        const created = await createAdminUser(payload);
        setUsers((current) => [created, ...current]);
        setStatusMessage("Admin baru berhasil ditambahkan.");
      }

      resetForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan data admin.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: AdminUserRecord) => {
    const result = await Swal.fire({
      title: "Hapus admin ini?",
      text: `${user.name} (${user.email}) akan dihapus dari daftar admin.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "student-swal-danger",
        cancelButton: "student-swal-cancel",
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAdminUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
      setStatusMessage("Admin berhasil dihapus.");

      if (editingId === user.id) {
        resetForm();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal menghapus admin.",
      );
    }
  };

  return (
    <section className="settings-manager">
      <AdminSettingsHeader />
      <AdminSettingsStats
        totalAdmins={totalAdmins}
        totalActive={totalActive}
        totalSuperAdmins={totalSuperAdmins}
        isEditing={Boolean(editingId)}
      />

      <section className="settings-layout">
        <AdminSettingsForm
          form={form}
          isEditing={Boolean(editingId)}
          saving={saving}
          statusMessage={statusMessage}
          errorMessage={errorMessage}
          onInputChange={handleInputChange}
          onSubmit={() => void handleSubmit()}
          onReset={resetForm}
        />

        <AdminSettingsTable
          users={filteredUsers}
          loading={loading}
          search={search}
          onSearchChange={setSearch}
          onEdit={handleEdit}
          onDelete={(user) => void handleDelete(user)}
        />
      </section>
    </section>
  );
};

export default AdminSettingsManager;
