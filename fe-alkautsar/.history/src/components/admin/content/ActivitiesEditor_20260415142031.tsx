import { useEffect, useState } from "react";
import ActivitiesEditor from "./ActivitiesEditor";
import { getKegiatan, createKegiatan } from "@/services/api";

const ActivitiesPage = () => {
  const [items, setItems] = useState([]);

  // 🔥 GET DATA
  useEffect(() => {
    const load = async () => {
      const data = await getKegiatan();

      const mapped = data.map((item) => ({
        id: String(item.id),
        title: item.title,
        category: item.subTitle,
        date: "",
        image: item.image,
        desc: item.text,
      }));

      setItems(mapped);
    };

    load();
  }, []);

  // 🔥 ADD
  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "",
        category: "",
        date: "",
        image: "",
        desc: "",
      },
    ]);
  };

  // 🔥 REMOVE
  const handleRemove = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔥 CHANGE
  const handleChange = (index: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // 🔥 IMAGE
  const handleImageChange = (index: number, file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, image: reader.result as string } : item
        )
      );
    };
    reader.readAsDataURL(file);
  };

  // 🔥 SAVE KE API
  const handleSave = async () => {
    try {
      for (const item of items) {
        await createKegiatan({
          title: item.title,
          subTitle: item.category,
          text: item.desc,
          image: item.image,
        });
      }

      alert("Berhasil simpan ke DB 🔥");
    } catch (err) {
      console.error(err);
      alert("Gagal simpan");
    }
  };

  return (
    <div>
      <ActivitiesEditor
        items={items}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onChange={handleChange}
        onImageChange={handleImageChange}
      />

      <button onClick={handleSave} className="admin-button">
        Simpan ke Database
      </button>
    </div>
  );
};

export default ActivitiesPage;