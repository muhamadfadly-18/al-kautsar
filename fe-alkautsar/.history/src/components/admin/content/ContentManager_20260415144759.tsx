import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import type {
  AchievementItem,
  ActivityItem,
  BannerContent,
  ExtracurricularGroup,
  GalleryItem,
  HomeContent,
  PromoItem,
} from "../../../data/homeContent";
import { defaultHomeContent } from "../../../data/homeContent";
import { getHomeContent, saveContentSection } from "../../../services/api";
import {
  createAchievement,
  createActivity,
  createExtracurricular,
  createGallery,
  createPromo,
} from "./helpers";
import { contentTabs, type ContentSection } from "./types";

const fieldValue = (id: string) =>
  (document.getElementById(id) as HTMLInputElement | null)?.value.trim() ?? "";

const listValue = (id: string) =>
  fieldValue(id).split("\n").map(i => i.trim()).filter(Boolean);

const modalHtml = (fields: string) =>
  `<div class="student-modal-grid">${fields}</div>`;

const modalInput = (id: string, label: string, value: string) => `
<label>
<span>${label}</span>
<input id="${id}" class="swal2-input" value="${value}" />
</label>
`;

const modalTextarea = (id: string, label: string, value: string) => `
<label>
<span>${label}</span>
<textarea id="${id}" class="swal2-textarea">${value}</textarea>
</label>
`;

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState<ContentSection>("banner");
  const [content, setContent] = useState<HomeContent>(defaultHomeContent);

  useEffect(() => {
    const load = async () => {
      const res = await getHomeContent();
      setContent(res);
    };
    load();
  }, []);

  // 🔥 SAVE LANGSUNG KE API
  const saveNow = async (section: ContentSection, data: any) => {
    await saveContentSection(section, data);
    await Swal.fire("Berhasil", "Data langsung tersimpan", "success");
  };

  // =========================
  // BANNER
  // =========================
  const openBannerModal = async () => {
    const b = content.banner;

    const res = await Swal.fire({
      title: "Edit Banner",
      html: modalHtml(
        [
          modalInput("t", "Title", b.title),
          modalInput("i", "Image", b.image),
          modalTextarea("d", "Text", b.text),
        ].join("")
      ),
      showCancelButton: true,
      confirmButtonText: "Simpan",
      preConfirm: () => ({
        title: fieldValue("t"),
        image: fieldValue("i"),
        text: fieldValue("d"),
      }),
    });

    if (!res.isConfirmed) return;

    const data = res.value as BannerContent;

    setContent(prev => ({ ...prev, banner: data }));
    await saveNow("banner", data);
  };

  // =========================
  // PROMO
  // =========================
  const openPromoModal = async (item: PromoItem, index?: number) => {
    const res = await Swal.fire({
      title: "Promo",
      html: modalHtml([
        modalInput("t", "Title", item.title),
        modalTextarea("d", "Text", item.text),
      ].join("")),
      showCancelButton: true,
      confirmButtonText: "Simpan",
      preConfirm: () => ({
        ...item,
        title: fieldValue("t"),
        text: fieldValue("d"),
      }),
    });

    if (!res.isConfirmed) return;

    let newData: PromoItem[];

    if (index === undefined) {
      newData = [...content.promotions, res.value];
    } else {
      newData = content.promotions.map((v, i) =>
        i === index ? res.value : v
      );
    }

    setContent(prev => ({ ...prev, promotions: newData }));
    await saveNow("promotions", newData);
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (
    section: keyof HomeContent,
    index: number
  ) => {
    const ok = await Swal.fire({
      title: "Hapus?",
      showCancelButton: true,
    });

    if (!ok.isConfirmed) return;

    const newData = (content[section] as any[]).filter((_, i) => i !== index);

    setContent(prev => ({
      ...prev,
      [section]: newData,
    }));

    await saveNow(section as ContentSection, newData);
  };

  // =========================
  // RENDER
  // =========================
  return (
    <div>
      <h2>Content Manager</h2>

      <div>
        {contentTabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* BANNER */}
      {activeTab === "banner" && (
        <div>
          <h3>{content.banner.title}</h3>
          <button onClick={openBannerModal}>Edit</button>
        </div>
      )}

      {/* PROMO */}
      {activeTab === "promotions" && (
        <div>
          <button onClick={() => openPromoModal(createPromo())}>
            Tambah
          </button>

          {content.promotions.map((item, i) => (
            <div key={i}>
              <h4>{item.title}</h4>

              <button onClick={() => openPromoModal(item, i)}>
                Edit
              </button>

              <button onClick={() => handleDelete("promotions", i)}>
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentManager;