import type { HomeContent } from "../../../data/homeContent";

export type ContentSection = keyof HomeContent;

export const contentTabs: Array<{ key: ContentSection; label: string }> = [
  { key: "banner", label: "Banner" },
  { key: "promotions", label: "Iklan / Promo" },
  { key: "gallery", label: "Gallery" },
  { key: "activities", label: "Kegiatan" },
  { key: "achievements", label: "Prestasi" },
  { key: "about", label: "Tentang" },
  { key: "extracurriculars", label: "Ekstrakurikuler" },
];
