import Banner from "../components/Banner";
import Tentang from "../components/Tentang";
import Navbar from "../components/Navbar";
import PromoPage from "../components/p";
import KegiatanPage from "../components/KegiatanCard";
import PrestasiPage from "../components/Prestasi";
import Footer from "../components/Footer";
import EkstrakurikulerPage from "../components/Ekstrakurikuler";
import PimpinanPage from "../components/Pimpinan";

const Landing = () => {
  return (
    <>
      <Navbar />
      <Banner />
      <Tentang />
      <PimpinanPage />
      <KegiatanPage />
      <PrestasiPage />
      <EkstrakurikulerPage />
      <PromoPage />
      <Footer />
    </>
  );
};

export default Landing;
