import { VillageProfile, Product } from '../types';

/**
 * Data default Desa Dlemer, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura.
 * Digunakan sebagai fallback jika Firestore belum terisi data.
 */
export const MOCK_VILLAGE_PROFILE: VillageProfile = {
  id: 'main-village',
  villageName: 'Desa Dlemer',
  description:
    'Desa Dlemer adalah desa yang terletak di Kecamatan Kwanyar, Kabupaten Bangkalan, Pulau Madura, Jawa Timur. Desa ini dikenal dengan kekayaan budaya lokal, kehidupan agraris yang kental, serta keramahan masyarakatnya yang menjunjung tinggi nilai-nilai adat Madura.\n\nMayoritas penduduk bermata pencaharian sebagai petani tegalan, peternak sapi Madura, penjahit, serta pengrajin batik dan kerajinan lokal. Produk unggulan desa meliputi kerupuk udang, petis, batik Madura, dan hasil ternak. Desa Dlemer menjadi salah satu objek riset dan pengabdian masyarakat dari berbagai perguruan tinggi dalam rangka pengembangan ekonomi kreatif berbasis kearifan lokal.',
  location: 'Desa Dlemer, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura, Jawa Timur',
  imageUrl: '/dlemer_hero.jpg',
  contactEmail: 'desa.dlemer@bangkalankab.go.id',
  contactPhone: '+62 812-3456-7890',
  visionMission:
    'Visi: Mewujudkan Desa Dlemer sebagai desa mandiri, sejahtera, dan berbudaya berbasis kearifan lokal Madura.\n\nMisi:\n1. Mengembangkan potensi pertanian dan peternakan secara berkelanjutan.\n2. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan keterampilan.\n3. Melestarikan budaya dan kearifan lokal Madura.\n4. Mendorong ekonomi kreatif berbasis produk unggulan desa.',
  demographics: {
    population: 3250,
    households: 875,
    area: '246.70 Ha',
  },
  highlights: [
    {
      icon: '🌾',
      title: 'Pertanian Tegalan',
      description:
        'Petani mengelola lahan tegalan seluas ratusan hektar untuk tanaman pangan seperti jagung, kacang tanah, dan singkong — tulang punggung ekonomi desa.',
    },
    {
      icon: '🐄',
      title: 'Peternakan Sapi Madura',
      description:
        'Peternakan sapi Madura khas, kambing, dan unggas menjadi kebanggaan dan sumber pendapatan utama bagi warga desa Dlemer.',
    },
    {
      icon: '🧵',
      title: 'Kerajinan & Batik',
      description:
        'Industri rumahan menjahit pakaian dan batik Madura memberikan lapangan kerja kreatif bagi ibu-ibu dan warga desa.',
    },
    {
      icon: '🏺',
      title: 'Produk Lokal Unggulan',
      description:
        'Kerupuk udang, petis, dan berbagai produk olahan menjadi produk andalan yang dipasarkan hingga ke luar daerah.',
    },
  ],
  socialMedia: {
    instagram: 'https://instagram.com/desa_dlemer',
    facebook: 'https://facebook.com/desa.dlemer',
    whatsapp: 'https://wa.me/6281234567890',
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'product_kerupuk_udang',
    name: 'Kerupuk Udang Khas Madura',
    description:
      'Kerupuk udang khas Madura yang renyah dan gurih, dibuat dari udang segar pilihan. Diproses secara tradisional tanpa pengawet, cocok untuk oleh-oleh dan konsumsi sehari-hari.',
    price: 35000,
    imageUrl: '/kerupuk_udang.png',
    images: ['/kerupuk_udang.png', '/petis_udang.png', '/dlemer_hero.jpg'],
    category: 'Makanan & Minuman',
    stock: 50,
    whatsappLink:
      'https://wa.me/6281234567890?text=Halo%2C+saya+tertarik+membeli+Kerupuk+Udang+Khas+Madura.',
    approved: true,
    createdBy: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'product_petis_udang',
    name: 'Petis Udang Madura',
    description:
      'Petis udang asli Madura dengan cita rasa gurih dan manis yang khas. Terbuat dari sari udang pilihan, cocok untuk pelengkap rujak, nasi pecel, dan masakan khas Madura.',
    price: 25000,
    imageUrl: '/petis_udang.png',
    images: ['/petis_udang.png', '/kerupuk_udang.png'],
    category: 'Makanan & Minuman',
    stock: 30,
    whatsappLink:
      'https://wa.me/6281234567890?text=Halo%2C+saya+tertarik+membeli+Petis+Udang+Madura.',
    approved: true,
    createdBy: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'product_batik_madura',
    name: 'Batik Madura Tulis',
    description:
      'Batik tulis khas Madura dengan motif tradisional yang kaya warna. Dibuat dengan tangan oleh pengrajin lokal Desa Dlemer menggunakan pewarna alami dan malam berkualitas.',
    price: 185000,
    imageUrl: '/madura_batik.png',
    images: ['/madura_batik.png', '/madura_keris.png', '/aeng_tongtong_hero.png'],
    category: 'Kerajinan',
    stock: 15,
    whatsappLink:
      'https://wa.me/6281234567890?text=Halo%2C+saya+tertarik+membeli+Batik+Madura+Tulis.',
    approved: true,
    createdBy: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
