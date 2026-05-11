export type OrganizationMember = {
  id: string;
  name: string;
  position: string;
  img: string;
  bio: string;
  education: string;
  years: string;
};

export type OrganizationSection = {
  id: string;
  section: string;
  icon: string;
  members: OrganizationMember[];
};

export type OrganizationContent = {
  id?: string;
  title: string;
  subtitle: string;
  head: OrganizationMember;
  leaders: OrganizationMember[];
  sections: OrganizationSection[];
};

export const defaultOrganizationContent: OrganizationContent = {
  title: "Struktur Organisasi",
  subtitle: "Pondok Pesantren Al-Kautsar",
  head: {
    id: "head-1",
    name: "Ust. Ahmad Fadly",
    position: "Kepala Pondok",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400",
    bio: "Berdedikasi dalam mengembangkan kurikulum berbasis adab dan teknologi.",
    education: "S2 Pendidikan Islam - Al-Azhar Cairo",
    years: "15 Tahun",
  },
  leaders: [
    {
      id: "leader-1",
      name: "Ust. Nur Aulia",
      position: "Lurah 1",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
      bio: "Fokus pada pengembangan disiplin dan karakter santri asrama.",
      education: "S1 Syariah - LIPIA Jakarta",
      years: "8 Tahun",
    },
    {
      id: "leader-2",
      name: "Ust. Hidayat",
      position: "Lurah 2",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400",
      bio: "Mengelola manajemen fasilitas dan kesejahteraan santri.",
      education: "S1 Manajemen - Universitas Indonesia",
      years: "6 Tahun",
    },
  ],
  sections: [
    {
      id: "section-1",
      section: "Kesiswaan",
      icon: "bi-people-fill",
      members: [
        {
          id: "section-1-member-1",
          name: "Ust. Siti Rahma",
          position: "Koordinator",
          img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
          bio: "Ahli dalam konseling remaja dan pengembangan bakat.",
          education: "S1 Psikologi",
          years: "5 Tahun",
        },
        {
          id: "section-1-member-2",
          name: "Ust. Fadli",
          position: "Staff",
          img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
          bio: "Koordinator kegiatan ekstrakurikuler santri.",
          education: "S1 Olahraga",
          years: "3 Tahun",
        },
      ],
    },
    {
      id: "section-2",
      section: "Akademik",
      icon: "bi-book-fill",
      members: [
        {
          id: "section-2-member-1",
          name: "Ust. Rahmat",
          position: "Koordinator",
          img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
          bio: "Pengawas kualitas pengajaran dan kurikulum.",
          education: "S2 Kurikulum",
          years: "10 Tahun",
        },
        {
          id: "section-2-member-2",
          name: "Ust. Lina",
          position: "Staff",
          img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
          bio: "Adminitrasi nilai dan data akademik santri.",
          education: "S1 Administrasi",
          years: "4 Tahun",
        },
      ],
    },
    {
      id: "section-3",
      section: "Keuangan",
      icon: "bi-cash-stack",
      members: [
        {
          id: "section-3-member-1",
          name: "Ust. Hidayat",
          position: "Bendahara",
          img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=200",
          bio: "Transparansi dan manajemen finansial pesantren.",
          education: "S1 Akuntansi",
          years: "7 Tahun",
        },
      ],
    },
  ],
};
