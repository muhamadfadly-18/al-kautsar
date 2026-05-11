import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import type {
  OrganizationContent,
  OrganizationMember,
} from "../../../data/organizationContent";
import { defaultOrganizationContent } from "../../../data/organizationContent";
import {
  getOrganizationContent,
  saveOrganizationContent,
} from "../../../services/content/organization";
import {
  createOrganizationMember,
  createOrganizationSection,
  getOrganizationStats,
} from "./helpers";
import {
  confirmOrganizationDelete,
  openOrganizationMemberModal,
  openOrganizationMetaModal,
  openOrganizationSectionModal,
} from "./modalHelpers";
import OrganizationGeneralTab from "./OrganizationGeneralTab";
import OrganizationHeader from "./OrganizationHeader";
import OrganizationLeadersTab from "./OrganizationLeadersTab";
import OrganizationSectionsTab from "./OrganizationSectionsTab";
import OrganizationStats from "./OrganizationStats";
import type { OrganizationEditorTab } from "./types";

const tabs: Array<{ id: OrganizationEditorTab; label: string }> = [
  { id: "general", label: "Umum" },
  { id: "leaders", label: "Lurah" },
  { id: "sections", label: "Bagian" },
];

const OrganizationManager = () => {
  const [activeTab, setActiveTab] = useState<OrganizationEditorTab>("general");
  const [content, setContent] = useState<OrganizationContent>(
    defaultOrganizationContent,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadOrganization = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const result = await getOrganizationContent();
        setContent(result);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal memuat data organisasi dari API.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadOrganization();
  }, []);

  const stats = useMemo(() => getOrganizationStats(content), [content]);

  const persistOrganization = async (
    nextContent: OrganizationContent,
    successMessage: string,
  ) => {
    setSaving(true);
    setStatusMessage("");
    setErrorMessage("");

    try {
      const saved = await saveOrganizationContent(nextContent);
      setContent(saved);
      setStatusMessage(successMessage);
      return saved;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan data organisasi ke API.",
      );
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewMember = async (member: OrganizationMember) => {
    await Swal.fire({
      title: member.name,
      html: `
        <div class="organization-preview">
          <img src="${member.img}" alt="${member.name}" class="organization-preview__image" />
          <p class="organization-preview__position">${member.position}</p>
          <div class="organization-preview__grid">
            <div>
              <strong>Pendidikan</strong>
              <p>${member.education || "-"}</p>
            </div>
            <div>
              <strong>Pengabdian</strong>
              <p>${member.years || "-"}</p>
            </div>
          </div>
          <p class="organization-preview__bio">${member.bio || "Bio belum diisi."}</p>
        </div>
      `,
      confirmButtonText: "Tutup",
      customClass: {
        popup: "student-swal-popup",
        confirmButton: "student-swal-confirm",
      },
      buttonsStyling: false,
    });
  };

  const handleEditMeta = async () => {
    const updated = await openOrganizationMetaModal(content);
    if (!updated) return;

    const nextContent = { ...content, ...updated };
    await persistOrganization(nextContent, "Informasi halaman berhasil diperbarui.");
  };

  const handleEditHead = async () => {
    const updated = await openOrganizationMemberModal(
      "Edit kepala pondok",
      content.head,
    );
    if (!updated) return;

    const nextContent = {
      ...content,
      head: updated,
    };
    await persistOrganization(nextContent, "Data kepala pondok berhasil diperbarui.");
  };

  const handleEditLeader = async (id: string) => {
    const currentLeader = content.leaders.find((leader) => leader.id === id);
    if (!currentLeader) return;

    const updated = await openOrganizationMemberModal("Edit data lurah", currentLeader);
    if (!updated) return;

    const nextContent = {
      ...content,
      leaders: content.leaders.map((leader) =>
        leader.id === id ? updated : leader,
      ),
    };
    await persistOrganization(nextContent, "Data lurah berhasil diperbarui.");
  };

  const handleAddLeader = async () => {
    const newLeader = createOrganizationMember("leader", content.leaders.length + 1);
    const created = await openOrganizationMemberModal("Tambah lurah baru", newLeader);
    if (!created) return;

    const nextContent = {
      ...content,
      leaders: [...content.leaders, created],
    };
    await persistOrganization(nextContent, "Lurah baru berhasil ditambahkan.");
  };

  const handleDeleteLeader = async (id: string) => {
    const currentLeader = content.leaders.find((leader) => leader.id === id);
    if (!currentLeader) return;

    const confirmed = await confirmOrganizationDelete(
      `${currentLeader.name} akan dihapus dari daftar lurah.`,
    );
    if (!confirmed) return;

    const nextContent = {
      ...content,
      leaders: content.leaders.filter((leader) => leader.id !== id),
    };
    await persistOrganization(nextContent, "Data lurah berhasil dihapus.");
  };

  const handleEditSection = async (id: string) => {
    const currentSection = content.sections.find((section) => section.id === id);
    if (!currentSection) return;

    const updated = await openOrganizationSectionModal(currentSection);
    if (!updated) return;

    const nextContent = {
      ...content,
      sections: content.sections.map((section) =>
        section.id === id ? updated : section,
      ),
    };
    await persistOrganization(nextContent, "Bagian organisasi berhasil diperbarui.");
  };

  const handleAddSection = async () => {
    const newSection = createOrganizationSection(content.sections.length + 1);
    const created = await openOrganizationSectionModal(newSection);
    if (!created) return;

    const nextContent = {
      ...content,
      sections: [...content.sections, created],
    };
    await persistOrganization(nextContent, "Bagian baru berhasil ditambahkan.");
  };

  const handleDeleteSection = async (id: string) => {
    const currentSection = content.sections.find((section) => section.id === id);
    if (!currentSection) return;

    const confirmed = await confirmOrganizationDelete(
      `Bagian ${currentSection.section} akan dihapus bersama semua anggotanya.`,
    );
    if (!confirmed) return;

    const nextContent = {
      ...content,
      sections: content.sections.filter((section) => section.id !== id),
    };
    await persistOrganization(nextContent, "Bagian organisasi berhasil dihapus.");
  };

  const handleAddSectionMember = async (sectionId: string) => {
    const targetSection = content.sections.find((section) => section.id === sectionId);
    if (!targetSection) return;

    const newMember = createOrganizationMember(
      "section-member",
      targetSection.members.length + 1,
    );
    const created = await openOrganizationMemberModal(
      `Tambah anggota ${targetSection.section}`,
      newMember,
    );
    if (!created) return;

    const nextContent = {
      ...content,
      sections: content.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              members: [...section.members, created],
            }
          : section,
      ),
    };
    await persistOrganization(nextContent, "Anggota bagian berhasil ditambahkan.");
  };

  const handleEditSectionMember = async (
    sectionId: string,
    memberId: string,
  ) => {
    const section = content.sections.find((item) => item.id === sectionId);
    const member = section?.members.find((item) => item.id === memberId);
    if (!member) return;

    const updated = await openOrganizationMemberModal("Edit anggota bagian", member);
    if (!updated) return;

    const nextContent = {
      ...content,
      sections: content.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              members: section.members.map((member) =>
                member.id === memberId ? updated : member,
              ),
            }
          : section,
      ),
    };
    await persistOrganization(nextContent, "Anggota bagian berhasil diperbarui.");
  };

  const handleDeleteSectionMember = async (sectionId: string, memberId: string) => {
    const section = content.sections.find((item) => item.id === sectionId);
    const member = section?.members.find((item) => item.id === memberId);
    if (!member) return;

    const confirmed = await confirmOrganizationDelete(
      `${member.name} akan dihapus dari bagian ${section?.section}.`,
    );
    if (!confirmed) return;

    const nextContent = {
      ...content,
      sections: content.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              members: section.members.filter((member) => member.id !== memberId),
            }
          : section,
      ),
    };
    await persistOrganization(nextContent, "Anggota bagian berhasil dihapus.");
  };

  const handleSave = async () => {
    await persistOrganization(content, "Data organisasi berhasil disimpan ke API.");
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <article className="content-editor">
          <p>Memuat data organisasi dari API...</p>
        </article>
      );
    }

    switch (activeTab) {
      case "general":
        return (
          <OrganizationGeneralTab
            content={content}
            onEditMeta={() => void handleEditMeta()}
            onEditHead={() => void handleEditHead()}
            onPreviewMember={(member) => void handlePreviewMember(member)}
          />
        );
      case "leaders":
        return (
          <OrganizationLeadersTab
            leaders={content.leaders}
            onAdd={() => void handleAddLeader()}
            onEdit={(id) => void handleEditLeader(id)}
            onDelete={(id) => void handleDeleteLeader(id)}
            onPreview={(member) => void handlePreviewMember(member)}
          />
        );
      case "sections":
        return (
          <OrganizationSectionsTab
            sections={content.sections}
            onSectionEdit={(id) => void handleEditSection(id)}
            onSectionDelete={(id) => void handleDeleteSection(id)}
            onSectionAdd={() => void handleAddSection()}
            onMemberAdd={(sectionId) => void handleAddSectionMember(sectionId)}
            onMemberEdit={(sectionId, memberId) =>
              void handleEditSectionMember(sectionId, memberId)
            }
            onMemberDelete={(sectionId, memberId) =>
              void handleDeleteSectionMember(sectionId, memberId)
            }
            onPreview={(member) => void handlePreviewMember(member)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="organization-manager">
      <OrganizationHeader />
      <OrganizationStats
        totalLeaders={stats.totalLeaders}
        totalSections={stats.totalSections}
        totalMembers={stats.totalMembers}
      />

      <section className="content-manager__header">
        <div className="content-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`content-tabs__item ${
                activeTab === tab.id ? "content-tabs__item--active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="admin-button"
          onClick={() => void handleSave()}
          disabled={saving || loading}
        >
          {saving ? "Menyimpan..." : "Simpan ke API"}
        </button>
      </section>

      {statusMessage ? (
        <div className="content-status content-status--success">
          {statusMessage}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="content-status content-status--error">
          {errorMessage}
        </div>
      ) : null}

      {renderTabContent()}
    </section>
  );
};

export default OrganizationManager;
