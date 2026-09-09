import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!envUrl || envUrl.includes('riset-bem-gtd-2026')) {
    return 'https://risetbemgtd2026.vercel.app';
  }
  return envUrl.replace(/\/+$/, '');
}

export const siteUrl = getSiteUrl();

