import Image from "next/image";
import Link from "next/link";
import { SectionCard } from "@/components/shared/shell";
import { getAllMembers } from "@/lib/data";

export default async function MembersPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const role = typeof searchParams?.role === "string" ? searchParams.role : "";
  const gender = typeof searchParams?.gender === "string" ? searchParams.gender : "";
  const domisili =
    typeof searchParams?.domisili === "string" ? searchParams.domisili : "";

  const members = await getAllMembers({ q, role, gender, domisili });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionCard>
        <h1 className="font-orbitron text-4xl text-gold-300">DAFTAR MEMBER</h1>
        <form className="mt-8 grid gap-4 md:grid-cols-4">
          <input name="q" defaultValue={q} placeholder="Cari nama / nickname" className="rounded-2xl border border-gold-400/30 bg-black/40 px-4 py-3 text-white outline-none" />
          <input name="role" defaultValue={role} placeholder="Filter role" className="rounded-2xl border border-gold-400/30 bg-black/40 px-4 py-3 text-white outline-none" />
          <input name="gender" defaultValue={gender} placeholder="Filter gender" className="rounded-2xl border border-gold-400/30 bg-black/40 px-4 py-3 text-white outline-none" />
          <input name="domisili" defaultValue={domisili} placeholder="Filter domisili" className="rounded-2xl border border-gold-400/30 bg-black/40 px-4 py-3 text-white outline-none" />
          <button type="submit" className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300 md:col-span-4 md:w-fit">
            Terapkan Filter
          </button>
        </form>
        <p className="mt-6 text-sm text-white/60">Menampilkan {members.length} Anggota</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <SectionCard key={member.id}>
              <div className="flex items-center gap-4">
                <Image
                  src={member.photo_url || "/assets/logo-primary.jpeg"}
                  alt={member.nickname}
                  width={88}
                  height={88}
                  className="rounded-full border border-gold-400/30 object-cover"
                />
                <div>
                  <p className="w-fit rounded-full border border-gold-400/30 px-3 py-1 text-xs uppercase tracking-[0.25em] text-gold-300">
                    {member.role}
                  </p>
                  <p className="mt-3 text-xl font-semibold text-white">{member.nickname}</p>
                  <p className="text-sm text-white/55">{member.nama}</p>
                  <p className="text-sm text-white/45">{member.domisili}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm text-white/45">
                <span>Gabung {new Date(member.join_date).toLocaleDateString("id-ID")}</span>
                <Link href={`/members/${member.id}`} className="text-gold-300">
                  Lihat Member
                </Link>
              </div>
            </SectionCard>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
