import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'VisualCraft — AI Product Photography for Indian D2C Sellers',
    template: '%s | VisualCraft',
  },
  description:
    'Upload a phone photo → AI removes background → 6 platform-ready images in 10 seconds. Free for Meesho, Instagram, Flipkart, Amazon sellers.',
  keywords: [
    'AI product photography',
    'background removal',
    'Indian sellers',
    'Meesho',
    'Flipkart',
    'Instagram shop',
    'Cloudinary',
    'D2C',
  ],
  authors: [{ name: 'Team Elite' }],
  openGraph: {
    title: 'VisualCraft — AI Product Photography for Indian D2C Sellers',
    description:
      'Upload a phone photo → AI removes background → 6 platform-ready images in 10 seconds.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans bg-background text-foreground antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
