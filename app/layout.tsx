import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Desa Kwanyar - Profil Desa & Marketplace',
    template: '%s | Desa Kwanyar',
  },
  description: 'Portal resmi profil desa dan marketplace produk unggulan Desa Kwanyar, Kecamatan Kwanyar, Kabupaten Bangkalan, Madura.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans bg-[#FAFAF8] text-gray-900">
        {children}
      </body>
    </html>
  );
}
