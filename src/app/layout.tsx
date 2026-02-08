import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdminAwareFooter from "@/components/layout/AdminAwareFooter";
import CartDrawer from "@/components/cart/CartDrawer";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KƏEL PARFÜM - Premium Parfüm və Kosmetika",
    template: "%s | KƏEL PARFÜM",
  },
  description:
    "Azərbaycanda premium parfüm və kosmetika məhsulları. Orijinal brendlər, sərfəli qiymətlər, kredit imkanı və sürətli çatdırılma.",
  keywords: [
    "parfüm",
    "kosmetika",
    "ətir",
    "Azərbaycan",
    "Qəbələ",
    "brend ətirləri",
    "qadın ətirləri",
    "kişi ətirləri",
  ],
  authors: [{ name: "KƏEL PARFÜM" }],
  creator: "KƏEL PARFÜM",
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "https://kaelparfum.com",
    siteName: "KƏEL PARFÜM",
    title: "KƏEL PARFÜM - Premium Parfüm və Kosmetika",
    description:
      "Azərbaycanda premium parfüm və kosmetika məhsulları. Orijinal brendlər, kredit imkanı.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KƏEL PARFÜM - Premium Parfüm və Kosmetika",
    description: "Azərbaycanda premium parfüm və kosmetika məhsulları.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { getUser } from "@/lib/actions/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  // Map user to the format expected by Header
  const initialUser = user ? {
    id: (user as any).id,
    email: (user as any).email || '',
    full_name: (user as any).profile?.full_name,
    role: (user as any).profile?.role,
  } : null;

  return (
    <html lang="az" className={`${playfair.variable} ${montserrat.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Header initialUser={initialUser} />
        <main className="flex-1">{children}</main>
        <AdminAwareFooter>
          <Footer />
        </AdminAwareFooter>
        <CartDrawer />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
