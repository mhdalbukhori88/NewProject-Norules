import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionCard } from "@/components/shared/shell";
import { getMemberById } from "@/lib/data";

export default async function MemberProfilePage({
  params
}: {
  params: { id: string };
}) {
  const member = await getMemberById(params.id);
  if (!member) notFound();

  const fields = [
    ["Nama", member.nama],
    ["Nickname", member.nickname],
    ["Gender", member.gender],
    ["Tanggal Lahir", member.tanggal_lahir],
    ["Domisili", member.domisili],
    ["No. HP", member.no_hp],
    ["Division", member.division],
    ["Role", member.role],
    ["Tanggal Bergabung", member.join_date],
    ["Status", member.status]
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionCard>
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="rounded-3xl border border-gold-400/20 bg-black/40 p-6">
            <Image
              src={member.photo_url || "/assets/logo-primary.jpeg"}
              alt={member.nickname}
              width={320}
              height={320}
              className="mx-auto rounded-[2rem] border border-gold-400/30 object-cover"
            />
          </div>
          <div>
            <h1 className="font-orbitron text-4xl text-gold-300">{member.nickname}</h1>
            <div className="mt-6 grid gap-4">
              {fields.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm">
                  <span className="text-white/45">{label}</span>
                  <span className="text-right text-white/85">{value || "-"}</span>
                </div>
              ))}
            </div>
            <Link href="/members" className="mt-6 inline-flex rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
              Kembali
            </Link>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
