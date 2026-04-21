import Image from "next/image";
import { FeedbackForm } from "@/components/home/feedback-form";
import { TesterSelector } from "@/components/home/tester-selector";
import { GoldButton, SectionCard } from "@/components/shared/shell";
import {
  COMMUNITY_NAME,
  FOUNDED_AT,
  GAME_NAME,
  TAGLINE,
  TAGLINE_ID
} from "@/lib/constants";
import {
  getApprovedMembers,
  getEvents,
  getRecruitmentStatus,
  getTesters
} from "@/lib/data";

export default async function HomePage() {
  const [members, events, testers, recruitmentStatus] = await Promise.all([
    getApprovedMembers(6),
    getEvents(),
    getTesters(),
    getRecruitmentStatus()
  ]);

  return (
    <div className="pb-16">
      <div className="overflow-hidden border-b border-gold-400/20 bg-black/70 py-3">
        <div className="announcement-track animate-marquee px-4 text-sm uppercase tracking-[0.3em] text-gold-300">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index}>
              NORULES COMMUNITY | Event Baru | Recruitment Aktif | Play Freely, Stay United, No
              Limits!
            </span>
          ))}
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-16">
        <SectionCard className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gold-grid bg-[size:24px_24px] opacity-20" />
          <div className="relative">
            <div className="mb-10 flex items-center">
              <div className="rounded-[2.5rem] border border-gold-400/35 bg-black/55 p-3 shadow-[0_0_40px_rgba(232,184,75,0.22)]">
                <Image
                  src="/assets/logo-primary.jpeg"
                  alt="Logo utama NORULES"
                  width={180}
                  height={180}
                  className="rounded-[2rem] object-cover"
                />
              </div>
            </div>
            <p className="font-orbitron text-sm uppercase tracking-[0.45em] text-gold-300">
              Founded {FOUNDED_AT}
            </p>
            <h1 className="mt-4 max-w-3xl font-orbitron text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
              {COMMUNITY_NAME}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-white/75">{TAGLINE}</p>
            <p className="mt-2 max-w-2xl text-sm text-gold-300/85">{TAGLINE_ID}</p>
            <p className="mt-6 max-w-2xl text-white/65">
              Komunitas pecinta game {GAME_NAME} yang hadir untuk bermain santai, berkembang
              bersama, dan menjaga solidaritas tanpa batas.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GoldButton href="/join">Gabung Sekarang</GoldButton>
              <GoldButton href="/members" className="border-white/20 text-white">
                Lihat Member
              </GoldButton>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-5">
          <SectionCard>
            <p className="text-sm uppercase tracking-[0.25em] text-white/45">Total Member</p>
            <p className="mt-3 font-orbitron text-4xl text-gold-300">
              {members.length.toString().padStart(2, "0")}
            </p>
          </SectionCard>
          <SectionCard>
            <p className="text-sm uppercase tracking-[0.25em] text-white/45">Status System</p>
            <div className="mt-3 inline-flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              ONLINE
            </div>
          </SectionCard>
          <SectionCard>
            <p className="font-orbitron text-lg text-gold-300">Tentang Komunitas</p>
            <p className="mt-3 text-sm leading-7 text-white/65">
              Kenapa sih namanya NORULES? Berarti komunitas ini tidak punya aturan sama sekali?
            </p>
            <p className="mt-3 text-sm leading-7 text-white/65">
              NORULES bukan berarti tanpa arah atau tanpa aturan. Kita bebas berekspresi, bebas
              main, dan bebas jadi diri sendiri, tapi tetap tahu batas. Di sini, respect tetap
              nomor satu, solidaritas dijaga, dan aturan dasar tetap jalan. Karena NORULES itu
              soal kebebasan bermain yang bertanggung jawab, tanpa batas untuk berkembang, bukan
              kebebasan yang asal-asalan.
            </p>
          </SectionCard>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-orbitron text-3xl text-gold-300">EVENTS YANG AKAN DATANG</p>
            <p className="mt-2 text-white/65">
              Agenda komunitas terbaru yang bisa Anda ikuti bersama member lain.
            </p>
          </div>
          <GoldButton href="/admin/login">+ Tambah Event</GoldButton>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <SectionCard key={event.id} className="overflow-hidden p-0">
              <div className="relative h-56">
                <Image
                  src={event.banner_url || "/assets/logo-primary.jpeg"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-gold-300">
                  {new Date(event.event_date).toLocaleDateString("id-ID")}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-white">{event.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/65">{event.description}</p>
              </div>
            </SectionCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-orbitron text-3xl text-gold-300">MEMBER TERBARU</p>
            <p className="mt-2 text-white/65">
              Enam member terbaru yang sudah disetujui admin.
            </p>
          </div>
          <GoldButton href="/members">Lihat Semua Member</GoldButton>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {members.map((member) => (
            <SectionCard key={member.id}>
              <div className="flex items-center gap-4">
                <Image
                  src={member.photo_url || "/assets/logo-primary.jpeg"}
                  alt={member.nickname}
                  width={78}
                  height={78}
                  className="rounded-full border border-gold-400/30 object-cover"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold-300">
                    {member.role}
                  </p>
                  <p className="mt-1 text-xl font-semibold text-white">{member.nickname}</p>
                  <p className="text-sm text-white/55">{member.nama}</p>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <TesterSelector testers={testers} status={recruitmentStatus} />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FeedbackForm />
      </section>
    </div>
  );
}
