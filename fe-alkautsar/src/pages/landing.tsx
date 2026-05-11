import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Tentang from "../components/Tentang";
import Navbar from "../components/Navbar";
import PromoPage from "../components/Promosi";
import KegiatanPage from "../components/KegiatanCard";
import PrestasiPage from "../components/Prestasi";
import Footer from "../components/Footer";
import EkstrakurikulerPage from "../components/Ekstrakurikuler";
import PimpinanPage from "../components/Pimpinan";
import GallerySection from "../components/GallerySection";
import { defaultHomeContent, type HomeContent } from "../data/homeContent";
import { getHomeContent } from "../services/content/home";

const Landing = () => {
  const [content, setContent] = useState<HomeContent>(defaultHomeContent);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const result = await getHomeContent();
        setContent(result);
      } catch (error) {
        console.error("Gagal memuat konten landing dari API", error);
      }
    };

    void loadContent();
  }, []);

  return (
    <>
      <Navbar />
      <Banner content={content.banner} />
      <Tentang content={content.about} />
      <PimpinanPage />
      <KegiatanPage items={content.activities} />
      <PrestasiPage items={content.achievements} />
      <GallerySection items={content.gallery} />
      <EkstrakurikulerPage items={content.extracurriculars} />
      <PromoPage items={content.promotions} />
      <Footer />
    </>
  );
};

export default Landing;
