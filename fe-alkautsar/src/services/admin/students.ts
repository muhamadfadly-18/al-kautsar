import type {
  StudentClassOption,
  StudentFormState,
  StudentGender,
  StudentLocationOption,
  StudentLocationType,
  StudentMeta,
  StudentRecord,
} from "../../components/admin/students/types";
import {
  api,
  getNestedRecord,
  isRecord,
  pickString,
  unwrapData,
} from "../shared/client";

const studentsEndpoint = "/api/students";

const normalizeStudentGender = (value: unknown): StudentGender => {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (["p", "pr", "perempuan", "female", "wanita"].includes(normalized)) {
    return "Perempuan";
  }

  return "Laki-laki";
};

const normalizeStudentLocationType = (value: unknown): StudentLocationType => {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (["branch", "cabang"].includes(normalized)) {
    return "Cabang";
  }

  return "Pusat";
};

const normalizeStudentLocationOption = (
  value: unknown,
  type: StudentLocationType,
  index: number,
): StudentLocationOption => {
  const raw = isRecord(value) ? value : {};

  return {
    id: pickString(raw.id ?? raw._id ?? `${type.toLowerCase()}-${index + 1}`),
    name: pickString(
      raw.name ?? raw.title ?? raw.label ?? `${type} ${index + 1}`,
    ),
    type,
  };
};

const normalizeStudentClassOption = (
  value: unknown,
  index: number,
): StudentClassOption => {
  const raw = isRecord(value) ? value : {};

  return {
    id: pickString(raw.id ?? raw._id ?? `class-${index + 1}`),
    name: pickString(
      raw.name ?? raw.title ?? raw.label ?? `Kelas ${index + 1}`,
    ),
  };
};

const normalizeStudentMeta = (value: unknown): StudentMeta => {
  const raw = isRecord(value) ? value : {};
  const centers = Array.isArray(raw.centers)
    ? raw.centers.map((item, index) =>
        normalizeStudentLocationOption(item, "Pusat", index),
      )
    : [];
  const branches = Array.isArray(raw.branches)
    ? raw.branches.map((item, index) =>
        normalizeStudentLocationOption(item, "Cabang", index),
      )
    : [];
  const classes = Array.isArray(raw.classes)
    ? raw.classes.map(normalizeStudentClassOption)
    : [];

  return {
    classes,
    locations: [...centers, ...branches],
  };
};

const normalizeStudent = (value: unknown, index: number): StudentRecord => {
  const raw = isRecord(value) ? value : {};
  const classRecord =
    getNestedRecord(raw, "class") ?? getNestedRecord(raw, "kelas");
  const centerRecord = getNestedRecord(raw, "center");
  const branchRecord = getNestedRecord(raw, "branch");

  const classId = pickString(
    raw.classId ?? raw.class_id ?? classRecord?.id ?? classRecord?._id,
  );
  const className = pickString(
    raw.className ??
      raw.class_name ??
      raw.kelas ??
      classRecord?.name ??
      classRecord?.title,
  );
  const centerId = pickString(
    raw.centerId ?? raw.center_id ?? centerRecord?.id ?? centerRecord?._id,
  );
  const centerName = pickString(
    raw.centerName ??
      raw.center_name ??
      centerRecord?.name ??
      centerRecord?.title,
  );
  const branchId = pickString(
    raw.branchId ?? raw.branch_id ?? branchRecord?.id ?? branchRecord?._id,
  );
  const branchName = pickString(
    raw.branchName ??
      raw.branch_name ??
      branchRecord?.name ??
      branchRecord?.title,
  );
  const hasBranch = Boolean(branchId || branchName);

  return {
    id: pickString(raw.id ?? raw._id ?? `student-${index + 1}`),
    nis: pickString(raw.nis),
    name: pickString(raw.name),
    gender: normalizeStudentGender(raw.gender),
    placeOfBirth: pickString(raw.placeOfBirth ?? raw.place_of_birth),
    birthDate: pickString(raw.birthDate ?? raw.birth_date),
    status: pickString(raw.status ?? "active"),
    classId: classId || undefined,
    className,
    centerId: centerId || undefined,
    centerName,
    branchId: branchId || undefined,
    branchName,
    locationName: hasBranch ? branchName : centerName,
    locationType: hasBranch
      ? "Cabang"
      : normalizeStudentLocationType(
          raw.locationType ?? raw.location_type ?? raw.type,
        ),
    guardianName: pickString(
      raw.guardianName ??
        raw.guardian_name ??
        raw.parentName ??
        raw.parent_name,
    ),
    phone: pickString(raw.phone),
    address: pickString(raw.address),
  };
};

const toStudentPayload = (student: StudentFormState) => {
  const payload: Record<string, unknown> = {
    nis: student.nis,
    name: student.name,
    gender: student.gender,
    placeOfBirth: student.placeOfBirth || null,
    birthDate: student.birthDate || null,
    address: student.address || null,
    phone: student.phone || null,
    guardianName: student.guardianName || null,
    status: student.status || "active",
    className: student.className,
    centerName: student.centerName,
    branchName: student.branchName,
  };

  if (student.classId) {
    payload.classId = Number(student.classId);
  }

  if (student.centerId) {
    payload.centerId = Number(student.centerId);
  }

  if (student.branchId) {
    payload.branchId = Number(student.branchId);
  }

  return payload;
};

export const getStudentMeta = async (): Promise<StudentMeta> => {
  const response = await api.get(`${studentsEndpoint}/meta`);
  return normalizeStudentMeta(unwrapData<unknown>(response.data));
};

export const getStudents = async (): Promise<StudentRecord[]> => {
  const response = await api.get(studentsEndpoint);
  const payload = unwrapData<unknown>(response.data);

  if (!Array.isArray(payload)) return [];

  return payload.map(normalizeStudent);
};

export const createStudent = async (
  payload: StudentFormState,
): Promise<StudentRecord> => {
  const response = await api.post(studentsEndpoint, toStudentPayload(payload));
  return normalizeStudent(unwrapData<unknown>(response.data), 0);
};

export const updateStudent = async (
  id: string,
  payload: StudentFormState,
): Promise<StudentRecord> => {
  const response = await api.put(
    `${studentsEndpoint}/${id}`,
    toStudentPayload(payload),
  );
  return normalizeStudent(unwrapData<unknown>(response.data), 0);
};

export const deleteStudent = async (id: string): Promise<void> => {
  await api.delete(`${studentsEndpoint}/${id}`);
};

export const importStudentsExcel = async (
  file: File,
): Promise<StudentRecord[]> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `${studentsEndpoint}/import/excel`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  const payload = unwrapData<unknown>(response.data);
  if (!Array.isArray(payload)) {
    return getStudents();
  }

  return payload.map(normalizeStudent);
};

export const exportStudentsExcel = async (): Promise<void> => {
  const response = await api.get(`${studentsEndpoint}/export/excel`, {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type:
      response.headers["content-type"] ||
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "data-siswa.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
