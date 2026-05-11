import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import type {
  AchievementItem,
  ActivityItem,
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

// ... (Masukkan fungsi escapeHtml, fieldValue, listValue, modalHtml, modalInput, modalTextarea di sini)

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState<ContentSection>("banner");
  const [content, setContent] = useState<HomeContent>(defaultHomeContent);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<ContentSection | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const result = await getHomeContent();
        setContent(result);
      } catch (error) {
        setStatusError("Gagal memuat konten dari API.");
      } finally {
        setLoading(false);
      }
    };
    void loadContent();
  }, []);

  const saveSection = async (section: ContentSection, updatedContent?: any) => {
    setSavingSection(section);
    try {
      const dataToSave = updatedContent || content[section];
      await saveContentSection(section, dataToSave);
      
      const label = contentTabs.find((item) => item.key === section)?.label ?? section;
      await Swal.fire({
        title: "Berhasil",
        text: `Konten ${label} berhasil diperbarui.`,
        icon: "success",
        confirmButtonText: "Mantap",
        customClass: { confirmButton: "student-swal-confirm" },
        buttonsStyling: false,
      });
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
    } finally {
      setSavingSection(null);
    }
  };

  // --- MODAL HANDLERS DENGAN TOMBOL SIMPAN INTERNAL & IMAGE UPLOAD ---

  const openBannerModal = async () => {
    const banner = content.banner;
    await Swal.fire({
      title: "Edit Banner Utama",
      html: `
        ${modalHtml([
          modalInput("banner-title", "Judul Banner", banner.title),
          modalFile("banner-image", "Ganti Gambar Banner", banner.image),
          modalTextarea("banner-text", "Deskripsi", banner.text),
          modalInput("banner-primary-label", "Label Tombol 1", banner.primaryLabel),
          modalInput("banner-primary-href", "Link Tombol 1", banner.primaryHref),
        ].join(""))}
        <div class="student-modal-footer">
          <button id="btn-save-banner" class="admin-button">Simpan Perubahan</button>
        </div>
      `,
      width: 800,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Batal",
      customClass: { popup: "student-swal-popup", cancelButton: "student-swal-cancel" },
      buttonsStyling: false,
      didOpen: () => {
        document.getElementById("btn-save-banner")?.addEventListener("click", async () => {
          const fileInput = document.getElementById("banner-image") as HTMLInputElement;
          let imageUrl = banner.image;

          if (fileInput.files?.[0]) {
            imageUrl = await toBase64(fileInput.files[0]);
          }

          const nextBanner = {
            ...banner,
            title: fieldValue("banner-title"),
            text: fieldValue("banner-text"),
            image: imageUrl,
            primaryLabel: fieldValue("banner-primary-label"),
            primaryHref: fieldValue("banner-primary-href"),
          };

          setContent(prev => ({ ...prev, banner: nextBanner }));
          await saveSection("banner", nextBanner);
          Swal.close();
        });
      }
    });
  };

  const openGalleryModal = async (initialValue: GalleryItem, index?: number) => {
    await Swal.fire({
      title: index === undefined ? "Tambah Foto Gallery" : "Edit Foto Gallery",
      html: `
        ${modalHtml([
          modalInput("gallery-title", "Judul", initialValue.title),
          modalInput("gallery-category", "Kategori", initialValue.category),
          modalFile("gallery-image", "Upload Foto", initialValue.image),
          modalTextarea("gallery-caption", "Caption", initialValue.caption),
        ].join(""))}
        <div class="student-modal-footer">
          <button id="btn-save-gallery" class="admin-button">Simpan Gallery</button>
        </div>
      `,
      width: 800,
      showConfirmButton: false,
      showCancelButton: true,
      customClass: { popup: "student-swal-popup", cancelButton: "student-swal-cancel" },
      buttonsStyling: false,
      didOpen: () => {
        document.getElementById("btn-save-gallery")?.addEventListener("click", async () => {
          const fileInput = document.getElementById("gallery-image") as HTMLInputElement;
          let imageUrl = initialValue.image;

          if (fileInput.files?.[0]) imageUrl = await toBase64(fileInput.files[0]);

          const newData = {
            ...initialValue,
            title: fieldValue("gallery-title"),
            category: fieldValue("gallery-category"),
            caption: fieldValue("gallery-caption"),
            image: imageUrl,
          };

          const newGallery = index === undefined 
            ? [...content.gallery, newData] 
            : content.gallery.map((item, i) => i === index ? newData : item);

          setContent(prev => ({ ...prev, gallery: newGallery }));
          await saveSection("gallery", newGallery);
          Swal.close();
        });
      }
    });
  };

  // --- RENDER LOGIC ---

  const renderBannerSection = () => (
    <div className="admin-card">
      <div className="content-editor__topbar">
        <h3>Preview Banner</h3>
        <button className="admin-button" onClick={openBannerModal}>Edit Banner</button>
      </div>
      <div className="content-item-card">
         <img src={content.banner.image} alt="Banner" style={{width: '100%', borderRadius: '12px', marginBottom: '1rem'}} />
         <h4>{content.banner.title}</h4>
         <p>{content.banner.text}</p>
      </div>
    </div>
  );

  // ... (Gunakan renderListSection yang sudah Anda miliki)

  return (
    <section className="content-manager">
      <div className="content-manager__header">
        <div className="admin-badge">Mode Editor Profesional</div>
        <h2>Manajemen Konten Landing Page</h2>
      </div>

      <div className="content-tabs">
        {contentTabs.map((tab) => (
          <button
            key={tab.key}
            className={`content-tabs__item ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="content-editor">
        {activeTab === "banner" && renderBannerSection()}
        {activeTab === "gallery" && renderListSection(
            "Gallery Sekolah", "Tambah Foto", content.gallery,
            () => openGalleryModal(createGallery()),
            (item, i) => openGalleryModal(item, i),
            (item, i) => confirmRemove("gallery", i, item.title),
            (item) => item.title,
            (item) => item.caption,
            (item) => item.image
        )}
        {/* Tambahkan tab lainnya dengan pola yang sama */}
      </div>
    </section>
  );
};

export default ContentManager;