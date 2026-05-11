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

// --- Form & Logic Helpers ---

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
  <div class="student-modal-form text-left">
    <div class="student-modal-grid grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="student-modal-field flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-600">NIS</label>
        <input id="swal-student-nis" class="swal2-input !m-0 !w-full" value="${escapeHtml(student.nis)}" placeholder="Contoh: 2026004" />
      </div>
      <div class="student-modal-field flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-600">Nama Lengkap</label>
        <input id="swal-student-name" class="swal2-input !m-0 !w-full" value="${escapeHtml(student.name)}" placeholder="Nama lengkap siswa" />
      </div>
      <div class="student-modal-field flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-600">Jenis Kelamin</label>
        <select id="swal-student-gender" class="swal2-select !m-0 !w-full">
          <option value="Laki-laki" ${student.gender === "Laki-laki" ? "selected" : ""}>Laki-laki</option>
          <option value="Perempuan" ${student.gender === "Perempuan" ? "selected" : ""}>Perempuan</option>
        </select>
      </div>
      <div class="student-modal-field flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-600">Kelas</label>
        <input id="swal-student-class-name" class="swal2-input !m-0 !w-full" value="${escapeHtml(student.className)}" placeholder="Contoh: Kelas 3B" />
      </div>
      <div class="student-modal-field flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-600">Tempat Lahir</label>
        <input id="swal-student-place-of-birth" class="swal2-input !m-0 !w-full" value="${escapeHtml(student.placeOfBirth)}" placeholder="Contoh: Jakarta" />
      </div>
      <div class="student-modal-field flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-600">Tanggal Lahir</label>
        <input id="swal-student-birth-date" type="date" class="swal2-input !m-0 !w-full" value="${escapeHtml(student.birthDate)}" />
      </div>
      <div class="student-modal-field flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-600">Status</label>
        <input id="swal-student-status" class="swal2-input !m-0 !w-full" value="${escapeHtml(student.status)}" placeholder="active" />
      </div>
      <div class="student-modal-field flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-600">Pusat / Cabang</label>
        ${
          locations.length
            ? `<select id="swal-student-location" class="swal2-select !m-0 !w-full">
                ${createLocationOptionsHtml(locations, student.locationType === "Cabang" ? student.branchId : student.centerId)}
              </select>`
            : `<div class="grid grid-cols-2 gap-2">
                <select id="swal-student-location-type" class="swal2-select !m-0 !w-full">
                  ${createLocationTypeOptionsHtml(student.locationType)}
                </select>
                <input id="swal-student-location-name" class="swal2-input !m-0 !w-full" value="${escapeHtml(student.locationName)}" placeholder="Nama lokasi" />
              </div>`
        }
      </div>
      <div class="student-modal-field flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-600">Nama Wali</label>
        <input id="swal-student-guardian-name" class="swal2-input !m-0 !w-full" value="${escapeHtml(student.guardianName)}" placeholder="Nama wali" />
      </div>
      <div class="student-modal-field flex flex-col gap-1">
        <label class="text-sm font-medium text-slate-600">No. Telepon</label>
        <input id="swal-student-phone" class="swal2-input !m-0 !w-full" value="${escapeHtml(student.phone)}" placeholder="08xxxxxxxxxx" />
      </div>
      <div class="student-modal-field flex flex-col gap-1 md:col-span-2">
        <label class="text-sm font-medium text-slate-600">Alamat</label>
        <textarea id="swal-student-address" class="swal2-textarea !m-0 !w-full" placeholder="Alamat lengkap">${escapeHtml(student.address)}</textarea>
      </div>
    </div>
  </div>
`;

// --- Main Component ---

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
          text: error instanceof Error ? error.message : "Terjadi kesalahan.",
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

  // Stats Logic
  const totalMale = students.filter((s) => s.gender === "Laki-laki").length;
  const totalFemale = students.filter((s) => s.gender === "Perempuan").length;
  const totalPusat = students.filter((s) => s.locationType === "Pusat").length;
  const totalCabang = students.filter((s) => s.locationType === "Cabang").length;

  const openStudentModal = async (
    mode: "create" | "edit",
    initialStudent: StudentFormState,
    editingId?: string,
  ) => {
    const result = await Swal.fire<StudentFormState>({
      title: mode === "create" ? "Tambah Siswa Baru" : "Edit Data Siswa",
      html: studentModalHtml(initialStudent, meta.locations),
      width: 800,
      padding: '2em',
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
        const locationId = meta.locations.length ? getModalValue("swal-student-location") : "";
        const selectedLocation = meta.locations.find((item) => item.id === locationId);
        const manualLocationName = getModalValue("swal-student-location-name");
        const manualLocationType = getModalValue("swal-student-location-type") as StudentLocationType;
        const className = getModalValue("swal-student-class-name");
        const matchedClass = meta.classes.find((item) => item.name.toLowerCase() === className.toLowerCase());

        const nextStudent: StudentFormState = {
          nis: getModalValue("swal-student-nis"),
          name: getModalValue("swal-student-name"),
          gender: getModalValue("swal-student-gender") as StudentGender,
          placeOfBirth: getModalValue("swal-student-place-of-birth"),
          birthDate: getModalValue("swal-student-birth-date"),
          status: getModalValue("swal-student-status") || "active",
          classId: matchedClass?.id,
          className,
          centerId: selectedLocation?.type === "Pusat" ? selectedLocation.id : undefined,
          branchId: selectedLocation?.type === "Cabang" ? selectedLocation.id : undefined,
          centerName: selectedLocation?.type === "Pusat" ? selectedLocation.name : (manualLocationType === "Pusat" ? manualLocationName : ""),
          branchName: selectedLocation?.type === "Cabang" ? selectedLocation.name : (manualLocationType === "Cabang" ? manualLocationName : ""),
          locationName: selectedLocation?.name ?? manualLocationName,
          locationType: selectedLocation?.type ?? (manualLocationType || "Pusat"),
          guardianName: getModalValue("swal-student-guardian-name"),
          phone: getModalValue("swal-student-phone"),
          address: getModalValue("swal-student-address"),
        };

        if (!nextStudent.nis || !nextStudent.name || !nextStudent.className) {
          Swal.showValidationMessage("NIS, Nama, dan Kelas wajib diisi.");
          return;
        }
        if (students.some((s) => s.nis === nextStudent.nis && s.id !== editingId)) {
          Swal.showValidationMessage("NIS sudah terdaftar.");
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
      } else if (editingId) {
        const updated = await updateStudent(editingId, formData);
        setStudents((current) => current.map((s) => (s.id === editingId ? updated : s)));
      }
      await Swal.fire({
        title: "Berhasil",
        text: "Perubahan telah disimpan ke server.",
        icon: "success",
        confirmButtonText: "OK",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    } catch (error) {
      await Swal.fire({
        title: "Gagal menyimpan",
        text: error instanceof Error ? error.message : "Kesalahan server.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    }
  };

  const handleCreate = () => void openStudentModal("create", createEmptyStudentForm(meta.locations));
  const handleEdit = (student: StudentRecord) => void openStudentModal("edit", { ...student }, student.id);

  const handleDelete = async (student: StudentRecord) => {
    const result = await Swal.fire({
      title: "Hapus Data?",
      text: `Anda akan menghapus data ${student.name}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus",
      customClass: { confirmButton: "student-swal-danger", cancelButton: "student-swal-cancel" },
      buttonsStyling: false,
    });
    if (!result.isConfirmed) return;
    try {
      await deleteStudent(student.id);
      setStudents((current) => current.filter((item) => item.id !== student.id));
      await Swal.fire({ title: "Terhapus", icon: "success", confirmButtonText: "OK", customClass: { confirmButton: "student-swal-confirm" }, buttonsStyling: false });
    } catch (error) {
      await Swal.fire({ title: "Gagal", text: "Terjadi kesalahan.", icon: "error", confirmButtonText: "OK", customClass: { confirmButton: "student-swal-confirm" }, buttonsStyling: false });
    }
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importStudentsExcel(file);
      setStudents(imported);
      await Swal.fire({ title: "Import Berhasil", text: `${imported.length} data ditambahkan.`, icon: "success", confirmButtonText: "OK", customClass: { confirmButton: "student-swal-confirm" }, buttonsStyling: false });
    } catch (error) {
      await Swal.fire({ title: "Gagal", icon: "error", confirmButtonText: "OK", customClass: { confirmButton: "student-swal-confirm" }, buttonsStyling: false });
    } finally {
      event.target.value = "";
    }
  };

  const handleExport = async () => {
    try {
      await exportStudentsExcel();
    } catch (error) {
      await Swal.fire({ title: "Export Gagal", icon: "error", confirmButtonText: "OK", customClass: { confirmButton: "student-swal-confirm" }, buttonsStyling: false });
    }
  };

  return (
    <section className="student-manager min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-800">
      {/* Header Area */}
      <div className="student-manager__hero flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div className="max-w-xl">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-blue-600 uppercase bg-blue-100 rounded-full animate-pulse">
            Sistem Manajemen
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Database Siswa <span className="text-blue-600 text-shadow-sm">Master</span>
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed">
            Kelola data registrasi, lokasi sekolah, dan informasi wali murid secara terpusat dengan antarmuka modern.
          </p>
        </div>

        <div className="student-toolbar flex flex-wrap gap-3">
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-200 disabled:opacity-50"
          >
            <span className="text-lg">+</span> Tambah Baru
          </button>
          <button
            onClick={handleExport}
            disabled={loading}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            Export Excel
          </button>
          <label className="cursor-pointer bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-sm">
            Import Excel
            <input type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleImport} />
          </label>
        </div>
      </div>

      {/* Stats Section with Glassmorphism */}
      <section className="student-stats grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Siswa", val: students.length, desc: "Siswa Terdaftar", color: "blue" },
          { label: "Laki-laki", val: totalMale, desc: "Siswa Putra", color: "indigo" },
          { label: "Perempuan", val: totalFemale, desc: "Siswa Putri", color: "pink" },
          { label: "Pusat / Cabang", val: `${totalPusat} / ${totalCabang}`, desc: "Sebaran Lokasi", color: "emerald" }
        ].map((card, idx) => (
          <article key={idx} className="relative group bg-white/70 backdrop-blur-md border border-white/40 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-20 h-20 bg-${card.color}-500/10 rounded-full blur-2xl group-hover:bg-${card.color}-500/20 transition-colors`}></div>
            <span className="block text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">{card.label}</span>
            <strong className="block text-3xl font-black text-slate-900 mb-1">{card.val}</strong>
            <p className="text-slate-400 text-xs font-normal italic italic tracking-wide">{card.desc}</p>
          </article>
        ))}
      </section>

      {/* Filter & Table Area */}
      <section className="student-layout bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden transition-all duration-500">
        <article className="student-list-card">
          <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Daftar Data Siswa</h3>
              <p className="text-sm text-slate-400 font-medium">Ditemukan {filteredStudents.length} siswa sesuai filter</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Search Input Custom Style */}
              <div className="relative group flex-grow md:w-64">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, NIS..."
                  className="w-full bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-2xl px-4 py-2.5 text-sm transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-8 bg-white border-b border-slate-50">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase ml-1">Jenis Kelamin</span>
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {genderOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase ml-1">Tipe Lokasi</span>
              <select
                value={locationTypeFilter}
                onChange={(e) => setLocationTypeFilter(e.target.value as any)}
                className="bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Semua">Semua Tipe</option>
                <option value="Pusat">Pusat</option>
                <option value="Cabang">Cabang</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase ml-1">Kelas</span>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="bg-slate-50 border-none rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {classOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="student-table-wrap overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">NIS</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Identitas Siswa</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Info Kelas</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Penempatan</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Kontak Wali</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-slate-400 font-medium animate-pulse">Sinkronisasi data...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-5 font-mono text-sm text-blue-600 font-semibold">{student.nis}</td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-slate-900 font-bold group-hover:text-blue-700 transition-colors">{student.name}</span>
                          <span className="text-xs text-slate-400 line-clamp-1">{student.address || "Alamat belum diatur"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                          {student.className}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 font-medium italic italic capitalize">{student.gender}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${student.locationType === 'Pusat' ? 'bg-orange-400' : 'bg-emerald-400'}`}></div>
                           <span className="text-sm font-medium text-slate-700">{student.locationName || "-"}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-300 ml-4 uppercase">{student.locationType}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-semibold text-slate-700">{student.guardianName || "-"}</div>
                        <div className="text-xs text-blue-500 font-medium hover:underline cursor-pointer">{student.phone || "-"}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center items-center gap-2">
                          <button
                            onClick={() => void handleEdit(student)}
                            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-blue-600 hover:shadow-sm transition-all"
                            title="Edit Data"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                          <button
                            onClick={() => void handleDelete(student)}
                            className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-red-500 hover:shadow-sm transition-all"
                            title="Hapus Data"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium italic uppercase tracking-widest">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center">
             <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Data Last Sync: {new Date().toLocaleTimeString()}</p>
          </div>
        </article>
      </section>

      {/* Global Style for SweetAlert Modernization */}
      <style>{`
        .student-swal-popup { border-radius: 2rem !important; padding: 2.5rem !important; font-family: inherit !important; }
        .student-swal-confirm { background: #2563eb !important; color: white !important; padding: 0.8rem 2rem !important; border-radius: 1rem !important; font-weight: 700 !important; margin: 0.5rem !important; transition: all 0.2s !important; }
        .student-swal-confirm:hover { background: #1d4ed8 !important; transform: translateY(-2px) !important; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4) !important; }
        .student-swal-cancel { background: #f1f5f9 !important; color: #64748b !important; padding: 0.8rem 2rem !important; border-radius: 1rem !important; font-weight: 700 !important; margin: 0.5rem !important; }
        .student-swal-danger { background: #ef4444 !important; color: white !important; padding: 0.8rem 2rem !important; border-radius: 1rem !important; font-weight: 700 !important; margin: 0.5rem !important; }
        .swal2-title { font-weight: 800 !important; color: #0f172a !important; }
        .swal2-input, .swal2-select, .swal2-textarea { border-radius: 1rem !important; border: 1px solid #e2e8f0 !important; font-size: 0.9rem !important; }
        .swal2-input:focus, .swal2-select:focus, .swal2-textarea:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 4px #dbeafe !important; }
      `}</style>
    </section>
  );
};

export default StudentManager;