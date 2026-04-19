import Link from "next/link";
import { SectionCard } from "@/components/shared/shell";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <SectionCard className="w-full text-center">
        <p className="font-orbitron text-6xl text-gold-300">404</p>
        <h1 className="mt-4 font-orbitron text-3xl text-white">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-white/65">
          Link yang Anda buka tidak tersedia atau sudah dipindahkan.
        </p>
        <Link href="/" className="mt-8 inline-flex rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
          Kembali ke Beranda
        </Link>
      </SectionCard>
    </div>
  );
}
