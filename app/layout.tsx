import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";
import WelcomeSplash from "@/components/WelcomeScreen";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display-src",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body-src",
});
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono-src",
});

export const metadata: Metadata = {
  title: "Jasa Koding & Web Dev",
  description:
    "Pembuatan website & aplikasi untuk mahasiswa, UMKM, dan organisasi. Source code rapi, bisa sekalian di-deploy online.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${display.variable} ${jakarta.variable} ${mono.variable}`}>
      <body>
        <WelcomeSplash />
        {children}
      </body>
    </html>
  );
}