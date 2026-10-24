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
  images?: string[]; // Array of image URLs
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
  images?: string[]; // Array of image URLs
  approved: boolean;
  createdBy: string; // uid admin or 'warga:{phone}'
  approvedBy?: string;
  approvedAt?: number;
  createdAt: number;
  updatedAt: number;
}

/** Helper utility to extract all images from an item safely */
export function getItemImages(item?: { images?: string[]; imageUrl?: string } | null): string[] {
  if (!item) return [];
  if (Array.isArray(item.images) && item.images.length > 0) {
    return item.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0);
  }
  if (item.imageUrl && typeof item.imageUrl === 'string' && item.imageUrl.trim().length > 0) {
    return [item.imageUrl.trim()];
  }
  return [];
}

export type EventCategory =
  | 'Keagamaan'
  | 'Olahraga'
  | 'Kebudayaan'
  | 'Pendidikan'
  | 'Sosial'
  | 'Pemerintahan'
  | 'Lainnya';

export type UserRole = 'superadmin' | 'admin' | 'moderator' | 'user';

/** Admin user - collection: admin_users */
export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: number;
  lastLogin?: number;
  photoURL?: string;
}
