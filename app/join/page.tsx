import { JoinWizard } from "@/components/join/join-wizard";
import { SectionCard } from "@/components/shared/shell";

export default function JoinPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionCard>
        <h1 className="font-orbitron text-4xl text-gold-300">GABUNG NORULES COMMUNITY</h1>
        <p className="mt-3 max-w-3xl text-white/65">
          Silakan mengikuti alur pendaftaran 5 langkah. Persetujuan terhadap aturan diperlukan sebelum melanjutkan ke tahap pengisian biodata.        
        </p>
        <div className="mt-8">
          <JoinWizard />
        </div>
      </SectionCard>
    </div>
  );
}
