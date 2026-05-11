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

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

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
      title: "Edit Konfigurasi Banner Utama",
      html: `
      <div style="text-align: left; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${modalInput(
              "banner-title",
              "Judul Banner",
              banner.title,
              "Masukkan judul utama banner...",
            )}

            ${modalTextarea(
              "banner-text",
              "Deskripsi / Sub-judul",
              banner.text,
              "Tuliskan pesan singkat yang menarik...",
              true, // full width textarea
            )}
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="font-weight: 600; font-size: 13px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">Gambar Latar Banner</label>
            <label id="banner-upload-container" style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border: 2px dashed #cbd5e1;
              border-radius: 16px;
              height: 225px; /* Sedikit lebih tinggi untuk proporsi banner */
              cursor: pointer;
              overflow: hidden;
              background: #f8fafc;
              position: relative;
              transition: border-color 0.2s ease;
            ">
              <input id="banner-image-file" type="file" accept="image/*" hidden />
              <div id="banner-upload-preview" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                ${
                  banner.image
                    ? `<img src="${banner.image}" style="width:100%; height:100%; object-fit:cover;" />`
                    : `
                  <div style="text-align: center; color: #94a3b8;">
                    <div style="font-size: 36px; margin-bottom: 8px;">🖼️</div>
                    <div style="font-size: 14px; font-weight: 500;">Klik untuk Upload Gambar</div>
                    <div style="font-size: 11px; opacity: 0.8; margin-top: 4px;">Disarankan: Rasio Widescreen (misal 1920x1080)</div>
                  </div>
                  `
                }
              </div>
            </label>
          </div>
        </div>

        <div style="background: #f1f5f9; padding: 20px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="font-weight: 700; font-size: 14px; color: #1e2937; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <span>🔗</span> Konfigurasi Tombol (Call to Action)
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div style="display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <div style="font-weight: 700; font-size: 12px; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px;">Tombol Utama (Primary)</div>
              ${modalInput("banner-primary-label", "Label Tombol", banner.primaryLabel, "Contoh: Daftar Sekarang")}
              ${modalInput("banner-primary-href", "Link Target", banner.primaryHref, "#")}
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px; padding: 16px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
              <div style="font-weight: 700; font-size: 12px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">Tombol Kedua (Secondary)</div>
              ${modalInput("banner-secondary-label", "Label Tombol", banner.secondaryLabel, "Contoh: Pelajari Lebih Lanjut")}
              ${modalInput("banner-secondary-href", "Link Target", banner.secondaryHref, "#")}
            </div>
          </div>
        </div>

        <div style="margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
          <button id="btn-cancel-modal" style="
            background: #ffffff; color: #64748b; padding: 12px 24px; border: 1px solid #e2e8f0;
            border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background 0.2s;">
            Batal
          </button>
          <button id="btn-save-banner" style="
            background: linear-gradient(135deg, #2563eb, #1e40af); color: white; padding: 12px 32px;
            border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); transition: transform 0.1s ease, box-shadow 0.2s;">
            Simpan Banner
          </button>
        </div>
      </div>
    `,
      width: 900, // Lebar modal disesuaikan
      padding: "2rem",
      showConfirmButton: false, // Matikan tombol bawaan Swal
      showCancelButton: false,
      customClass: {
        popup: "modern-radius-popup", // Pastikan CSS ini ada jika ingin radius modal global
      },
      didOpen: () => {
        const btnSave = document.getElementById("btn-save-banner");
        const btnCancel = document.getElementById("btn-cancel-modal");
        const fileInput = document.getElementById(
          "banner-image-file",
        ) as HTMLInputElement;
        const previewContainer = document.getElementById(
          "banner-upload-preview",
        );
        const uploadContainer = document.getElementById(
          "banner-upload-container",
        );

        // --- LOGIC: Batal ---
        btnCancel?.addEventListener("click", () => Swal.close());

        // --- LOGIC: Hover Effect Manual (karena tanpa CSS) ---
        uploadContainer?.addEventListener("mouseover", () => {
          uploadContainer.style.borderColor = "#2563eb";
          uploadContainer.style.background = "#eff6ff";
        });
        uploadContainer?.addEventListener("mouseout", () => {
          uploadContainer.style.borderColor = "#cbd5e1";
          uploadContainer.style.background = "#f8fafc";
        });

        // --- LOGIC: Preview Gambar Instan ---
        fileInput?.addEventListener("change", () => {
          const file = fileInput.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              if (previewContainer) {
                previewContainer.innerHTML = `<img src="${reader.result}" style="width:100%;height:100%;object-fit:cover; animation: fadeIn 0.3s;" />`;
              }
            };
            reader.readAsDataURL(file);
          }
        });

        // --- LOGIC: Simpan Data ---
        btnSave?.addEventListener("click", async () => {
          const title = fieldValue("banner-title");
          const text = fieldValue("banner-text");

          // Validasi Dasar
          if (!title || !text) {
            Swal.showValidationMessage(
              "Judul dan Deskripsi banner wajib diisi!",
            );
            return;
          }

          // Tampilkan loading di tombol
          btnSave.innerText = "Menyimpan...";
          btnSave.style.opacity = "0.7";
          btnSave.setAttribute("disabled", "true");

          try {
            // Proses Gambar (Jika ada file baru diupload)
            let imageValue = banner.image; // Default pakai gambar lama
            if (fileInput.files?.[0]) {
              const file = fileInput.files[0];
              // Konversi File ke Base64 (Promise)
              imageValue = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = (error) => reject(error);
              });
            }

            // Susun Objek Data Baru
            const nextBanner = {
              title: title,
              image: imageValue, // Teks Base64
              text: text,
              primaryLabel: fieldValue("banner-primary-label"),
              primaryHref: fieldValue("banner-primary-href"),
              secondaryLabel: fieldValue("banner-secondary-label"),
              secondaryHref: fieldValue("banner-secondary-href"),
            };

            // 1. Update State React (Draft)
            setContent((prev) => ({
              ...prev,
              banner: nextBanner,
            }));

            // 2. 🔥 Kirim ke API (Permanen)
            await saveSection("banner");

            // Tutup Modal
            Swal.close();
          } catch (error) {
            console.error("Gagal menyimpan banner:", error);
            Swal.showValidationMessage(
              "Terjadi kesalahan saat memproses gambar.",
            );
            // Kembalikan status tombol
            btnSave.innerText = "Simpan Banner";
            btnSave.style.opacity = "1";
            btnSave.removeAttribute("disabled");
          }
        });
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
      title:
        index === undefined
          ? "Tambah Iklan / Promo"
          : `Edit Iklan #${index + 1}`,
      html: `
      <div style="text-align: left; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
        
        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; margin-bottom: 20px;">
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
             ${modalInput("promo-title", "Judul Utama", initialValue.title, "Contoh: Promo Ramadhan")}
             ${modalInput("promo-tag", "Label / Tag", initialValue.tag, "Contoh: Terbatas")}
             
             <div>
                <label style="display: block; font-weight: 600; font-size: 13px; color: #4b5563; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Warna Aksen</label>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; background: #f3f4f6; padding: 12px; border-radius: 12px; border: 1px solid #e5e7eb;">
                  ${[
                    "#0f766e",
                    "#2563eb",
                    "#9333ea",
                    "#dc2626",
                    "#ea580c",
                    "#16a34a",
                    "#0891b2",
                    "#be123c",
                  ]
                    .map(
                      (color) => `
                    <div class="color-item" data-color="${color}" 
                         style="width: 34px; height: 34px; border-radius: 10px; background: ${color}; 
                         cursor: pointer; border: 3px solid ${initialValue.accent === color ? "#ffffff" : "transparent"}; 
                         box-shadow: ${initialValue.accent === color ? "0 0 0 2px " + color : "0 2px 4px rgba(0,0,0,0.1)"};
                         transition: all 0.2s ease;">
                    </div>
                  `,
                    )
                    .join("")}
                </div>
             </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="font-weight: 600; font-size: 13px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">Visual Iklan</label>
            <label id="upload-container" style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border: 2px dashed #cbd5e1;
              border-radius: 16px;
              height: 210px;
              cursor: pointer;
              overflow: hidden;
              background: #f8fafc;
              position: relative;
            ">
              <input id="promo-image-file" type="file" accept="image/*" hidden />
              <div id="upload-preview" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                ${
                  initialValue.image
                    ? `<img src="${initialValue.image}" style="width:100%; height:100%; object-fit:cover;" />`
                    : `
                  <div style="text-align: center; color: #94a3b8;">
                    <div style="font-size: 32px; margin-bottom: 4px;">🖼️</div>
                    <div style="font-size: 14px; font-weight: 500;">Klik untuk Upload</div>
                    <div style="font-size: 11px; opacity: 0.7;">Format: JPG, PNG, WEBP</div>
                  </div>
                  `
                }
              </div>
            </label>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
           ${modalTextarea("promo-text", "Deskripsi Detail", initialValue.text, "Jelaskan detail promo...")}
           
           <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              ${modalInput("promo-button-text", "Teks Tombol Utama", initialValue.buttonText, "Daftar Sekarang")}
              ${modalInput("promo-detail-text", "Teks Tombol Detail", initialValue.detailText, "Pelajari Lebih Lanjut")}
           </div>
        </div>

        <div style="margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px;">
          <button id="btn-cancel-modal" style="
            background: #ffffff; color: #64748b; padding: 12px 24px; border: 1px solid #e2e8f0;
            border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer;">
            Batal
          </button>
          <button id="btn-save-promo" style="
            background: #2563eb; color: white; padding: 12px 32px;
            border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
            Simpan Promo
          </button>
        </div>
      </div>
    `,
      width: 800,
      padding: "2rem",
      showConfirmButton: false,
      showCancelButton: false,
      customClass: {
        popup: "border-radius-24", // Hanya untuk radius, style lainnya sudah inline
      },
      didOpen: () => {
        let selectedColor = initialValue.accent || "#0f766e";

        // --- COLOR PICKER LOGIC ---
        const colorItems = document.querySelectorAll(".color-item");
        colorItems.forEach((item) => {
          const el = item as HTMLElement;
          el.addEventListener("click", () => {
            colorItems.forEach((btn) => {
              (btn as HTMLElement).style.border = "3px solid transparent";
              (btn as HTMLElement).style.boxShadow =
                "0 2px 4px rgba(0,0,0,0.1)";
            });
            selectedColor = el.getAttribute("data-color") || "#0f766e";
            el.style.border = "3px solid white";
            el.style.boxShadow = `0 0 0 2px ${selectedColor}`;
          });
        });

        // --- IMAGE PREVIEW LOGIC ---
        const input = document.getElementById(
          "promo-image-file",
        ) as HTMLInputElement;
        const preview = document.getElementById("upload-preview");

        input?.addEventListener("change", () => {
          const file = input.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              if (preview) {
                preview.innerHTML = `<img src="${reader.result}" style="width:100%;height:100%;object-fit:cover;" />`;
              }
            };
            reader.readAsDataURL(file);
          }
        });

        // --- BUTTON LOGIC ---
        document
          .getElementById("btn-cancel-modal")
          ?.addEventListener("click", () => Swal.close());

        const btnSave = document.getElementById("btn-save-promo");
        btnSave?.addEventListener("click", async () => {
          const title = fieldValue("promo-title");
          const text = fieldValue("promo-text");

          if (!title || !text) {
            Swal.showValidationMessage(
              "Judul dan Deskripsi tidak boleh kosong",
            );
            return;
          }

          let imageValue = initialValue.image;
          if (input.files?.[0]) {
            const file = input.files[0];
            imageValue = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
          }

          const nextPromo: PromoItem = {
            ...(index === undefined
              ? { id: crypto.randomUUID() }
              : initialValue),
            title,
            tag: fieldValue("promo-tag"),
            accent: selectedColor,
            image: imageValue,
            text,
            buttonText: fieldValue("promo-button-text"),
            detailText: fieldValue("promo-detail-text"),
          };

          setContent((prev) => ({
            ...prev,
            promotions:
              index === undefined
                ? [...prev.promotions, nextPromo]
                : prev.promotions.map((item, i) =>
                    i === index ? nextPromo : item,
                  ),
          }));

          await saveSection("promotions");
          Swal.close();
        });
      },
    });
  };

  const openGalleryModal = async (
    initialValue: GalleryItem,
    index?: number,
  ) => {
    await Swal.fire({
      title:
        index === undefined ? "Tambah Foto Gallery" : `Edit Foto #${index + 1}`,
      html: `
      <div style="text-align: left; font-family: 'Segoe UI', Roboto, sans-serif; color: #1f2937;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${modalInput(
              "gallery-title",
              "Judul Foto",
              initialValue.title,
              "Masukkan judul foto...",
            )}

            ${modalInput(
              "gallery-category",
              "Kategori",
              initialValue.category,
              "Contoh: Kegiatan, Fasilitas, Prestasi",
            )}

            ${modalTextarea(
              "gallery-caption",
              "Caption / Keterangan",
              initialValue.caption,
              "Tuliskan deskripsi singkat foto ini...",
              true,
            )}
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="font-weight: 600; font-size: 13px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">File Gambar</label>
            <label id="gallery-upload-container" style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border: 2px dashed #cbd5e1;
              border-radius: 16px;
              height: 250px;
              cursor: pointer;
              overflow: hidden;
              background: #f8fafc;
              position: relative;
              transition: all 0.2s ease;
            ">
              <input id="gallery-image-file" type="file" accept="image/*" hidden />
              <div id="gallery-upload-preview" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                ${
                  initialValue.image
                    ? `<img src="${initialValue.image}" style="width:100%; height:100%; object-fit:cover;" />`
                    : `
                  <div style="text-align: center; color: #94a3b8;">
                    <div style="font-size: 40px; margin-bottom: 8px;">📸</div>
                    <div style="font-size: 14px; font-weight: 500;">Pilih Foto Gallery</div>
                    <div style="font-size: 11px; opacity: 0.8; margin-top: 4px;">Format: JPG, PNG atau WEBP</div>
                  </div>
                  `
                }
              </div>
            </label>
          </div>
        </div>

        <div style="margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
          <button id="btn-cancel-gallery" style="
            background: #ffffff; color: #64748b; padding: 12px 24px; border: 1px solid #e2e8f0;
            border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer;">
            Batal
          </button>
          <button id="btn-save-gallery" style="
            background: linear-gradient(135deg, #0f766e, #134e4a); color: white; padding: 12px 32px;
            border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer;
            box-shadow: 0 4px 12px rgba(15, 118, 110, 0.2);">
            Simpan Foto
          </button>
        </div>
      </div>
    `,
      width: 850,
      padding: "2rem",
      showConfirmButton: false,
      showCancelButton: false,
      didOpen: () => {
        const btnSave = document.getElementById("btn-save-gallery");
        const btnCancel = document.getElementById("btn-cancel-gallery");
        const fileInput = document.getElementById(
          "gallery-image-file",
        ) as HTMLInputElement;
        const preview = document.getElementById("gallery-upload-preview");
        const uploadBox = document.getElementById("gallery-upload-container");

        // Batal
        btnCancel?.addEventListener("click", () => Swal.close());

        // Hover Effect Manual
        uploadBox?.addEventListener("mouseover", () => {
          uploadBox.style.borderColor = "#0f766e";
          uploadBox.style.background = "#f0fdfa";
        });
        uploadBox?.addEventListener("mouseout", () => {
          uploadBox.style.borderColor = "#cbd5e1";
          uploadBox.style.background = "#f8fafc";
        });

        // Preview Logic
        fileInput?.addEventListener("change", () => {
          const file = fileInput.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              if (preview) {
                preview.innerHTML = `<img src="${reader.result}" style="width:100%;height:100%;object-fit:cover; animation: fadeIn 0.3s;" />`;
              }
            };
            reader.readAsDataURL(file);
          }
        });

        // Simpan Logic
        btnSave?.addEventListener("click", async () => {
          const title = fieldValue("gallery-title");
          const category = fieldValue("gallery-category");
          const caption = fieldValue("gallery-caption");

          if (!title) {
            Swal.showValidationMessage("Judul foto wajib diisi");
            return;
          }

          try {
            let imageValue = initialValue.image;
            if (fileInput.files?.[0]) {
              const file = fileInput.files[0];
              imageValue = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
              });
            }

            const nextItem: GalleryItem = {
              ...initialValue,
              title,
              category,
              caption,
              image: imageValue,
            };

            setContent((prev) => ({
              ...prev,
              gallery:
                index === undefined
                  ? [...prev.gallery, nextItem]
                  : prev.gallery.map((item, i) =>
                      i === index ? nextItem : item,
                    ),
            }));

            await saveSection("gallery");
            Swal.close();
          } catch (err) {
            Swal.showValidationMessage("Gagal memproses gambar");
          }
        });
      },
    });
  };

  const openActivityModal = async (
    initialValue: ActivityItem,
    index?: number,
  ) => {
    await Swal.fire({
      title:
        index === undefined
          ? "Tambah Kegiatan Baru"
          : `Edit Kegiatan #${index + 1}`,
      html: `
      <div style="text-align: left; font-family: 'Segoe UI', Roboto, sans-serif; color: #1f2937;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${modalInput(
              "activity-title",
              "Nama Kegiatan",
              initialValue.title,
              "Contoh: Workshop UI/UX",
            )}

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              ${modalInput(
                "activity-category",
                "Kategori",
                initialValue.category,
                "Edukasi / Sosial",
              )}
              
              <div style="display: flex; flex-direction: column; gap: 4px;">
                 <label style="font-weight: 600; font-size: 13px; color: #4b5563;">Tanggal</label>
                 <input id="activity-date" type="date" value="${initialValue.date || ""}" 
                  style="padding: 10px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; transition: border 0.2s;"
                  onfocus="this.style.borderColor='#9333ea'" onblur="this.style.borderColor='#e2e8f0'" />
              </div>
            </div>

            ${modalTextarea(
              "activity-desc",
              "Deskripsi Lengkap",
              initialValue.desc,
              "Jelaskan detail agenda kegiatan...",
              true,
            )}
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="font-weight: 600; font-size: 13px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">Thumbnail Kegiatan</label>
            <label id="activity-upload-container" style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border: 2px dashed #cbd5e1;
              border-radius: 16px;
              height: 275px;
              cursor: pointer;
              overflow: hidden;
              background: #f8fafc;
              position: relative;
              transition: all 0.2s ease;
            ">
              <input id="activity-image-file" type="file" accept="image/*" hidden />
              <div id="activity-upload-preview" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                ${
                  initialValue.image
                    ? `<img src="${initialValue.image}" style="width:100%; height:100%; object-fit:cover;" />`
                    : `
                  <div style="text-align: center; color: #94a3b8;">
                    <div style="font-size: 40px; margin-bottom: 8px;">🗓️</div>
                    <div style="font-size: 14px; font-weight: 500;">Klik untuk Upload Foto</div>
                    <div style="font-size: 11px; opacity: 0.8; margin-top: 4px;">Disarankan rasio 4:3 atau 16:9</div>
                  </div>
                  `
                }
              </div>
            </label>
          </div>
        </div>

        <div style="margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
          <button id="btn-cancel-activity" style="
            background: white; color: #64748b; padding: 12px 24px; border: 1px solid #e2e8f0;
            border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer;">
            Batal
          </button>
          <button id="btn-save-activity" style="
            background: linear-gradient(135deg, #9333ea, #7e22ce); color: white; padding: 12px 32px;
            border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer;
            box-shadow: 0 4px 12px rgba(147, 51, 234, 0.25);">
            Simpan Kegiatan
          </button>
        </div>
      </div>
    `,
      width: 850,
      padding: "2rem",
      showConfirmButton: false,
      showCancelButton: false,
      didOpen: () => {
        const btnSave = document.getElementById("btn-save-activity");
        const btnCancel = document.getElementById("btn-cancel-activity");
        const fileInput = document.getElementById(
          "activity-image-file",
        ) as HTMLInputElement;
        const preview = document.getElementById("activity-upload-preview");
        const uploadBox = document.getElementById("activity-upload-container");

        btnCancel?.addEventListener("click", () => Swal.close());

        // Hover Effect
        uploadBox?.addEventListener("mouseover", () => {
          uploadBox.style.borderColor = "#9333ea";
          uploadBox.style.background = "#f5f3ff";
        });
        uploadBox?.addEventListener("mouseout", () => {
          uploadBox.style.borderColor = "#cbd5e1";
          uploadBox.style.background = "#f8fafc";
        });

        // Preview Image
        fileInput?.addEventListener("change", () => {
          const file = fileInput.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              if (preview) {
                preview.innerHTML = `<img src="${reader.result}" style="width:100%;height:100%;object-fit:cover;" />`;
              }
            };
            reader.readAsDataURL(file);
          }
        });

        // Save Logic
        btnSave?.addEventListener("click", async () => {
          const title = fieldValue("activity-title");
          const desc = fieldValue("activity-desc");
          const date = (
            document.getElementById("activity-date") as HTMLInputElement
          ).value;

          if (!title || !desc) {
            Swal.showValidationMessage("Judul dan Deskripsi wajib diisi");
            return;
          }

          try {
            let imageValue = initialValue.image;
            if (fileInput.files?.[0]) {
              const file = fileInput.files[0];
              imageValue = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
              });
            }

            const nextItem: ActivityItem = {
              ...initialValue,
              title,
              category: fieldValue("activity-category"),
              date,
              desc,
              image: imageValue,
            };

            setContent((prev) => ({
              ...prev,
              activities:
                index === undefined
                  ? [...prev.activities, nextItem]
                  : prev.activities.map((item, i) =>
                      i === index ? nextItem : item,
                    ),
            }));

            await saveSection("activities");
            Swal.close();
          } catch (err) {
            Swal.showValidationMessage("Gagal upload gambar");
          }
        });
      },
    });
  };
  const openAchievementModal = async (
  initialValue: AchievementItem,
  index?: number,
) => {
  await Swal.fire({
    title: index === undefined ? "Tambah Prestasi" : `Edit Prestasi #${index + 1}`,
    html: `
      <div style="text-align: left; font-family: 'Segoe UI', Roboto, sans-serif; color: #1f2937;">
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${modalInput(
              "achievement-title",
              "Judul Prestasi",
              initialValue.title,
              "Contoh: Juara 1 Lomba Web Design"
            )}

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              ${modalInput(
                "achievement-year",
                "Tahun",
                initialValue.year,
                "2026"
              )}
              ${modalInput(
                "achievement-category",
                "Kategori",
                initialValue.category,
                "Akademik / Non-Akademik"
              )}
            </div>

            ${modalTextarea(
              "achievement-desc",
              "Deskripsi Singkat",
              initialValue.desc,
              "Jelaskan detail pencapaian ini...",
              true
            )}
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <label style="font-weight: 600; font-size: 13px; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">Foto Sertifikat / Dokumentasi</label>
            <label id="achievement-upload-container" style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border: 2px dashed #cbd5e1;
              border-radius: 16px;
              height: 275px;
              cursor: pointer;
              overflow: hidden;
              background: #f8fafc;
              position: relative;
              transition: all 0.2s ease;
            ">
              <input id="achievement-image-file" type="file" accept="image/*" hidden />
              <div id="achievement-upload-preview" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                ${initialValue.img 
                  ? `<img src="${initialValue.img}" style="width:100%; height:100%; object-fit:cover;" />` 
                  : `
                  <div style="text-align: center; color: #94a3b8;">
                    <div style="font-size: 40px; margin-bottom: 8px;">🏆</div>
                    <div style="font-size: 14px; font-weight: 500;">Klik untuk Upload Foto</div>
                    <div style="font-size: 11px; opacity: 0.8; margin-top: 4px;">PNG, JPG (Max 2MB)</div>
                  </div>
                  `
                }
              </div>
            </label>
          </div>
        </div>

        <div style="margin-top: 32px; display: flex; justify-content: flex-end; gap: 12px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
          <button id="btn-cancel-achievement" style="
            background: #ffffff; color: #64748b; padding: 12px 24px; border: 1px solid #e2e8f0;
            border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer;">
            Batal
          </button>
          <button id="btn-save-achievement" style="
            background: linear-gradient(135deg, #d97706, #b45309); color: white; padding: 12px 32px;
            border: none; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer;
            box-shadow: 0 4px 12px rgba(217, 119, 6, 0.25);">
            Simpan Prestasi
          </button>
        </div>
      </div>
    `,
    width: 850,
    padding: '2rem',
    showConfirmButton: false,
    showCancelButton: false,
    didOpen: () => {
      const btnSave = document.getElementById("btn-save-achievement");
      const btnCancel = document.getElementById("btn-cancel-achievement");
      const fileInput = document.getElementById("achievement-image-file") as HTMLInputElement;
      const preview = document.getElementById("achievement-upload-preview");
      const uploadBox = document.getElementById("achievement-upload-container");

      // Logika Batal
      btnCancel?.addEventListener("click", () => Swal.close());

      // Efek Hover pada Box Upload
      uploadBox?.addEventListener("mouseover", () => {
        uploadBox.style.borderColor = "#d97706";
        uploadBox.style.background = "#fffbeb";
      });
      uploadBox?.addEventListener("mouseout", () => {
        uploadBox.style.borderColor = "#cbd5e1";
        uploadBox.style.background = "#f8fafc";
      });

      // Preview Gambar Instan
      fileInput?.addEventListener("change", () => {
        const file = fileInput.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            if (preview) {
              preview.innerHTML = `<img src="${reader.result}" style="width:100%;height:100%;object-fit:cover;" />`;
            }
          };
          reader.readAsDataURL(file);
        }
      });

      // Simpan Data
      btnSave?.addEventListener("click", async () => {
        const title = fieldValue("achievement-title");
        const desc = fieldValue("achievement-desc");

        if (!title || !desc) {
          Swal.showValidationMessage("Judul dan deskripsi wajib diisi");
          return;
        }

        try {
          let imageValue = initialValue.img;
          if (fileInput.files?.[0]) {
            const file = fileInput.files[0];
            imageValue = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
          }

          const nextItem: AchievementItem = {
            ...initialValue,
            title,
            year: fieldValue("achievement-year"),
            category: fieldValue("achievement-category"),
            desc,
            img: imageValue,
          };

          setContent((prev) => ({
            ...prev,
            achievements: index === undefined
              ? [...prev.achievements, nextItem]
              : prev.achievements.map((item, i) => i === index ? nextItem : item),
          }));

          await saveSection("achievements");
          Swal.close();
        } catch (err) {
          Swal.showValidationMessage("Gagal memproses gambar");
        }
      });
    }
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
