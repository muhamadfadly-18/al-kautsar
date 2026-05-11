import type {
  OrganizationContent,
  OrganizationMember,
  OrganizationSection,
} from "../../../data/organizationContent";

export const organizationIconOptions = [
  { value: "bi-people-fill", label: "People" },
  { value: "bi-book-fill", label: "Book" },
  { value: "bi-cash-stack", label: "Cash" },
  { value: "bi-mortarboard-fill", label: "Education" },
  { value: "bi-megaphone-fill", label: "Megaphone" },
  { value: "bi-journal-richtext", label: "Journal" },
  { value: "bi-building", label: "Building" },
  { value: "bi-clipboard-data-fill", label: "Data" },
  { value: "bi-diagram-3-fill", label: "Organization" },
  { value: "bi-shield-check", label: "Security" },
];

export const createOrganizationMember = (
  prefix: string,
  index: number,
): OrganizationMember => ({
  id: `${prefix}-${Date.now()}-${index}`,
  name: "",
  position: "",
  img: "",
  bio: "",
  education: "",
  years: "",
});

export const createOrganizationSection = (index: number): OrganizationSection => ({
  id: `section-${Date.now()}-${index}`,
  section: "",
  icon: "bi-diagram-3-fill",
  members: [createOrganizationMember("section-member", index + 1)],
});

export const getOrganizationStats = (content: OrganizationContent) => ({
  totalLeaders: content.leaders.length,
  totalSections: content.sections.length,
  totalMembers:
    1 +
    content.leaders.length +
    content.sections.reduce((sum, section) => sum + section.members.length, 0),
});
