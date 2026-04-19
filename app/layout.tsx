import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ParticlesBackground } from "@/components/shared/particles-background";
import { SiteFooter } from "@/components/shared/shell";
import { SiteHeader } from "@/components/shared/site-header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });

export const metadata: Metadata = {
  title: "NORULES COMMUNITY",
  description: "Website komunitas AyoDance NORULES COMMUNITY"
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${orbitron.variable} font-body antialiased`}>
        <ParticlesBackground />
        <div className="relative min-h-screen">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
        <Toaster
          toastOptions={{
            style: {
              background: "#111111",
              color: "#E8B84B",
              border: "1px solid rgba(232,184,75,0.35)"
            }
          }}
        />
      </body>
    </html>
  );
}
