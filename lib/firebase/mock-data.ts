import { VillageProfile, Product } from '../types';

/**
 * Data default Desa Kwanyar, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura.
 * Digunakan sebagai fallback jika Firestore belum terisi data.
 */
export const MOCK_VILLAGE_PROFILE: VillageProfile = {
  id: 'main-village',
  villageName: 'Desa Kwanyar',
  description:
    'Desa Kwanyar adalah desa pesisir yang terletak di tepi Selat Madura, Kecamatan Kwanyar, Kabupaten Bangkalan, Jawa Timur. Desa ini dikenal sebagai salah satu sentra produksi hasil laut terbaik di Madura dengan kekayaan budaya dan keramahan masyarakat lokal yang luar biasa.\n\nMayoritas penduduk bermata pencaharian sebagai nelayan, petani tegalan, peternak, serta pengrajin dan penjahit. Produk unggulan desa meliputi kerupuk udang, petis udang, garam tradisional, dan batik Madura. Desa Kwanyar menjadi destinasi riset dan pengabdian masyarakat dari berbagai perguruan tinggi untuk pengembangan ekonomi kreatif berbasis kearifan lokal.',
  location: 'Kecamatan Kwanyar, Kabupaten Bangkalan, Madura, Jawa Timur',
  imageUrl: '/kwanyar_hero.png',
  contactEmail: 'desa.kwanyar@bangkalankab.go.id',
  contactPhone: '+62 812-3456-7890',
  visionMission:
    'Visi: Mewujudkan Desa Kwanyar sebagai desa pesisir mandiri, sejahtera, dan berbudaya.\n\nMisi:\n1. Mengembangkan potensi perikanan dan kelautan secara berkelanjutan.\n2. Meningkatkan kualitas sumber daya manusia melalui pendidikan dan pelatihan.\n3. Melestarikan budaya dan kearifan lokal Madura.\n4. Mendorong ekonomi kreatif berbasis produk unggulan desa.',
  demographics: {
    population: 3250,
    households: 875,
    area: '246.70 Ha',
  },
  highlights: [
    {
      icon: '🐟',
      title: 'Nelayan & Perikanan',
      description:
        'Mayoritas warga bermata pencaharian sebagai nelayan di Selat Madura dengan hasil tangkapan udang, ikan, dan kerang.',
    },
    {
      icon: '🌾',
      title: 'Pertanian Tegalan',
      description:
        'Petani mengelola lahan tegalan seluas 86.5 Ha untuk tanaman pangan seperti jagung, kacang tanah, dan singkong.',
    },
    {
      icon: '🐄',
      title: 'Peternakan',
      description:
        'Peternakan sapi Madura, kambing, dan unggas menjadi sumber pendapatan tambahan yang signifikan bagi warga.',
    },
    {
      icon: '🧵',
      title: 'Jasa Menjahit',
      description:
        'Industri rumahan menjahit pakaian dan batik memberikan lapangan kerja bagi ibu-ibu dan warga desa.',
    },
  ],
  socialMedia: {
    instagram: 'https://instagram.com/desa_kwanyar',
    facebook: 'https://facebook.com/desa.kwanyar',
    whatsapp: 'https://wa.me/6281234567890',
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'product_kerupuk_udang',
    name: 'Kerupuk Udang Kwanyar',
    description:
      'Kerupuk udang khas Kwanyar yang renyah dan gurih, dibuat dari udang segar pilihan hasil tangkapan nelayan lokal. Diproses secara tradisional tanpa pengawet.',
    price: 35000,
    imageUrl: '/kerupuk_udang.png',
    category: 'Makanan & Minuman',
    stock: 50,
    whatsappLink:
      'https://wa.me/6281234567890?text=Halo%2C+saya+tertarik+membeli+Kerupuk+Udang+Kwanyar.',
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
    category: 'Makanan & Minuman',
    stock: 30,
    whatsappLink:
      'https://wa.me/6281234567890?text=Halo%2C+saya+tertarik+membeli+Petis+Udang+Madura.',
    approved: true,
    createdBy: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];
