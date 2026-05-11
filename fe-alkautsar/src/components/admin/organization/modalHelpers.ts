import Swal from "sweetalert2";
import type {
  OrganizationContent,
  OrganizationMember,
  OrganizationSection,
} from "../../../data/organizationContent";
import { organizationIconOptions } from "./helpers";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const getModalValue = (id: string) =>
  (
    document.getElementById(id) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null
  )?.value.trim() ?? "";

const popupClass = {
  popup: "student-swal-popup",
  confirmButton: "student-swal-confirm",
  cancelButton: "student-swal-cancel",
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });

const setupImagePreview = (fileInputId: string, previewId: string) => {
  const fileInput = document.getElementById(fileInputId) as HTMLInputElement | null;
  const preview = document.getElementById(previewId) as HTMLImageElement | null;

  if (!fileInput || !preview) return;

  fileInput.addEventListener("change", () => {
    const file = fileInput.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    preview.src = objectUrl;
  });
};

const createIconOptionsHtml = (selectedIcon: string) =>
  organizationIconOptions
    .map(
      (option) =>
        `<option value="${escapeHtml(option.value)}" ${
          option.value === selectedIcon ? "selected" : ""
        }>${escapeHtml(option.label)} (${escapeHtml(option.value)})</option>`,
    )
    .join("");

export const openOrganizationMetaModal = async (
  content: OrganizationContent,
): Promise<Pick<OrganizationContent, "title" | "subtitle"> | null> => {
  const result = await Swal.fire({
    title: "Edit informasi halaman",
    html: `
      <div class="student-modal-form">
        <div class="student-modal-grid">
          <label class="student-modal-field">
            <span>Judul</span>
            <input id="swal-org-title" class="swal2-input student-modal-input" value="${escapeHtml(content.title)}" placeholder="Struktur Organisasi" />
          </label>
          <label class="student-modal-field">
            <span>Subjudul</span>
            <input id="swal-org-subtitle" class="swal2-input student-modal-input" value="${escapeHtml(content.subtitle)}" placeholder="Pondok Pesantren Al-Kautsar" />
          </label>
        </div>
      </div>
    `,
    width: 760,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    customClass: popupClass,
    buttonsStyling: false,
    preConfirm: () => {
      const title = getModalValue("swal-org-title");
      const subtitle = getModalValue("swal-org-subtitle");

      if (!title || !subtitle) {
        Swal.showValidationMessage("Judul dan subjudul wajib diisi.");
        return;
      }

      return { title, subtitle };
    },
  });

  return result.isConfirmed ? result.value : null;
};

export const openOrganizationMemberModal = async (
  title: string,
  member: OrganizationMember,
): Promise<OrganizationMember | null> => {
  const result = await Swal.fire({
    title,
    html: `
      <div class="student-modal-form">
        <div class="student-modal-grid">
          <label class="student-modal-field">
            <span>Nama</span>
            <input id="swal-org-name" class="swal2-input student-modal-input" value="${escapeHtml(member.name)}" placeholder="Nama pengurus" />
          </label>
          <label class="student-modal-field">
            <span>Jabatan</span>
            <input id="swal-org-position" class="swal2-input student-modal-input" value="${escapeHtml(member.position)}" placeholder="Jabatan" />
          </label>
          <label class="student-modal-field student-modal-field--full">
            <span>Foto</span>
            <div class="organization-upload-field">
              <img id="swal-org-img-preview" src="${escapeHtml(member.img)}" alt="Preview foto" class="organization-upload-preview" />
              <input id="swal-org-img" type="file" accept="image/*" class="swal2-file organization-upload-input" />
              <small>Pilih gambar dari perangkat. Kalau tidak diganti, foto lama tetap dipakai.</small>
            </div>
          </label>
          <label class="student-modal-field">
            <span>Pendidikan</span>
            <input id="swal-org-education" class="swal2-input student-modal-input" value="${escapeHtml(member.education)}" placeholder="Riwayat pendidikan" />
          </label>
          <label class="student-modal-field">
            <span>Masa pengabdian</span>
            <input id="swal-org-years" class="swal2-input student-modal-input" value="${escapeHtml(member.years)}" placeholder="Contoh: 5 Tahun" />
          </label>
          <label class="student-modal-field student-modal-field--full">
            <span>Bio</span>
            <textarea id="swal-org-bio" class="swal2-textarea student-modal-textarea" placeholder="Deskripsi singkat">${escapeHtml(member.bio)}</textarea>
          </label>
        </div>
      </div>
    `,
    width: 860,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    customClass: popupClass,
    buttonsStyling: false,
    didOpen: () => {
      setupImagePreview("swal-org-img", "swal-org-img-preview");
    },
    preConfirm: async () => {
      const fileInput = document.getElementById("swal-org-img") as HTMLInputElement | null;
      const selectedFile = fileInput?.files?.[0];

      const nextMember: OrganizationMember = {
        ...member,
        name: getModalValue("swal-org-name"),
        position: getModalValue("swal-org-position"),
        img: selectedFile ? await fileToDataUrl(selectedFile) : member.img,
        education: getModalValue("swal-org-education"),
        years: getModalValue("swal-org-years"),
        bio: getModalValue("swal-org-bio"),
      };

      if (!nextMember.name || !nextMember.position) {
        Swal.showValidationMessage("Nama dan jabatan wajib diisi.");
        return;
      }

      return nextMember;
    },
  });

  return result.isConfirmed ? result.value : null;
};

export const openOrganizationSectionModal = async (
  section: OrganizationSection,
): Promise<OrganizationSection | null> => {
  const result = await Swal.fire({
    title: "Edit bagian organisasi",
    html: `
      <div class="student-modal-form">
        <div class="student-modal-grid">
          <label class="student-modal-field">
            <span>Nama bagian</span>
            <input id="swal-org-section-name" class="swal2-input student-modal-input" value="${escapeHtml(section.section)}" placeholder="Contoh: Akademik" />
          </label>
          <label class="student-modal-field">
            <span>Icon Bootstrap</span>
            <select id="swal-org-section-icon" class="swal2-select student-modal-select">
              ${createIconOptionsHtml(section.icon)}
            </select>
          </label>
        </div>
      </div>
    `,
    width: 760,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    customClass: popupClass,
    buttonsStyling: false,
    preConfirm: () => {
      const sectionName = getModalValue("swal-org-section-name");
      const icon = getModalValue("swal-org-section-icon") || "bi-diagram-3-fill";

      if (!sectionName) {
        Swal.showValidationMessage("Nama bagian wajib diisi.");
        return;
      }

      return {
        ...section,
        section: sectionName,
        icon,
      };
    },
  });

  return result.isConfirmed ? result.value : null;
};

export const confirmOrganizationDelete = async (message: string) => {
  const result = await Swal.fire({
    title: "Hapus data ini?",
    text: message,
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

  return result.isConfirmed;
};
