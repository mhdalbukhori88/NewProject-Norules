"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import type { Member } from "@/lib/types";

export function MemberAccountCard({ member }: { member: Member }) {
  const router = useRouter();
  const [nickname, setNickname] = useState(member.nickname);
  const [isPending, startTransition] = useTransition();

  function updateNickname(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const response = await fetch("/api/member/nickname", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname })
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Gagal mengganti nickname.");
        return;
      }

      toast.success("Nickname berhasil diganti.");
      router.refresh();
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
      <div className="rounded-3xl border border-gold-400/20 bg-black/40 p-6">
        <Image
          src={member.photo_url || "/assets/logo-primary.jpeg"}
          alt={member.nickname}
          width={320}
          height={320}
          className="mx-auto rounded-[2rem] border border-gold-400/30 object-cover"
        />
      </div>
      <div className="space-y-6">
        <div>
          <p className="font-orbitron text-4xl text-gold-300">{member.nickname}</p>
          <p className="mt-2 text-white/65">
            Login member aktif. Anda bisa mengganti nickname sendiri dari halaman ini.
          </p>
        </div>

        <div className="grid gap-3 rounded-3xl border border-gold-400/20 bg-black/40 p-5 text-sm text-white/80">
          {[
            ["Nama", member.nama],
            ["No. HP", member.no_hp],
            ["Domisili", member.domisili],
            ["Role", member.role],
            ["Status", member.status]
          ].map(([label, value]) => (
            <div key={String(label)} className="flex justify-between gap-4 border-b border-white/5 pb-3">
              <span className="text-white/45">{label}</span>
              <span className="text-right">{value || "-"}</span>
            </div>
          ))}
        </div>

        <form onSubmit={updateNickname} className="rounded-3xl border border-gold-400/20 bg-black/40 p-5">
          <p className="font-orbitron text-xl text-gold-300">Ganti Nickname</p>
          <p className="mt-2 text-sm text-white/60">
            Pastikan nickname baru tetap sesuai format komunitas `nrL`.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Nickname baru"
              className="flex-1 rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-gold-300"
            />
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : "Simpan Nickname"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
