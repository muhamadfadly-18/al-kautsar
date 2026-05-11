export type StudentGender = "Laki-laki" | "Perempuan";
export type StudentLocationType = "Pusat" | "Cabang";

export type StudentClassOption = {
  id: string;
  name: string;
};

export type StudentLocationOption = {
  id: string;
  name: string;
  type: StudentLocationType;
};

export type StudentMeta = {
  classes: StudentClassOption[];
  locations: StudentLocationOption[];
};

export type StudentRecord = {
  id: string;
  nis: string;
  name: string;
  gender: StudentGender;
  placeOfBirth: string;
  birthDate: string;
  status: string;
  classId?: string;
  className: string;
  centerId?: string;
  centerName: string;
  branchId?: string;
  branchName: string;
  locationName: string;
  locationType: StudentLocationType;
  guardianName: string;
  phone: string;
  address: string;
};

export type StudentFormState = Omit<StudentRecord, "id">;
