import { AxiosError } from "axios";
import type {
  OrganizationContent,
  OrganizationMember,
  OrganizationSection,
} from "../../data/organizationContent";
import { defaultOrganizationContent } from "../../data/organizationContent";
import { api, isRecord, pickString, unwrapData } from "../shared/client";

const configuredEndpoint = import.meta.env.VITE_ORGANIZATION_ENDPOINT?.trim();

const organizationEndpoints = configuredEndpoint
  ? [configuredEndpoint]
  : [
      "api/organizations/",
      "api/organizations",
      "api/organization",
      "api/organization-structure",
      "api/struktur-organisasi",
      "api/organization",
    ];

const withAssetBase = (value: string) => {
  if (!value) return value;
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
  if (value.startsWith("/")) return `${api.defaults.baseURL}${value}`;
  return `${api.defaults.baseURL}/assets/${value}`;
};

const canTryNextEndpoint = (error: unknown) =>
  error instanceof AxiosError && [404, 405].includes(error.response?.status ?? 0);

const requestWithFallback = async <T>(
  handler: (endpoint: string) => Promise<T>,
): Promise<T> => {
  let lastError: unknown;

  for (const endpoint of organizationEndpoints) {
    try {
      return await handler(endpoint);
    } catch (error) {
      lastError = error;

      if (!canTryNextEndpoint(error)) {
        throw error;
      }
    }
  }

  throw lastError ?? new Error("Endpoint organisasi tidak ditemukan.");
};

const normalizeMember = (value: unknown, fallbackId: string): OrganizationMember => {
  const raw = isRecord(value) ? value : {};

  return {
    id: pickString(raw.id ?? raw._id ?? fallbackId),
    name: pickString(raw.name, "Tanpa Nama"),
    position: pickString(raw.position ?? raw.role, "-"),
    img: withAssetBase(pickString(raw.img ?? raw.image ?? raw.imageUrl)),
    bio: pickString(raw.bio ?? raw.description),
    education: pickString(raw.education),
    years: pickString(raw.years ?? raw.period ?? raw.experience),
  };
};

const normalizeSection = (value: unknown, index: number): OrganizationSection => {
  const raw = isRecord(value) ? value : {};
  const members = Array.isArray(raw.members) ? raw.members : [];

  return {
    id: pickString(raw.id ?? raw._id ?? `section-${index + 1}`),
    section: pickString(raw.section ?? raw.title ?? raw.name, `Bagian ${index + 1}`),
    icon: pickString(raw.icon, "bi-diagram-3-fill"),
    members: members.map((member, memberIndex) =>
      normalizeMember(member, `section-${index + 1}-member-${memberIndex + 1}`),
    ),
  };
};

const normalizeOrganizationContent = (value: unknown): OrganizationContent => {
  if (Array.isArray(value)) {
    return normalizeOrganizationContent(value[0]);
  }

  const raw = isRecord(value) ? value : {};
  const headRaw = raw.head ?? raw.kepala;
  const leadersRaw = Array.isArray(raw.leaders)
    ? raw.leaders
    : Array.isArray(raw.lurah)
      ? raw.lurah
      : [];
  const sectionsRaw = Array.isArray(raw.sections)
    ? raw.sections
    : Array.isArray(raw.bagian)
      ? raw.bagian
      : [];

  return {
    id: pickString(raw.id ?? raw._id) || undefined,
    title: pickString(raw.title, defaultOrganizationContent.title),
    subtitle: pickString(raw.subtitle, defaultOrganizationContent.subtitle),
    head: normalizeMember(headRaw, defaultOrganizationContent.head.id),
    leaders: leadersRaw.length
      ? leadersRaw.map((item, index) => normalizeMember(item, `leader-${index + 1}`))
      : defaultOrganizationContent.leaders,
    sections: sectionsRaw.length
      ? sectionsRaw.map(normalizeSection)
      : defaultOrganizationContent.sections,
  };
};

const toPayload = (content: OrganizationContent) => ({
  id: content.id,
  title: content.title,
  subtitle: content.subtitle,
  head: content.head,
  leaders: content.leaders,
  sections: content.sections,
});

export const getOrganizationContent = async (): Promise<OrganizationContent> => {
  try {
    return await requestWithFallback(async (endpoint) => {
      const response = await api.get(endpoint);
      return normalizeOrganizationContent(unwrapData<unknown>(response.data));
    });
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return defaultOrganizationContent;
    }

    throw error;
  }
};

export const saveOrganizationContent = async (
  content: OrganizationContent,
): Promise<OrganizationContent> => {
  const payload = toPayload(content);

  return requestWithFallback(async (endpoint) => {
    const attempts = content.id
      ? [
          () => api.put(`${endpoint}/${content.id}`, payload),
          () => api.put(endpoint, payload),
          () => api.post(endpoint, payload),
        ]
      : [() => api.post(endpoint, payload), () => api.put(endpoint, payload)];

    let lastError: unknown;

    for (const attempt of attempts) {
      try {
        const response = await attempt();
        return normalizeOrganizationContent(unwrapData<unknown>(response.data));
      } catch (error) {
        lastError = error;

        if (
          !(error instanceof AxiosError) ||
          ![404, 405].includes(error.response?.status ?? 0)
        ) {
          throw error;
        }
      }
    }

    throw lastError ?? new Error("Gagal menyimpan data organisasi.");
  });
};
