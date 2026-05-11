import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  createStudent,
  deleteStudent,
  exportStudentsExcel,
  getStudentMeta,
  getStudents,
  importStudentsExcel,
  updateStudent,
} from "../../../services/api";
import type {
  StudentFormState,
  StudentGender,
  StudentLocationOption,
  StudentLocationType,
  StudentMeta,
  StudentRecord,
} from "./types";

const genderOptions: Array<StudentGender | "Semua"> = [
  "Semua",
  "Laki-laki",
  "Perempuan",
];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const createEmptyStudentForm = (
  locations: StudentLocationOption[],
): StudentFormState => {
  const defaultLocation = locations[0];

  return {
    nis: "",
    name: "",
    gender: "Laki-laki",
    placeOfBirth: "",
    birthDate: "",
    status: "active",
    classId: undefined,
    className: "",
    centerId:
      defaultLocation?.type === "Pusat" ? defaultLocation.id : undefined,
    centerName: defaultLocation?.type === "Pusat" ? defaultLocation.name : "",
    branchId:
      defaultLocation?.type === "Cabang" ? defaultLocation.id : undefined,
    branchName: defaultLocation?.type === "Cabang" ? defaultLocation.name : "",
    locationName: defaultLocation?.name ?? "",
    locationType: defaultLocation?.type ?? "Pusat",
    guardianName: "",
    phone: "",
    address: "",
  };
};

const getModalValue = (id: string) =>
  (
    document.getElementById(id) as
      | HTMLInputElement
      | HTMLSelectElement
      | HTMLTextAreaElement
      | null
  )?.value.trim() ?? "";

const createLocationOptionsHtml = (
  items: StudentLocationOption[],
  selectedId?: string,
) =>
  items
    .map(
      (item) =>
        `<option value="${escapeHtml(item.id)}" ${item.id === selectedId ? "selected" : ""}>${escapeHtml(item.type)} - ${escapeHtml(item.name)}</option>`,
    )
    .join("");

const createLocationTypeOptionsHtml = (selectedType: StudentLocationType) => `
  <option value="Pusat" ${selectedType === "Pusat" ? "selected" : ""}>Pusat</option>
  <option value="Cabang" ${selectedType === "Cabang" ? "selected" : ""}>Cabang</option>
`;

const studentModalHtml = (
  student: StudentFormState,
  locations: StudentLocationOption[],
) => `
  <div class="student-modal-form">
    <div class="student-modal-grid">
      <label class="student-modal-field">
        <span>NIS</span>
        <input id="swal-student-nis" class="swal2-input student-modal-input" value="${escapeHtml(student.nis)}" placeholder="Contoh: 2026004" />
      </label>
      <label class="student-modal-field">
        <span>Nama siswa</span>
        <input id="swal-student-name" class="swal2-input student-modal-input" value="${escapeHtml(student.name)}" placeholder="Nama lengkap siswa" />
      </label>
      <label class="student-modal-field">
        <span>Jenis kelamin</span>
        <select id="swal-student-gender" class="swal2-select student-modal-select">
          <option value="Laki-laki" ${student.gender === "Laki-laki" ? "selected" : ""}>Laki-laki</option>
          <option value="Perempuan" ${student.gender === "Perempuan" ? "selected" : ""}>Perempuan</option>
        </select>
      </label>
      <label class="student-modal-field">
        <span>Kelas</span>
        <input id="swal-student-class-name" class="swal2-input student-modal-input" value="${escapeHtml(student.className)}" placeholder="Contoh: Kelas 3B" />
      </label>
      <label class="student-modal-field">
        <span>Tempat lahir</span>
        <input id="swal-student-place-of-birth" class="swal2-input student-modal-input" value="${escapeHtml(student.placeOfBirth)}" placeholder="Contoh: Jakarta" />
      </label>
      <label class="student-modal-field">
        <span>Tanggal lahir</span>
        <input id="swal-student-birth-date" type="date" class="swal2-input student-modal-input" value="${escapeHtml(student.birthDate)}" />
      </label>
      <label class="student-modal-field">
        <span>Status</span>
        <input id="swal-student-status" class="swal2-input student-modal-input" value="${escapeHtml(student.status)}" placeholder="active" />
      </label>
      <label class="student-modal-field">
        <span>Pusat / Cabang</span>
        ${
          locations.length
            ? `<select id="swal-student-location" class="swal2-select student-modal-select">
                ${createLocationOptionsHtml(locations, student.locationType === "Cabang" ? student.branchId : student.centerId)}
              </select>`
            : `<div class="student-modal-grid student-modal-grid--nested">
                <select id="swal-student-location-type" class="swal2-select student-modal-select">
                  ${createLocationTypeOptionsHtml(student.locationType)}
                </select>
                <input id="swal-student-location-name" class="swal2-input student-modal-input" value="${escapeHtml(student.locationName)}" placeholder="Nama pusat atau cabang" />
              </div>`
        }
      </label>
      <label class="student-modal-field">
        <span>Nama wali</span>
        <input id="swal-student-guardian-name" class="swal2-input student-modal-input" value="${escapeHtml(student.guardianName)}" placeholder="Nama wali / orang tua" />
      </label>
      <label class="student-modal-field">
        <span>No. telepon</span>
        <input id="swal-student-phone" class="swal2-input student-modal-input" value="${escapeHtml(student.phone)}" placeholder="08xxxxxxxxxx" />
      </label>
      <label class="student-modal-field student-modal-field--full">
        <span>Alamat</span>
        <textarea id="swal-student-address" class="swal2-textarea student-modal-textarea" placeholder="Alamat siswa">${escapeHtml(student.address)}</textarea>
      </label>
    </div>
  </div>
`;

const StudentManager = () => {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [meta, setMeta] = useState<StudentMeta>({ classes: [], locations: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<StudentGender | "Semua">(
    "Semua",
  );
  const [locationTypeFilter, setLocationTypeFilter] = useState<
    StudentLocationType | "Semua"
  >("Semua");
  const [classFilter, setClassFilter] = useState("Semua");

  useEffect(() => {
    const loadStudentData = async () => {
      setLoading(true);

      try {
        const [studentItems, metaItems] = await Promise.all([
          getStudents(),
          getStudentMeta(),
        ]);
        setStudents(studentItems);
        setMeta(metaItems);
      } catch (error) {
        await Swal.fire({
          title: "Gagal memuat data siswa",
          text:
            error instanceof Error
              ? error.message
              : "Terjadi kesalahan saat memuat data siswa.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: { confirmButton: "student-swal-confirm" },
          buttonsStyling: false,
        });
      } finally {
        setLoading(false);
      }
    };

    void loadStudentData();
  }, []);

  const classOptions = useMemo(() => {
    const fromStudents = students
      .map((student) => student.className)
      .filter(Boolean);
    return ["Semua", ...new Set(fromStudents)];
  }, [students]);

  const filteredStudents = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesKeyword =
        !keyword ||
        [
          student.name,
          student.nis,
          student.className,
          student.locationName,
          student.guardianName,
          student.phone,
          student.address,
        ].some((value) => value.toLowerCase().includes(keyword));

      const matchesGender =
        genderFilter === "Semua" || student.gender === genderFilter;
      const matchesLocationType =
        locationTypeFilter === "Semua" ||
        student.locationType === locationTypeFilter;
      const matchesClass =
        classFilter === "Semua" || student.className === classFilter;

      return (
        matchesKeyword && matchesGender && matchesLocationType && matchesClass
      );
    });
  }, [classFilter, genderFilter, locationTypeFilter, search, students]);

  const totalMale = students.filter(
    (student) => student.gender === "Laki-laki",
  ).length;
  const totalFemale = students.filter(
    (student) => student.gender === "Perempuan",
  ).length;
  const totalPusat = students.filter(
    (student) => student.locationType === "Pusat",
  ).length;
  const totalCabang = students.filter(
    (student) => student.locationType === "Cabang",
  ).length;

  const openStudentModal = async (
    mode: "create" | "edit",
    initialStudent: StudentFormState,
    editingId?: string,
  ) => {
    const result = await Swal.fire<StudentFormState>({
      title: mode === "create" ? "Tambah siswa baru" : "Edit data siswa",
      html: studentModalHtml(initialStudent, meta.locations),
      width: 900,
      focusConfirm: false,
      confirmButtonText: mode === "create" ? "Simpan Data" : "Update Data",
      cancelButtonText: "Batal",
      showCancelButton: true,
      customClass: {
        popup: "student-swal-popup",
        confirmButton: "student-swal-confirm",
        cancelButton: "student-swal-cancel",
      },
      buttonsStyling: false,
      preConfirm: () => {
        const locationId = meta.locations.length
          ? getModalValue("swal-student-location")
          : "";
        const selectedLocation = meta.locations.find(
          (item) => item.id === locationId,
        );
        console.log("locationId:", locationId);
        console.log("meta.locations:", meta.locations);
        const manualLocationName = getModalValue("swal-student-location-name");
        const manualLocationType = getModalValue(
          "swal-student-location-type",
        ) as StudentLocationType;
        const className = getModalValue("swal-student-class-name");
        const matchedClass = meta.classes.find(
          (item) => item.name.toLowerCase() === className.toLowerCase(),
        );

        const nextStudent: StudentFormState = {
          nis: getModalValue("swal-student-nis"),
          name: getModalValue("swal-student-name"),
          gender: getModalValue("swal-student-gender") as StudentGender,
          placeOfBirth: getModalValue("swal-student-place-of-birth"),
          birthDate: getModalValue("swal-student-birth-date"),
          status: getModalValue("swal-student-status") || "active",
          classId: matchedClass?.id,
          className,
          centerId:
            selectedLocation?.type === "Pusat"
              ? selectedLocation.id
              : initialStudent.centerId,
          centerName:
            selectedLocation?.type === "Pusat"
              ? selectedLocation.name
              : initialStudent.centerName,
          branchId:
            selectedLocation?.type === "Cabang"
              ? selectedLocation.id
              : initialStudent.branchId,
          branchName:
            selectedLocation?.type === "Cabang"
              ? selectedLocation.name
              : initialStudent.branchName,
          locationName: selectedLocation?.name ?? manualLocationName,
          locationType:
            selectedLocation?.type ?? (manualLocationType || "Pusat"),
          guardianName: getModalValue("swal-student-guardian-name"),
          phone: getModalValue("swal-student-phone"),
          address: getModalValue("swal-student-address"),
        };

        if (!nextStudent.nis || !nextStudent.name || !nextStudent.className) {
          Swal.showValidationMessage("NIS, nama siswa, dan kelas wajib diisi.");
          return;
        }

        if (!nextStudent.locationName) {
          Swal.showValidationMessage("Pilih pusat atau cabang siswa.");
          return;
        }

        const duplicateNis = students.some(
          (student) =>
            student.nis === nextStudent.nis && student.id !== editingId,
        );

        if (duplicateNis) {
          Swal.showValidationMessage("NIS sudah dipakai siswa lain.");
          return;
        }

        return nextStudent;
      },
    });

    if (!result.isConfirmed || !result.value) return;
    const formData = result.value;

    try {
      if (mode === "create") {
        const created = await createStudent(formData);
        setStudents((current) => [created, ...current]);
        await Swal.fire({
          title: "Berhasil",
          text: "Data siswa berhasil ditambahkan ke database.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: { confirmButton: "student-swal-confirm" },
          buttonsStyling: false,
        });
        return;
      }

      if (!editingId) return;
      const updated = await updateStudent(editingId, formData);
      setStudents((current) =>
        current.map((student) =>
          student.id === editingId ? updated : student,
        ),
      );

      await Swal.fire({
        title: "Berhasil",
        text: "Data siswa berhasil diperbarui di database.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    } catch (error) {
      await Swal.fire({
        title: "Gagal menyimpan",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menyimpan data siswa.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    }
  };

  const handleCreate = async () => {
    await openStudentModal("create", createEmptyStudentForm(meta.locations));
  };

  const handleEdit = async (student: StudentRecord) => {
    await openStudentModal(
      "edit",
      {
        nis: student.nis,
        name: student.name,
        gender: student.gender,
        placeOfBirth: student.placeOfBirth,
        birthDate: student.birthDate,
        status: student.status,
        classId: student.classId,
        className: student.className,
        centerId: student.centerId,
        centerName: student.centerName,
        branchId: student.branchId,
        branchName: student.branchName,
        locationName: student.locationName,
        locationType: student.locationType,
        guardianName: student.guardianName,
        phone: student.phone,
        address: student.address,
      },
      student.id,
    );
  };

  const handleDelete = async (student: StudentRecord) => {
    const result = await Swal.fire({
      title: "Hapus data siswa?",
      text: `Data ${student.name} akan dihapus dari database.`,
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
      await deleteStudent(student.id);
      setStudents((current) =>
        current.filter((item) => item.id !== student.id),
      );

      await Swal.fire({
        title: "Terhapus",
        text: "Data siswa berhasil dihapus dari database.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    } catch (error) {
      await Swal.fire({
        title: "Gagal menghapus",
        text:
          error instanceof Error
            ? error.message
            : "Gagal menghapus data siswa.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    }
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importStudentsExcel(file);
      setStudents(imported);
      await Swal.fire({
        title: "Import berhasil",
        text: `${imported.length} data siswa berhasil diimpor dari database.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    } catch (error) {
      await Swal.fire({
        title: "Import gagal",
        text: error instanceof Error ? error.message : "Import data gagal.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    } finally {
      event.target.value = "";
    }
  };

  const handleExport = async () => {
    try {
      await exportStudentsExcel();
    } catch (error) {
      await Swal.fire({
        title: "Export gagal",
        text: error instanceof Error ? error.message : "Export data gagal.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    }
  };

  return (
    <section className="student-manager">
      <div className="student-manager__hero">
        <div>
          <div className="admin-badge">Data Siswa</div>
          <h2>Kelola data siswa pusat dan cabang</h2>
          <p>
            Form siswa sudah disesuaikan ke schema DB: `guardianName`,
            `placeOfBirth`, `birthDate`, `status`, `centerId`, `branchId`, dan
            `classId`.
          </p>
        </div>

        <div className="student-toolbar">
          <button
            type="button"
            className="admin-button"
            onClick={handleCreate}
            disabled={loading}
          >
            Tambah Baru
          </button>
          <button
            type="button"
            className="admin-button"
            onClick={handleExport}
            disabled={loading}
          >
            Export Excel
          </button>
          <label className="student-import-button">
            Import Excel
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImport}
            />
          </label>
        </div>
      </div>

      <section className="student-stats">
        <article className="student-stat-card">
          <span>Total Siswa</span>
          <strong>{students.length}</strong>
          <p>Semua data aktif</p>
        </article>
        <article className="student-stat-card">
          <span>Laki-laki</span>
          <strong>{totalMale}</strong>
          <p>Data siswa cowok</p>
        </article>
        <article className="student-stat-card">
          <span>Perempuan</span>
          <strong>{totalFemale}</strong>
          <p>Data siswa cewek</p>
        </article>
        <article className="student-stat-card">
          <span>Pusat / Cabang</span>
          <strong>
            {totalPusat} / {totalCabang}
          </strong>
          <p>Sebaran lokasi sekolah</p>
        </article>
      </section>

      <section className="student-layout">
        <article className="student-list-card">
          <div className="admin-card__header">
            <div>
              <span className="admin-card__eyebrow">Daftar</span>
              <h3>Data siswa terdaftar</h3>
            </div>
            <strong>{filteredStudents.length} siswa</strong>
          </div>

          <div className="student-filters">
            <label className="content-field content-field--full">
              <span>Cari siswa</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama, NIS, kelas, wali, atau alamat"
              />
            </label>

            <label className="content-field">
              <span>Filter kelamin</span>
              <select
                value={genderFilter}
                onChange={(event) =>
                  setGenderFilter(event.target.value as StudentGender | "Semua")
                }
              >
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="content-field">
              <span>Filter pusat/cabang</span>
              <select
                value={locationTypeFilter}
                onChange={(event) =>
                  setLocationTypeFilter(
                    event.target.value as StudentLocationType | "Semua",
                  )
                }
              >
                <option value="Semua">Semua</option>
                <option value="Pusat">Pusat</option>
                <option value="Cabang">Cabang</option>
              </select>
            </label>

            <label className="content-field">
              <span>Filter kelas</span>
              <select
                value={classFilter}
                onChange={(event) => setClassFilter(event.target.value)}
              >
                {classOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="student-table-wrap">
            <table className="student-table">
              <thead>
                <tr>
                  <th>NIS</th>
                  <th>Nama</th>
                  <th>Kelamin</th>
                  <th>Kelas</th>
                  <th>Lokasi</th>
                  <th>Wali</th>
                  <th>Telepon</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="student-table__empty">
                      Memuat data siswa...
                    </td>
                  </tr>
                ) : filteredStudents.length ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.nis}</td>
                      <td>
                        <strong>{student.name}</strong>
                        <p>{student.address || "-"}</p>
                      </td>
                      <td>{student.gender}</td>
                      <td>{student.className}</td>
                      <td>
                        {student.locationType} - {student.locationName || "-"}
                      </td>
                      <td>{student.guardianName || "-"}</td>
                      <td>{student.phone || "-"}</td>
                      <td>
                        <div className="student-table__actions">
                          <button
                            type="button"
                            className="content-tabs__item"
                            onClick={() => void handleEdit(student)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="content-item-card__delete"
                            onClick={() => void handleDelete(student)}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="student-table__empty">
                      Belum ada data yang cocok dengan filter saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </section>
  );
};

export default StudentManager;
