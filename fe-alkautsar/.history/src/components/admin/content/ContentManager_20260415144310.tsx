import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import type {
  ActivityItem,
  BannerContent,
  HomeContent,
  PromoItem,
  GalleryItem,
} from "../../../data/homeContent";
import { defaultHomeContent } from "../../../data/homeContent";
import { getHomeContent, saveContentSection } from "../../../services/api";
import { createActivity, createPromo, createGallery } from "./helpers";

const fieldValue = (id: string) =>
  (document.getElementById(id) as HTMLInputElement | null)?.value.trim() ?? "";

const modalHtml = (fields: string) =>
  `<div style="display:grid;gap:10px">${fields}</div>`;

const input = (id: string, label: string, value = "") => `
  <label>
    <div>${label}</div>
    <input id="${id}" class="swal2-input" value="${value}" />
  </label>
`;

const textarea = (id: string, label: string, value = "") => `
  <label>
    <div>${label}</div>
    <textarea id="${id}" class="swal2-textarea">${value}</textarea>
  </label>
`;

const ContentManager = () => {
  const [content, setContent] = useState<HomeContent>(defaultHomeContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await getHomeContent();
      setContent(res);
      setLoading(false);
    })();
  }, []);

  // =========================
  // 🔥 BANNER AUTO SAVE
  // =========================
  const openBanner = async () => {
    const b = content.banner;

    const result = await Swal.fire<BannerContent>({
      title: "Edit Banner",
      html: modalHtml([
        input("title", "Judul", b.title),
        input("image", "Image URL", b.image),
        textarea("text", "Deskripsi", b.text),
      ].join("")),
      showCancelButton: true,
      confirmButtonText: "Simpan",
    });

    if (!result.isConfirmed) return;

    const newData = {
      title: fieldValue("title"),
      image: fieldValue("image"),
      text: fieldValue("text"),
      primaryLabel: b.primaryLabel,
      primaryHref: b.primaryHref,
      secondaryLabel: b.secondaryLabel,
      secondaryHref: b.secondaryHref,
    };

    setContent((p) => ({ ...p, banner: newData }));

    await saveContentSection("banner", newData);

    Swal.fire("Berhasil", "Banner disimpan", "success");
  };

  // =========================
  // 🔥 ACTIVITIES AUTO SAVE
  // =========================
  const openActivity = async (item: ActivityItem, index?: number) => {
    const result = await Swal.fire<ActivityItem>({
      title: index === undefined ? "Tambah Kegiatan" : "Edit Kegiatan",
      html: modalHtml([
        input("title", "Judul", item.title),
        input("category", "Kategori", item.category),
        input("date", "Tanggal", item.date),
        input("image", "Image URL", item.image),
        textarea("desc", "Deskripsi", item.desc),
      ].join("")),
      showCancelButton: true,
      confirmButtonText: index === undefined ? "Tambah" : "Update",
    });

    if (!result.isConfirmed) return;

    const newItem = {
      ...item,
      title: fieldValue("title"),
      category: fieldValue("category"),
      date: fieldValue("date"),
      image: fieldValue("image"),
      desc: fieldValue("desc"),
    };

    const newList =
      index === undefined
        ? [...content.activities, newItem]
        : content.activities.map((x, i) => (i === index ? newItem : x));

    setContent((p) => ({ ...p, activities: newList }));

    await saveContentSection("activities", newList);

    Swal.fire("Berhasil", "Kegiatan disimpan", "success");
  };

  // =========================
  // 🔥 PROMO AUTO SAVE
  // =========================
  const openPromo = async (item: PromoItem, index?: number) => {
    const result = await Swal.fire<PromoItem>({
      title: "Promo",
      html: modalHtml([
        input("title", "Judul", item.title),
        input("image", "Image", item.image),
        textarea("text", "Deskripsi", item.text),
      ].join("")),
      showCancelButton: true,
      confirmButtonText: index === undefined ? "Tambah" : "Update",
    });

    if (!result.isConfirmed) return;

    const newItem = {
      ...item,
      title: fieldValue("title"),
      image: fieldValue("image"),
      text: fieldValue("text"),
    };

    const newList =
      index === undefined
        ? [...content.promotions, newItem]
        : content.promotions.map((x, i) => (i === index ? newItem : x));

    setContent((p) => ({ ...p, promotions: newList }));

    await saveContentSection("promotions", newList);

    Swal.fire("Berhasil", "Promo disimpan", "success");
  };

  // =========================
  // 🔥 GALLERY AUTO SAVE
  // =========================
  const openGallery = async (item: GalleryItem, index?: number) => {
    const result = await Swal.fire<GalleryItem>({
      title: "Gallery",
      html: modalHtml([
        input("title", "Judul", item.title),
        input("image", "Image", item.image),
        textarea("caption", "Caption", item.caption),
      ].join("")),
      showCancelButton: true,
      confirmButtonText: index === undefined ? "Tambah" : "Update",
    });

    if (!result.isConfirmed) return;

    const newItem = {
      ...item,
      title: fieldValue("title"),
      image: fieldValue("image"),
      caption: fieldValue("caption"),
    };

    const newList =
      index === undefined
        ? [...content.gallery, newItem]
        : content.gallery.map((x, i) => (i === index ? newItem : x));

    setContent((p) => ({ ...p, gallery: newList }));

    await saveContentSection("gallery", newList);

    Swal.fire("Berhasil", "Gallery disimpan", "success");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Content Manager (Auto Save)</h2>

      {/* BANNER */}
      <button onClick={openBanner}>Edit Banner</button>

      <hr />

      {/* ACTIVITIES */}
      <h3>Kegiatan</h3>
      <button onClick={() => openActivity(createActivity())}>
        Tambah
      </button>

      {content.activities.map((a, i) => (
        <div key={i}>
          {a.title}
          <button onClick={() => openActivity(a, i)}>Edit</button>
        </div>
      ))}

      <hr />

      {/* PROMO */}
      <h3>Promo</h3>
      <button onClick={() => openPromo(createPromo())}>
        Tambah
      </button>

      {content.promotions.map((p, i) => (
        <div key={i}>
          {p.title}
          <button onClick={() => openPromo(p, i)}>Edit</button>
        </div>
      ))}

      <hr />

      {/* GALLERY */}
      <h3>Gallery</h3>
      <button onClick={() => openGallery(createGallery())}>
        Tambah
      </button>

      {content.gallery.map((g, i) => (
        <div key={i}>
          {g.title}
          <button onClick={() => openGallery(g, i)}>Edit</button>
        </div>
      ))}
    </div>
  );
};

export default ContentManager;