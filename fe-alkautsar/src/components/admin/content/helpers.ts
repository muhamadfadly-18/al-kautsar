import type {
  AchievementItem,
  ActivityItem,
  ExtracurricularGroup,
  GalleryItem,
  PromoItem,
} from "../../../data/homeContent";

export const createPromo = (): PromoItem => ({
  id: `promo-${Date.now()}`,
  title: "",
  tag: "",
  text: "",
  buttonText: "Lihat Detail",
  detailText: "Detail Info",
  image: "",
  accent: "#0f766e",
});

export const createGallery = (): GalleryItem => ({
  id: `gallery-${Date.now()}`,
  title: "",
  category: "",
  image: "",
  caption: "",
});

export const createActivity = (): ActivityItem => ({
  id: `activity-${Date.now()}`,
  title: "",
  category: "",
  date: "",
  image: "",
  desc: "",
});

export const createAchievement = (): AchievementItem => ({
  id: `achievement-${Date.now()}`,
  title: "",
  year: "",
  category: "",
  img: "",
  desc: "",
});

export const createExtracurricular = (): ExtracurricularGroup => ({
  id: `ekskul-${Date.now()}`,
  title: "",
  icon: "bi-stars",
  gradient: "linear-gradient(135deg, #0f766e 0%, #2563eb 100%)",
  items: [],
});
