import type { Metadata } from 'next';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://risetbemgtd2026.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: {
    google: 'google3e59652797569c9a',
  },
  title: {
    default: 'Desa Dlemer — Portal Resmi & Marketplace',
    template: '%s | Desa Dlemer, Kwanyar Bangkalan',
  },
  description:
    'Portal resmi profil desa dan marketplace produk unggulan Desa Dlemer, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura. Temukan informasi desa, acara, dan produk lokal berkualitas.',
  keywords: [
    'Desa Dlemer',
    'Dlemer Kwanyar',
    'Bangkalan Madura',
    'profil desa',
    'marketplace desa',
    'produk lokal Madura',
    'wisata Bangkalan',
    'batik Madura',
    'kerupuk udang Madura',
    'BEM GTD 2026',
  ],
  authors: [{ name: 'Pemerintah Desa Dlemer' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'Desa Dlemer',
    title: 'Desa Dlemer — Portal Resmi & Marketplace',
    description:
      'Portal resmi profil desa dan marketplace produk unggulan Desa Dlemer, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura.',
    images: [
      {
        url: '/dlemer_hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Pemandangan Desa Dlemer, Kwanyar, Bangkalan, Madura',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desa Dlemer — Portal Resmi & Marketplace',
    description:
      'Portal resmi profil desa dan marketplace produk unggulan Desa Dlemer, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura.',
    images: ['/dlemer_hero.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GovernmentOrganization',
  name: 'Pemerintah Desa Dlemer',
  alternateName: 'Desa Dlemer',
  url: siteUrl,
  logo: `${siteUrl}/logo-dlemer.jpg`,
  image: `${siteUrl}/dlemer_hero.jpg`,
  description:
    'Portal resmi Desa Dlemer, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura, Jawa Timur.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Kwanyar',
    addressRegion: 'Bangkalan',
    addressCountry: 'ID',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+62-812-3456-7890',
    email: 'desa.dlemer@bangkalankab.go.id',
    contactType: 'customer service',
    availableLanguage: 'Indonesian',
  },
  sameAs: [
    'https://instagram.com/desa_dlemer',
    'https://facebook.com/desa.dlemer',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-sans bg-[#FAFAF8] text-gray-900">
        {children}
      </body>
    </html>
  );
}
