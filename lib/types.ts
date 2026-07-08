/**
 * TypeScript interfaces untuk seluruh data model aplikasi.
 * Digunakan di frontend (React) dan backend (API routes).
 */

/** Profil Desa - dokumen tunggal di Firestore (collection: village_profile, doc: main-village) */
export interface VillageProfile {
  id: string;
  villageName: string;
  description: string;
  location: string;
  imageUrl?: string;
  contactEmail: string;
  contactPhone: string;
  visionMission?: string;
  demographics?: {
    population?: number;
    households?: number;
    area?: string;
  };
  highlights?: VillageHighlight[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  updatedAt: number;
  createdAt: number;
}

/** Potensi unggulan desa */
export interface VillageHighlight {
  icon: string;
  title: string;
  description: string;
}

/** Produk marketplace - collection: products */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  stock: number;
  whatsappLink: string;
  approved: boolean;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: number;
  createdAt: number;
  updatedAt: number;
}

/** Acara/Event warga desa - collection: events */
export interface VillageEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  date: number; // unix timestamp
  endDate?: number;
  organizer: string; // nama penyelenggara
  category: EventCategory;
  imageUrl?: string;
  approved: boolean;
  createdBy: string; // uid admin or 'warga:{phone}'
  approvedBy?: string;
  approvedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export type EventCategory =
  | 'Keagamaan'
  | 'Olahraga'
  | 'Kebudayaan'
  | 'Pendidikan'
  | 'Sosial'
  | 'Pemerintahan'
  | 'Lainnya';

/** Admin user - collection: admin_users */
export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'moderator';
  createdAt: number;
  lastLogin?: number;
}
