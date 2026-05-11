import axios, { AxiosError } from "axios";
import type {
  AboutContent,
  AchievementItem,
  ActivityItem,
  BannerContent,
  ExtracurricularGroup,
  GalleryItem,
  HomeContent,
  PromoItem,
} from "../data/homeContent";
import { defaultHomeContent } from "../data/homeContent";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000",
});

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  delete api.defaults.headers.common.Authorization;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthUser = {
  id?: string | number;
  name?: string;
  email?: string;
  role?: string;
};

export type LoginResult = {
  token: string;
  user?: AuthUser;
  raw: unknown;
};

type ContentSectionKey = keyof HomeContent;

const contentHomeEndpoint = "/api/content/home";

const contentEndpoints: Record<ContentSectionKey, string> = {
  banner: "/api/content/banner",
  promotions: "/api/content/promotions",
  gallery: "/api/content/gallery",
  activities: "/api/content/activities",
  achievements: "/api/content/achievements",
  about: "/api/content/about",
  extracurriculars: "/api/content/extracurriculars",
};
console.log(contentEndpoints)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const unwrapData = <T>(payload: unknown): T => {
  if (isRecord(payload) && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
};

const withAssetBase = (value: string) => {
  if (!value) return value;
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
  if (value.startsWith("/")) return `${api.defaults.baseURL}${value}`;
  return `${api.defaults.baseURL}/assets/${value}`;
};

const normalizeBanner = (value: unknown): BannerContent => {
  const raw = Array.isArray(value) ? value[0] : value;

  if (!isRecord(raw)) {
    return defaultHomeContent.banner;
  }

  return {
    title: String(raw.title ?? defaultHomeContent.banner.title),
    text: String(raw.text ?? raw.description ?? defaultHomeContent.banner.text),
    image: withAssetBase(String(raw.image ?? raw.imageUrl ?? defaultHomeContent.banner.image)),
    primaryLabel: String(raw.primaryLabel ?? raw.primary_button_label ?? defaultHomeContent.banner.primaryLabel),
    primaryHref: String(raw.primaryHref ?? raw.primary_button_href ?? defaultHomeContent.banner.primaryHref),
    secondaryLabel: String(raw.secondaryLabel ?? raw.secondary_button_label ?? defaultHomeContent.banner.secondaryLabel),
    secondaryHref: String(raw.secondaryHref ?? raw.secondary_button_href ?? defaultHomeContent.banner.secondaryHref),
  };
};

const normalizePromotions = (value: unknown): PromoItem[] => {
  if (!Array.isArray(value)) return defaultHomeContent.promotions;

  return value.map((item, index) => {
    const raw = isRecord(item) ? item : {};

    return {
      id: String(raw.id ?? `promo-${index + 1}`),
      title: String(raw.title ?? ""),
      tag: String(raw.tag ?? ""),
      text: String(raw.text ?? raw.description ?? ""),
      buttonText: String(raw.buttonText ?? raw.button_label ?? "Lihat Detail"),
      detailText: String(raw.detailText ?? raw.secondary_button_label ?? "Detail Info"),
      image: withAssetBase(String(raw.image ?? raw.imageUrl ?? "")),
      accent: String(raw.accent ?? "#0f766e"),
    };
  });
};

const normalizeGallery = (value: unknown): GalleryItem[] => {
  if (!Array.isArray(value)) return defaultHomeContent.gallery;

  return value.map((item, index) => {
    const raw = isRecord(item) ? item : {};

    return {
      id: String(raw.id ?? `gallery-${index + 1}`),
      title: String(raw.title ?? ""),
      category: String(raw.category ?? ""),
      image: withAssetBase(String(raw.image ?? raw.imageUrl ?? "")),
      caption: String(raw.caption ?? raw.description ?? ""),
    };
  });
};

const normalizeActivities = (value: unknown): ActivityItem[] => {
  if (!Array.isArray(value)) return defaultHomeContent.activities;

  return value.map((item, index) => {
    const raw = isRecord(item) ? item : {};

    return {
      id: String(raw.id ?? `activity-${index + 1}`),
      title: String(raw.title ?? ""),
      category: String(raw.category ?? ""),
      date: String(raw.date ?? ""),
      image: withAssetBase(String(raw.image ?? raw.imageUrl ?? "")),
      desc: String(raw.desc ?? raw.description ?? ""),
    };
  });
};

const normalizeAchievements = (value: unknown): AchievementItem[] => {
  if (!Array.isArray(value)) return defaultHomeContent.achievements;

  return value.map((item, index) => {
    const raw = isRecord(item) ? item : {};

    return {
      id: String(raw.id ?? `achievement-${index + 1}`),
      title: String(raw.title ?? ""),
      year: String(raw.year ?? ""),
      category: String(raw.category ?? ""),
      img: withAssetBase(String(raw.img ?? raw.image ?? raw.imageUrl ?? "")),
      desc: String(raw.desc ?? raw.description ?? ""),
    };
  });
};

const normalizeAbout = (value: unknown): AboutContent => {
  if (!isRecord(value)) return defaultHomeContent.about;

  return {
    badge: String(value.badge ?? defaultHomeContent.about.badge),
    title: String(value.title ?? defaultHomeContent.about.title),
    highlight: String(value.highlight ?? defaultHomeContent.about.highlight),
    description: String(value.description ?? defaultHomeContent.about.description),
    image: withAssetBase(String(value.image ?? value.imageUrl ?? defaultHomeContent.about.image)),
    visionTitle: String(value.visionTitle ?? defaultHomeContent.about.visionTitle),
    visionText: String(value.visionText ?? defaultHomeContent.about.visionText),
    mottoTitle: String(value.mottoTitle ?? defaultHomeContent.about.mottoTitle),
    mottoItems: Array.isArray(value.mottoItems)
      ? value.mottoItems.map(String)
      : defaultHomeContent.about.mottoItems,
    facilityTitle: String(value.facilityTitle ?? defaultHomeContent.about.facilityTitle),
    facilities: Array.isArray(value.facilities)
      ? value.facilities.map(String)
      : defaultHomeContent.about.facilities,
  };
};

const normalizeExtracurriculars = (value: unknown): ExtracurricularGroup[] => {
  if (!Array.isArray(value)) return defaultHomeContent.extracurriculars;

  return value.map((item, index) => {
    const raw = isRecord(item) ? item : {};

    return {
      id: String(raw.id ?? `ekskul-${index + 1}`),
      title: String(raw.title ?? ""),
      icon: String(raw.icon ?? "bi-stars"),
      gradient: String(raw.gradient ?? "linear-gradient(135deg, #0f766e 0%, #2563eb 100%)"),
      items: Array.isArray(raw.items) ? raw.items.map(String) : [],
    };
  });
};

const pickToken = (data: Record<string, unknown>): string | undefined => {
  if (typeof data.token === "string") return data.token;
  if (typeof data.accessToken === "string") return data.accessToken;
  if (typeof data.access_token === "string") return data.access_token;

  const nestedData = data.data;
  if (nestedData && typeof nestedData === "object") {
    return pickToken(nestedData as Record<string, unknown>);
  }

  return undefined;
};

const pickUser = (data: Record<string, unknown>): AuthUser | undefined => {
  const directUser = data.user;
  if (directUser && typeof directUser === "object") {
    return directUser as AuthUser;
  }

  const nestedData = data.data;
  if (nestedData && typeof nestedData === "object") {
    return pickUser(nestedData as Record<string, unknown>);
  }

  const fallbackUser = data.admin;
  if (fallbackUser && typeof fallbackUser === "object") {
    return fallbackUser as AuthUser;
  }

  return undefined;
};

export const loginAdmin = async (
  payload: LoginPayload,
): Promise<LoginResult> => {
  const response = await api.post("/api/auth/login", payload);
  const data = response.data as Record<string, unknown>;
  const token = pickToken(data);

  if (!token) {
    throw new Error("Token login tidak ditemukan dari respons API.");
  }

  return {
    token,
    user: pickUser(data),
    raw: response.data,
  };
};

const getContentSection = async <T>(
  endpoint: string,
  normalize: (value: unknown) => T,
  fallback: T,
): Promise<T> => {
  try {
    const response = await api.get(endpoint);
    return normalize(unwrapData<unknown>(response.data));
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return fallback;
    }

    throw error;
  }
};

export const getHomeContent = async (): Promise<HomeContent> => {
  try {
    const response = await api.get(contentHomeEndpoint);
    const payload = unwrapData<Record<string, unknown>>(response.data);

    return {
      banner: normalizeBanner(payload.banner),
      promotions: normalizePromotions(payload.promotions),
      gallery: normalizeGallery(payload.gallery),
      activities: normalizeActivities(payload.activities),
      achievements: normalizeAchievements(payload.achievements),
      about: normalizeAbout(payload.about),
      extracurriculars: normalizeExtracurriculars(payload.extracurriculars),
    };
  } catch (error) {
    if (!(error instanceof AxiosError) || error.response?.status !== 404) {
      throw error;
    }
  }

  const [banner, promotions, gallery, activities, achievements, about, extracurriculars] =
    await Promise.all([
      getContentSection(contentEndpoints.banner, normalizeBanner, defaultHomeContent.banner),
      getContentSection(
        contentEndpoints.promotions,
        normalizePromotions,
        defaultHomeContent.promotions,
      ),
      getContentSection(contentEndpoints.gallery, normalizeGallery, defaultHomeContent.gallery),
      getContentSection(
        contentEndpoints.activities,
        normalizeActivities,
        defaultHomeContent.activities,
      ),
      getContentSection(
        contentEndpoints.achievements,
        normalizeAchievements,
        defaultHomeContent.achievements,
      ),
      getContentSection(contentEndpoints.about, normalizeAbout, defaultHomeContent.about),
      getContentSection(
        contentEndpoints.extracurriculars,
        normalizeExtracurriculars,
        defaultHomeContent.extracurriculars,
      ),
    ]);

  return {
    banner,
    promotions,
    gallery,
    activities,
    achievements,
    about,
    extracurriculars,
  };
};

export const saveContentSection = async <K extends ContentSectionKey>(
  section: K,
  payload: HomeContent[K],
): Promise<HomeContent[K]> => {
  const endpoint = contentEndpoints[section];
  const response = await api.post(endpoint, payload);
  return unwrapData<HomeContent[K]>(response.data);
};
