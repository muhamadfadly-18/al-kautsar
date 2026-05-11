import { api, isRecord, pickString, unwrapData } from "../shared/client";

const ppdbEndpoint = "/api/ppdb";

export type PpdbRecord = {
  id: string;
  registrationCode: string;
  namaSiswa: string;
  jenisKelamin: string;
  tempatLahir: string;
  tanggalLahir: string;
  unitTujuan: string;
  asalSekolah: string;
  namaOrangTua: string;
  nomorWhatsapp: string;
  email: string;
  alamat: string;
  catatan: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type PpdbSummary = {
  total: number;
  baru: number;
  hariIni: number;
  mingguIni: number;
};

export const getLatestPpdbSeenAt = (
  items: PpdbRecord[],
  fallback = new Date().toISOString(),
) => {
  const latestTimestamp = items.reduce((result, item) => {
    const value = item.createdAt ? new Date(item.createdAt).getTime() : 0;
    return Number.isFinite(value) ? Math.max(result, value) : result;
  }, new Date(fallback).getTime());

  return new Date(latestTimestamp).toISOString();
};

const normalizePpdb = (value: unknown, index: number): PpdbRecord => {
  const raw = isRecord(value) ? value : {};

  return {
    id: pickString(
      raw.id ?? raw._id ?? raw.registrationCode ?? `ppdb-${index + 1}`,
    ),
    registrationCode: pickString(
      raw.registrationCode ?? raw.registration_code ?? `PPDB-${index + 1}`,
    ),
    namaSiswa: pickString(raw.namaSiswa ?? raw.nama_siswa ?? raw.name),
    jenisKelamin: pickString(
      raw.jenisKelamin ?? raw.jenis_kelamin ?? raw.gender,
    ),
    tempatLahir: pickString(
      raw.tempatLahir ?? raw.tempat_lahir ?? raw.placeOfBirth,
    ),
    tanggalLahir: pickString(
      raw.tanggalLahir ?? raw.tanggal_lahir ?? raw.birthDate,
    ),
    unitTujuan: pickString(raw.unitTujuan ?? raw.unit_tujuan ?? raw.unit),
    asalSekolah: pickString(raw.asalSekolah ?? raw.asal_sekolah ?? raw.school),
    namaOrangTua: pickString(
      raw.namaOrangTua ??
        raw.nama_orang_tua ??
        raw.guardianName ??
        raw.parentName,
    ),
    nomorWhatsapp: pickString(
      raw.nomorWhatsapp ?? raw.nomor_whatsapp ?? raw.phone ?? raw.whatsapp,
    ),
    email: pickString(raw.email),
    alamat: pickString(raw.alamat ?? raw.address),
    catatan: pickString(raw.catatan ?? raw.notes),
    status: pickString(raw.status ?? "Baru"),
    createdAt: pickString(raw.createdAt ?? raw.created_at),
    updatedAt: pickString(raw.updatedAt ?? raw.updated_at),
  };
};

const isSameDay = (left: Date, right: Date) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const isWithinDays = (date: Date, days: number) => {
  const now = Date.now();
  const diff = now - date.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
};

export const getPpdbRegistrations = async (): Promise<PpdbRecord[]> => {
  const response = await api.get(ppdbEndpoint);
  const payload = unwrapData<unknown>(response.data);

  if (!Array.isArray(payload)) return [];

  return payload.map(normalizePpdb);
};

export const getPpdbSummary = async (
  lastSeenAt?: string | null,
): Promise<{ items: PpdbRecord[]; summary: PpdbSummary }> => {
  const items = await getPpdbRegistrations();
  const sortedItems = [...items].sort((left, right) => {
    const leftTime = new Date(left.createdAt || 0).getTime();
    const rightTime = new Date(right.createdAt || 0).getTime();
    return rightTime - leftTime;
  });

  const seenTimestamp = lastSeenAt ? new Date(lastSeenAt).getTime() : 0;
  const now = new Date();

  const summary = sortedItems.reduce<PpdbSummary>(
    (result, item) => {
      const createdAt = item.createdAt ? new Date(item.createdAt) : null;
      const createdTime = createdAt?.getTime() ?? 0;

      result.total += 1;

      if (createdAt && Number.isFinite(createdTime)) {
        if (createdTime > seenTimestamp) {
          result.baru += 1;
        }

        if (isSameDay(createdAt, now)) {
          result.hariIni += 1;
        }

        if (isWithinDays(createdAt, 7)) {
          result.mingguIni += 1;
        }
      } else if (!lastSeenAt) {
        result.baru += 1;
      }

      return result;
    },
    {
      total: 0,
      baru: 0,
      hariIni: 0,
      mingguIni: 0,
    },
  );

  return {
    items: sortedItems,
    summary,
  };
};
