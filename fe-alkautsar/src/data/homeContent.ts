export type BannerContent = {
  title: string;
  text: string;
  image: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type PromoItem = {
  id: string;
  title: string;
  tag: string;
  text: string;
  buttonText: string;
  detailText: string;
  image: string;
  accent: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  desc: string;
};

export type AchievementItem = {
  id: string;
  title: string;
  year: string;
  category: string;
  img: string;
  desc: string;
};

export type AboutContent = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
  visionTitle: string;
  visionText: string;
  mottoTitle: string;
  mottoItems: string[];
  facilityTitle: string;
  facilities: string[];
};

export type ExtracurricularGroup = {
  id: string;
  title: string;
  icon: string;
  gradient: string;
  items: string[];
};

export type HomeContent = {
  banner: BannerContent;
  promotions: PromoItem[];
  gallery: GalleryItem[];
  activities: ActivityItem[];
  achievements: AchievementItem[];
  about: AboutContent;
  extracurriculars: ExtracurricularGroup[];
};

export const defaultHomeContent: HomeContent = {
  banner: {
    title: "Pendidikan Islami yang Tumbuh Bersama Zaman",
    text: "Al-Kautsar menghadirkan lingkungan belajar yang memadukan akhlak, ilmu, dan keterampilan masa depan untuk santri yang unggul.",
    image: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=1600",
    primaryLabel: "Tentang ALKA",
    primaryHref: "#tentang",
    secondaryLabel: "PPDB ALKA 2026",
    secondaryHref: "#promosi",
  },
  promotions: [
    {
      id: "promo-1",
      title: "Program Ramadhan Spesial",
      tag: "Event Tahunan",
      text: "Pertajam spiritualitas dan jalin ukhuwah di bulan suci bersama mentor berpengalaman.",
      buttonText: "Daftar Sekarang",
      detailText: "Detail Info",
      image:
        "https://images.unsplash.com/photo-1585036156171-3839efc1a446?auto=format&fit=crop&q=80&w=1200",
      accent: "#2ecc71",
    },
    {
      id: "promo-2",
      title: "Donasi Pembangunan Masjid",
      tag: "Amal Jariyah",
      text: "Wujudkan rumah ibadah yang nyaman. Setiap bata yang Anda sumbangkan adalah pahala yang mengalir.",
      buttonText: "Infaq Sekarang",
      detailText: "Detail Info",
      image:
        "https://images.unsplash.com/photo-1542621334-a254cf47733d?auto=format&fit=crop&q=80&w=1200",
      accent: "#1abc9c",
    },
    {
      id: "promo-3",
      title: "Kelas Mengaji Online",
      tag: "E-Learning",
      text: "Metode belajar praktis dari nol hingga fasih. Fleksibel, interaktif, dan terbimbing.",
      buttonText: "Gabung Kelas",
      detailText: "Detail Info",
      image:
        "https://images.unsplash.com/photo-1584281723351-90bd57529967?auto=format&fit=crop&q=80&w=1200",
      accent: "#3498db",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      title: "Kegiatan Tahfidz Pagi",
      category: "Akademik",
      image:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=900",
      caption: "Suasana belajar Al-Qur'an yang fokus dan hangat setiap pagi.",
    },
    {
      id: "gallery-2",
      title: "Praktik Laboratorium",
      category: "Sains",
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=900",
      caption: "Eksplorasi sains modern tetap berjalan seiring pendidikan islami.",
    },
    {
      id: "gallery-3",
      title: "Lomba Seni Islami",
      category: "Ekstrakurikuler",
      image:
        "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=900",
      caption: "Santri tampil percaya diri dan kreatif dalam panggung seni.",
    },
    {
      id: "gallery-4",
      title: "Kebersamaan Asrama",
      category: "Asrama",
      image:
        "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=900",
      caption: "Budaya kebersamaan tumbuh lewat kegiatan harian di asrama.",
    },
  ],
  activities: [
    {
      id: "activity-1",
      title: "Pengajian Mingguan",
      category: "Ibadah",
      date: "Setiap Jumat, 19:30 WIB",
      image:
        "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600",
      desc: "Kajian kitab kuning dan zikir bersama untuk memperdalam spiritualitas santri dan masyarakat sekitar pondok.",
    },
    {
      id: "activity-2",
      title: "Pembangunan Masjid",
      category: "Sosial",
      date: "Tahap Finishing - 2026",
      image:
        "https://images.unsplash.com/photo-1591604129939-f1efa4d8f7ec?auto=format&fit=crop&q=80&w=600",
      desc: "Proyek perluasan area ibadah utama guna menampung lebih banyak jamaah dan fasilitas pendidikan Al-Qur'an.",
    },
    {
      id: "activity-3",
      title: "Kelas Mengaji Anak",
      category: "Edukasi",
      date: "Senin - Kamis",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600",
      desc: "Metode belajar cepat membaca Al-Qur'an dengan tajwid yang benar untuk anak-anak usia dini.",
    },
    {
      id: "activity-4",
      title: "Workshop Pemuda",
      category: "Skill",
      date: "12 Maret 2026",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600",
      desc: "Pelatihan kewirausahaan digital dan desain grafis bagi santri tingkat akhir untuk persiapan dunia kerja.",
    },
  ],
  achievements: [
    {
      id: "achievement-1",
      title: "Juara 1 Lomba Tahfidz",
      year: "2025",
      category: "Provinsi",
      img: "https://images.unsplash.com/photo-1544717305-996b815c338c?auto=format&fit=crop&q=80&w=600",
      desc: "Keberhasilan luar biasa dalam menghafal 30 Juz Al-Qur'an dengan tajwid yang sempurna.",
    },
    {
      id: "achievement-2",
      title: "Juara 2 Olimpiade Sains",
      year: "2024",
      category: "Nasional",
      img: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=600",
      desc: "Kompetisi sains tingkat nasional.",
    },
    {
      id: "achievement-3",
      title: "Sekolah Berprestasi",
      year: "2025",
      category: "Kabupaten",
      img: "https://images.unsplash.com/photo-1523050853064-0097f4749f96?auto=format&fit=crop&q=80&w=600",
      desc: "Penghargaan atas dedikasi sekolah.",
    },
    {
      id: "achievement-4",
      title: "Juara Lomba Seni Islami",
      year: "2023",
      category: "Provinsi",
      img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=600",
      desc: "Kreativitas modern dalam nilai Islami.",
    },
  ],
  about: {
    badge: "Discovery Our Essence",
    title: "Membangun Peradaban Melalui",
    highlight: "Pendidikan Islami",
    description:
      "Lembaga Al-Kautsar hadir bukan sekadar sebagai tempat belajar, melainkan sebuah ekosistem pertumbuhan karakter yang memadukan kedalaman spiritual dengan kecakapan teknologi masa depan.",
    image:
      "https://images.unsplash.com/photo-1577100078279-b3445dee847c?auto=format&fit=crop&q=80&w=800",
    visionTitle: "Visi Utama",
    visionText:
      "Menjadi pusat keunggulan pendidikan Islam yang melahirkan pemimpin masa depan berkarakter Ahlussunnah Wal Jama'ah.",
    mottoTitle: "Moto Perjuangan",
    mottoItems: ["Akhlak", "Ilmu", "Amal"],
    facilityTitle: "Fasilitas Modern",
    facilities: ["Smart Classrooms", "Asrama Premium", "Sport Center & Gym"],
  },
  extracurriculars: [
    {
      id: "ekskul-1",
      title: "Seni & Budaya",
      icon: "bi-palette-fill",
      gradient: "linear-gradient(135deg, #1a3d2c 0%, #2ecc71 100%)",
      items: ["Hadroh", "Qosidah", "Marawis", "Tari Tradisional", "Angklung", "Drumband"],
    },
    {
      id: "ekskul-2",
      title: "Olahraga",
      icon: "bi-trophy-fill",
      gradient: "linear-gradient(135deg, #0d3b5e 0%, #3498db 100%)",
      items: ["Futsal", "Voli", "Basket", "Tenis Meja", "Badminton", "Bela Diri"],
    },
    {
      id: "ekskul-3",
      title: "Jam'iyyatu",
      icon: "bi-book-half",
      gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      items: ["Muballighin", "Quro'", "Huffadz", "Khatthath"],
    },
    {
      id: "ekskul-4",
      title: "Keterampilan",
      icon: "bi-cpu-fill",
      gradient: "linear-gradient(135deg, #e67e22 0%, #f1c40f 100%)",
      items: ["Multimedia", "Tata Boga", "Paskibra", "Jurnalistik"],
    },
  ],
};
