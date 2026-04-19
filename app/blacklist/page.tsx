import { SectionCard } from "@/components/shared/shell";
import { getBlacklist } from "@/lib/data";

export default async function BlacklistPage() {
  const entries = await getBlacklist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionCard>
        <h1 className="font-orbitron text-4xl text-gold-300">BLACKLIST & OUT COMMUNITY</h1>
        <p className="mt-3 text-white/65">
          Daftar anggota bermasalah
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {["ALL", "BLACKLIST", "OUT COMMUNITY", "WARNING"].map((item) => (
            <span key={item} className="rounded-full border border-gold-400/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold-300">
              {item}
            </span>
          ))}
        </div>
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-white/75">
            <thead>
              <tr className="border-b border-white/10 text-white/45">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Nickname</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Durasi</th>
                <th className="px-4 py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-b border-white/5">
                  <td className="px-4 py-4">{entry.nama}</td>
                  <td className="px-4 py-4">{entry.nickname}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full border border-gold-400/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold-300">
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">{entry.durasi}</td>
                  <td className="px-4 py-4">
                    <div className="h-2 w-40 rounded-full bg-white/10">
                      <div className="h-2 w-2/3 rounded-full bg-gradient-to-r from-gold-400 to-gold-300" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
