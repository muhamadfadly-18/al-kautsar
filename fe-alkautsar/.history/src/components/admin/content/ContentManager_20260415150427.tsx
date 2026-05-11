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

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fieldValue = (id: string) =>
  (
    document.getElementById(id) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null
  )?.value.trim() ?? "";

const listValue = (id: string) =>
  fieldValue(id)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

const modalHtml = (fields: string) =>
  `<div class="student-modal-form"><div class="student-modal-grid">${fields}</div></div>`;

const modalInput = (
  id: string,
  label: string,
  value: string,
  placeholder = "",
  full = false,
) => `
  <label class="student-modal-field ${full ? "student-modal-field--full" : ""}">
    <span>${label}</span>
    <input id="${id}" class="swal2-input student-modal-input" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" />
  </label>
`;

const modalTextarea = (
  id: string,
  label: string,
  value: string,
  placeholder = "",
  full = true,
) => `
  <label class="student-modal-field ${full ? "student-modal-field--full" : ""}">
    <span>${label}</span>
    <textarea id="${id}" class="swal2-textarea student-modal-textarea" placeholder="${escapeHtml(placeholder)}">${escapeHtml(value)}</textarea>
  </label>
`;

const modalSummary = (
  title: string,
  description: string,
  image?: string,
  accent?: string,
) => (
  <article className="content-item-card">
    <div className="content-item-card__header">
      <strong>{title}</strong>
    </div>
    {image ? (
      <div className="content-summary-image">
        <img src={image} alt={title} />
      </div>
    ) : null}
    {accent ? (
      <div className="content-summary-accent">
        <span>Accent</span>
        <code>{accent}</code>
      </div>
    ) : null}
    <p>{description}</p>
  </article>
);

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState<ContentSection>("banner");
  const [content, setContent] = useState<HomeContent>(defaultHomeContent);
  const [loading, setLoading] = useState(true);
  const [savingSection, setSavingSection] = useState<ContentSection | null>(
    null,
  );
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      setStatusError("");

      try {
        const result = await getHomeContent();
        setContent(result);
      } catch (error) {
        setStatusError(
          error instanceof Error
            ? error.message
            : "Gagal memuat konten dari API. Menampilkan data default.",
        );
      } finally {
        setLoading(false);
      }
    };

    void loadContent();
  }, []);

  const saveSection = async (section: ContentSection) => {
    setSavingSection(section);
    setStatusMessage("");
    setStatusError("");

    try {
      await saveContentSection(section, content[section]);
      const label =
        contentTabs.find((item) => item.key === section)?.label ?? section;
      setStatusMessage(`Konten ${label} berhasil disimpan ke API.`);
      await Swal.fire({
        title: "Berhasil",
        text: `Konten ${label} berhasil disimpan ke API.`,
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "student-swal-confirm",
        },
        buttonsStyling: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyimpan data ke API.";
      setStatusError(message);
      await Swal.fire({
        title: "Gagal menyimpan",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "student-swal-confirm",
        },
        buttonsStyling: false,
      });
    } finally {
      setSavingSection(null);
    }
  };

  const openBannerModal = async () => {
    const banner = content.banner;

    await Swal.fire({
      title: "Edit Banner",
      html: `
      ${modalHtml(
        [
          modalInput(
            "banner-title",
            "Judul Banner",
            banner.title,
            "Judul banner",
          ),
          modalInput(
            "banner-image",
            "URL Gambar Banner",
            banner.image,
            "https://...",
          ),
          modalTextarea(
            "banner-text",
            "Deskripsi Banner",
            banner.text,
            "Isi banner",
          ),
          modalInput(
            "banner-primary-label",
            "Tombol 1",
            banner.primaryLabel,
            "Label tombol",
          ),
          modalInput(
            "banner-primary-href",
            "Link Tombol 1",
            banner.primaryHref,
            "#tentang",
          ),
          modalInput(
            "banner-secondary-label",
            "Tombol 2",
            banner.secondaryLabel,
            "Label tombol",
          ),
          modalInput(
            "banner-secondary-href",
            "Link Tombol 2",
            banner.secondaryHref,
            "#promosi",
          ),
        ].join(""),
      )}

      <div style="margin-top:20px; display:flex; justify-content:flex-end; gap:10px;">
        <button id="btn-save-banner" class="admin-button">
          Simpan Banner
        </button>
      </div>
    `,
      width: 900,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Batal",
      customClass: {
        popup: "student-swal-popup",
        cancelButton: "student-swal-cancel",
      },
      buttonsStyling: false,

      didOpen: () => {
        const btn = document.getElementById("btn-save-banner");

        if (btn) {
          btn.addEventListener("click", async () => {
            const nextBanner = {
              title: fieldValue("banner-title"),
              image: fieldValue("banner-image"),
              text: fieldValue("banner-text"),
              primaryLabel: fieldValue("banner-primary-label"),
              primaryHref: fieldValue("banner-primary-href"),
              secondaryLabel: fieldValue("banner-secondary-label"),
              secondaryHref: fieldValue("banner-secondary-href"),
            };

            if (!nextBanner.title || !nextBanner.text) {
              Swal.showValidationMessage("Judul dan deskripsi wajib diisi");
              return;
            }

            // update state
            setContent((prev) => ({
              ...prev,
              banner: nextBanner,
            }));

            // 🔥 simpan ke API
            await saveSection("banner");

            Swal.close();
          });
        }
      },
    });
  };

  const openAboutModal = async () => {
    const about = content.about;
    const result = await Swal.fire<HomeContent["about"]>({
      title: "Edit Tentang Sekolah",
      html: modalHtml(
        [
          modalInput("about-badge", "Badge", about.badge, "Badge"),
          modalInput("about-title", "Judul", about.title, "Judul utama"),
          modalInput(
            "about-highlight",
            "Highlight",
            about.highlight,
            "Pendidikan Islami",
          ),
          modalInput("about-image", "URL Gambar", about.image, "https://..."),
          modalTextarea(
            "about-description",
            "Deskripsi",
            about.description,
            "Deskripsi about",
          ),
          modalInput(
            "about-vision-title",
            "Judul Visi",
            about.visionTitle,
            "Judul visi",
          ),
          modalTextarea(
            "about-vision-text",
            "Isi Visi",
            about.visionText,
            "Isi visi",
          ),
          modalInput(
            "about-motto-title",
            "Judul Motto",
            about.mottoTitle,
            "Judul motto",
          ),
          modalTextarea(
            "about-motto-items",
            "Item Motto",
            about.mottoItems.join("\n"),
            "Satu baris satu item",
          ),
          modalInput(
            "about-facility-title",
            "Judul Fasilitas",
            about.facilityTitle,
            "Judul fasilitas",
          ),
          modalTextarea(
            "about-facilities",
            "Daftar Fasilitas",
            about.facilities.join("\n"),
            "Satu baris satu item",
          ),
        ].join(""),
      ),
      width: 900,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Batal",
      customClass: {
        popup: "student-swal-popup",
        confirmButton: "student-swal-confirm",
        cancelButton: "student-swal-cancel",
      },
      buttonsStyling: false,
      preConfirm: () => {
        const nextAbout = {
          badge: fieldValue("about-badge"),
          title: fieldValue("about-title"),
          highlight: fieldValue("about-highlight"),
          description: fieldValue("about-description"),
          image: fieldValue("about-image"),
          visionTitle: fieldValue("about-vision-title"),
          visionText: fieldValue("about-vision-text"),
          mottoTitle: fieldValue("about-motto-title"),
          mottoItems: listValue("about-motto-items"),
          facilityTitle: fieldValue("about-facility-title"),
          facilities: listValue("about-facilities"),
        };

        if (!nextAbout.title || !nextAbout.description) {
          Swal.showValidationMessage("Judul dan deskripsi about wajib diisi.");
          return;
        }

        return nextAbout;
      },
    });

    if (!result.isConfirmed || !result.value) return;
    setContent((prev) => ({ ...prev, about: result.value! }));
  };

  const openPromoModal = async (initialValue: PromoItem, index?: number) => {
    await Swal.fire({
      title: index === undefined ? "Tambah Promo" : `Edit Promo #${index + 1}`,
      html: `
      ${modalHtml(
        [
          modalInput("promo-title", "Judul", initialValue.title, "Judul promo"),
          modalTextarea(
            "promo-text",
            "Deskripsi",
            initialValue.text,
            "Deskripsi",
          ),
        ].join(""),
      )}

      <div style="margin-top:20px; text-align:right;">
        <button id="btn-save-promo" class="admin-button">
          Simpan Promo
        </button>
      </div>
    `,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "Batal",

      didOpen: () => {
        const btn = document.getElementById("btn-save-promo");

        if (btn) {
          btn.addEventListener("click", async () => {
            const newData = {
              ...initialValue,
              title: fieldValue("promo-title"),
              text: fieldValue("promo-text"),
            };

            if (!newData.title || !newData.text) {
              Swal.showValidationMessage("Wajib isi data");
              return;
            }

            setContent((prev) => ({
              ...prev,
              promotions:
                index === undefined
                  ? [...prev.promotions, newData]
                  : prev.promotions.map((item, i) =>
                      i === index ? newData : item,
                    ),
            }));

            await saveSection("promotions");

            Swal.close();
          });
        }
      },
    });
  };

  const openGalleryModal = async (
    initialValue: GalleryItem,
    index?: number,
  ) => {
    await Swal.fire({
      title: index === undefined ? "Tambah Gallery" : `Edit Foto #${index + 1}`,
      html: `
      ${modalHtml(
        [
          modalInput(
            "gallery-title",
            "Judul",
            initialValue.title,
            "Judul foto",
          ),
          modalInput(
            "gallery-category",
            "Kategori",
            initialValue.category,
            "Kategori",
          ),
          modalInput(
            "gallery-image",
            "URL Gambar",
            initialValue.image,
            "https://...",
          ),
          modalTextarea(
            "gallery-caption",
            "Caption",
            initialValue.caption,
            "Caption foto",
          ),
        ].join(""),
      )}

      <div style="margin-top:20px; display:flex; justify-content:flex-end;">
        <button id="btn-save-gallery" class="admin-button">
          Simpan Gallery
        </button>
      </div>
    `,
      width: 900,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Batal",
      customClass: {
        popup: "student-swal-popup",
        cancelButton: "student-swal-cancel",
      },
      buttonsStyling: false,

      didOpen: () => {
        const btn = document.getElementById("btn-save-gallery");

        if (btn) {
          btn.addEventListener("click", async () => {
            const nextItem: GalleryItem = {
              ...initialValue,
              title: fieldValue("gallery-title"),
              category: fieldValue("gallery-category"),
              image: fieldValue("gallery-image"),
              caption: fieldValue("gallery-caption"),
            };

            // ✅ validasi
            if (!nextItem.title) {
              Swal.showValidationMessage("Judul gallery wajib diisi.");
              return;
            }

            // ✅ update state
            setContent((prev) => ({
              ...prev,
              gallery:
                index === undefined
                  ? [...prev.gallery, nextItem]
                  : prev.gallery.map((item, i) =>
                      i === index ? nextItem : item,
                    ),
            }));

            // 🔥 langsung save ke API
            await saveSection("gallery");

            Swal.close();
          });
        }
      },
    });
  };

  const openActivityModal = async (
  initialValue: ActivityItem,
  index?: number,
) => {
  await Swal.fire({
    title:
      index === undefined ? "Tambah Kegiatan" : `Edit Kegiatan #${index + 1}`,

    html: `
      ${modalHtml(
        [
          modalInput("activity-title", "Judul", initialValue.title, "Judul kegiatan"),
          modalInput("activity-category", "Kategori", initialValue.category, "Kategori"),
          modalInput("activity-date", "Tanggal", initialValue.date, "12 Maret 2026"),
          modalInput("activity-image", "URL Gambar", initialValue.image, "https://..."),
          modalTextarea("activity-desc", "Deskripsi", initialValue.desc, "Deskripsi kegiatan"),
        ].join("")
      )}

      <div style="margin-top:20px; display:flex; justify-content:flex-end;">
        <button id="btn-save-activity" class="admin-button">
          Simpan Kegiatan
        </button>
      </div>
    `,

    width: 900,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "Batal",
    customClass: {
      popup: "student-swal-popup",
      cancelButton: "student-swal-cancel",
    },
    buttonsStyling: false,

    didOpen: () => {
      const btn = document.getElementById("btn-save-activity");

      if (btn) {
        btn.addEventListener("click", async () => {
          const nextItem: ActivityItem = {
            ...initialValue,
            title: fieldValue("activity-title"),
            category: fieldValue("activity-category"),
            date: fieldValue("activity-date"),
            image: fieldValue("activity-image"),
            desc: fieldValue("activity-desc"),
          };

          // ✅ validasi
          if (!nextItem.title || !nextItem.desc) {
            Swal.showValidationMessage(
              "Judul dan deskripsi kegiatan wajib diisi."
            );
            return;
          }

          // ✅ update state
          setContent((prev) => ({
            ...prev,
            activities:
              index === undefined
                ? [...prev.activities, nextItem]
                : prev.activities.map((item, i) =>
                    i === index ? nextItem : item
                  ),
          }));

          // 🔥 langsung save ke API
          await saveSection("activities");

          Swal.close();
        });
      }
    },
  });
};

  const openAchievementModal = async (
  initialValue: AchievementItem,
  index?: number,
) => {
  await Swal.fire({
    title:
      index === undefined ? "Tambah Prestasi" : `Edit Prestasi #${index + 1}`,

    html: `
      ${modalHtml(
        [
          modalInput("achievement-title", "Judul", initialValue.title, "Judul prestasi"),
          modalInput("achievement-year", "Tahun", initialValue.year, "2026"),
          modalInput("achievement-category", "Kategori", initialValue.category, "Kategori"),
          modalInput("achievement-image", "URL Gambar", initialValue.img, "https://..."),
          modalTextarea("achievement-desc", "Deskripsi", initialValue.desc, "Deskripsi prestasi"),
        ].join("")
      )}

      <div style="margin-top:20px; display:flex; justify-content:flex-end;">
        <button id="btn-save-achievement" class="admin-button">
          Simpan Prestasi
        </button>
      </div>
    `,

    width: 900,
    showCancelButton: true,
    showConfirmButton: false,
    cancelButtonText: "Batal",
    customClass: {
      popup: "student-swal-popup",
      cancelButton: "student-swal-cancel",
    },
    buttonsStyling: false,

    didOpen: () => {
      const btn = document.getElementById("btn-save-achievement");

      if (btn) {
        btn.addEventListener("click", async () => {
          const nextItem: AchievementItem = {
            ...initialValue,
            title: fieldValue("achievement-title"),
            year: fieldValue("achievement-year"),
            category: fieldValue("achievement-category"),
            img: fieldValue("achievement-image"),
            desc: fieldValue("achievement-desc"),
          };

          // ✅ validasi
          if (!nextItem.title || !nextItem.desc) {
            Swal.showValidationMessage(
              "Judul dan deskripsi prestasi wajib diisi."
            );
            return;
          }

          // ✅ update state
          setContent((prev) => ({
            ...prev,
            achievements:
              index === undefined
                ? [...prev.achievements, nextItem]
                : prev.achievements.map((item, i) =>
                    i === index ? nextItem : item
                  ),
          }));

          // 🔥 langsung save ke API
          await saveSection("achievements");

          Swal.close();
        });
      }
    },
  });
};

  const openExtracurricularModal = async (
    initialValue: ExtracurricularGroup,
    index?: number,
  ) => {
    const result = await Swal.fire<ExtracurricularGroup>({
      title:
        index === undefined
          ? "Tambah Ekstrakurikuler"
          : `Edit Grup #${index + 1}`,
      html: modalHtml(
        [
          modalInput(
            "ekskul-title",
            "Nama Grup",
            initialValue.title,
            "Nama grup",
          ),
          modalInput(
            "ekskul-icon",
            "Icon Bootstrap",
            initialValue.icon,
            "bi-stars",
          ),
          modalInput(
            "ekskul-gradient",
            "Gradient CSS",
            initialValue.gradient,
            "linear-gradient(...)",
          ),
          modalTextarea(
            "ekskul-items",
            "Daftar Item",
            initialValue.items.join("\n"),
            "Satu baris satu item",
          ),
        ].join(""),
      ),
      width: 900,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: "Batal",
      customClass: {
        popup: "student-swal-popup",
        confirmButton: "student-swal-confirm",
        cancelButton: "student-swal-cancel",
      },
      buttonsStyling: false,
      preConfirm: () => {
        const nextItem: ExtracurricularGroup = {
          ...initialValue,
          title: fieldValue("ekskul-title"),
          icon: fieldValue("ekskul-icon"),
          gradient: fieldValue("ekskul-gradient"),
          items: listValue("ekskul-items"),
        };

        if (!nextItem.title) {
          Swal.showValidationMessage("Nama grup wajib diisi.");
          return;
        }

        return nextItem;
      },
    });

    if (!result.isConfirmed || !result.value) return;
    setContent((prev) => ({
      ...prev,
      extracurriculars:
        index === undefined
          ? [...prev.extracurriculars, result.value!]
          : prev.extracurriculars.map((item, itemIndex) =>
              itemIndex === index ? result.value! : item,
            ),
    }));
  };

  const confirmRemove = async (
    section:
      | "promotions"
      | "gallery"
      | "activities"
      | "achievements"
      | "extracurriculars",
    index: number,
    label: string,
  ) => {
    const result = await Swal.fire({
      title: `Hapus ${label}?`,
      text: "Data ini akan dihapus dari draft konten.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "student-swal-danger",
        cancelButton: "student-swal-cancel",
      },
      buttonsStyling: false,
    });

    if (!result.isConfirmed) return;

    setContent((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const renderBannerSection = () => (
    <>
      <div className="content-editor__topbar">
        <h3>Banner Website</h3>
        <button
          type="button"
          className="admin-button"
          onClick={openBannerModal}
        >
          Edit Banner
        </button>
      </div>
      {modalSummary(
        content.banner.title,
        content.banner.text,
        content.banner.image,
      )}
    </>
  );

  const renderAboutSection = () => (
    <>
      <div className="content-editor__topbar">
        <h3>Tentang Sekolah</h3>
        <button type="button" className="admin-button" onClick={openAboutModal}>
          Edit Tentang
        </button>
      </div>
      {modalSummary(
        content.about.title,
        content.about.description,
        content.about.image,
      )}
    </>
  );

  const renderListSection = <
    T extends
      | PromoItem
      | GalleryItem
      | ActivityItem
      | AchievementItem
      | ExtracurricularGroup,
  >(
    title: string,
    addLabel: string,
    items: T[],
    onAdd: () => void,
    onEdit: (item: T, index: number) => void,
    onRemove: (item: T, index: number) => void,
    getTitle: (item: T, index: number) => string,
    getDescription: (item: T) => string,
    getImage?: (item: T) => string | undefined,
    getAccent?: (item: T) => string | undefined,
  ) => (
    <>
      <div className="content-editor__topbar">
        <h3>{title}</h3>
        <button type="button" className="admin-button" onClick={onAdd}>
          {addLabel}
        </button>
      </div>

      <div className="content-card-list">
        {items.map((item, index) => (
          <article key={item.id} className="content-item-card">
            <div className="content-item-card__header">
              <strong>{getTitle(item, index)}</strong>
              <div className="student-table__actions">
                <button
                  type="button"
                  className="content-tabs__item"
                  onClick={() => onEdit(item, index)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="content-item-card__delete"
                  onClick={() => onRemove(item, index)}
                >
                  Hapus
                </button>
              </div>
            </div>

            {getImage?.(item) ? (
              <div className="content-summary-image">
                <img src={getImage(item)} alt={getTitle(item, index)} />
              </div>
            ) : null}

            {getAccent?.(item) ? (
              <div className="content-summary-accent">
                <span>Accent</span>
                <code>{getAccent(item)}</code>
              </div>
            ) : null}

            <p>{getDescription(item)}</p>
          </article>
        ))}
      </div>
    </>
  );

  const renderEditor = () => {
    if (activeTab === "banner") {
      return renderBannerSection();
    }

    if (activeTab === "promotions") {
      return renderListSection(
        "Data Iklan / Promo",
        "Tambah Iklan",
        content.promotions,
        () => void openPromoModal(createPromo()),
        (item, index) => void openPromoModal(item, index),
        (item, index) =>
          void confirmRemove(
            "promotions",
            index,
            item.title || `Iklan #${index + 1}`,
          ),
        (item, index) => item.title || `Iklan #${index + 1}`,
        (item) => item.text || item.tag || "Belum ada deskripsi.",
        (item) => item.image,
        (item) => item.accent,
      );
    }

    if (activeTab === "gallery") {
      return renderListSection(
        "Data Gallery",
        "Tambah Foto",
        content.gallery,
        () => void openGalleryModal(createGallery()),
        (item, index) => void openGalleryModal(item, index),
        (item, index) =>
          void confirmRemove(
            "gallery",
            index,
            item.title || `Foto #${index + 1}`,
          ),
        (item, index) => item.title || `Foto #${index + 1}`,
        (item) => item.caption || item.category || "Belum ada caption.",
        (item) => item.image,
      );
    }

    if (activeTab === "activities") {
      return renderListSection(
        "Data Kegiatan",
        "Tambah Kegiatan",
        content.activities,
        () => void openActivityModal(createActivity()),
        (item, index) => void openActivityModal(item, index),
        (item, index) =>
          void confirmRemove(
            "activities",
            index,
            item.title || `Kegiatan #${index + 1}`,
          ),
        (item, index) => item.title || `Kegiatan #${index + 1}`,
        (item) => item.desc || item.date || "Belum ada deskripsi.",
        (item) => item.image,
      );
    }

    if (activeTab === "achievements") {
      return renderListSection(
        "Data Prestasi",
        "Tambah Prestasi",
        content.achievements,
        () => void openAchievementModal(createAchievement()),
        (item, index) => void openAchievementModal(item, index),
        (item, index) =>
          void confirmRemove(
            "achievements",
            index,
            item.title || `Prestasi #${index + 1}`,
          ),
        (item, index) => item.title || `Prestasi #${index + 1}`,
        (item) => item.desc || item.year || "Belum ada deskripsi.",
        (item) => item.img,
      );
    }

    if (activeTab === "about") {
      return renderAboutSection();
    }

    return renderListSection(
      "Data Ekstrakurikuler",
      "Tambah Grup",
      content.extracurriculars,
      () => void openExtracurricularModal(createExtracurricular()),
      (item, index) => void openExtracurricularModal(item, index),
      (item, index) =>
        void confirmRemove(
          "extracurriculars",
          index,
          item.title || `Grup #${index + 1}`,
        ),
      (item, index) => item.title || `Grup #${index + 1}`,
      (item) => item.items.join(", ") || "Belum ada item.",
      undefined,
      (item) => item.gradient,
    );
  };

  const activeLabel =
    contentTabs.find((item) => item.key === activeTab)?.label ?? activeTab;

  return (
    <section className="content-manager">
      <div className="content-manager__header">
        <div>
          <div className="admin-badge">CRUD Konten Website</div>
          <h2>Kelola konten landing page dari admin</h2>
          <p>
            Semua aksi tambah, edit, hapus, dan simpan sekarang dibuat lebih
            ringkas dengan popup SweetAlert2 seperti modul data siswa.
          </p>
        </div>
      </div>

      <div className="content-tabs">
        {contentTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`content-tabs__item ${activeTab === tab.key ? "content-tabs__item--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {statusMessage ? (
        <div className="content-status content-status--success">
          {statusMessage}
        </div>
      ) : null}
      {statusError ? (
        <div className="content-status content-status--error">
          {statusError}
        </div>
      ) : null}

      {loading ? (
        <div className="admin-card">
          <p>Memuat data konten dari API...</p>
        </div>
      ) : (
        <>
          <div className="content-editor">{renderEditor()}</div>

          <div className="content-savebar">
            <div>
              <strong>Simpan perubahan {activeLabel}</strong>
              <p>
                Setelah edit selesai, kirim data section ini ke backend API.
              </p>
            </div>

            <button
              type="button"
              className="admin-button"
              onClick={() => void saveSection(activeTab)}
              disabled={savingSection === activeTab}
            >
              {savingSection === activeTab
                ? "Menyimpan..."
                : `Simpan ${activeLabel}`}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default ContentManager;
