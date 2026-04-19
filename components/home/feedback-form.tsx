"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { SectionCard } from "@/components/shared/shell";

export function FeedbackForm() {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    name: "",
    category: "Kritik",
    message: ""
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Gagal mengirim masukan.");
        return;
      }

      toast.success("Masukan berhasil dikirim.");
      setForm({ name: "", category: "Kritik", message: "" });
    });
  }

  return (
    <SectionCard>
      <div className="mb-6">
        <p className="font-orbitron text-2xl text-gold-300">
          KRITIK, SARAN & PENGADUAN
        </p>
        <p className="mt-2 text-sm text-white/65">
          Bantu komunitas berkembang dengan masukan yang jujur dan sopan.
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <input
          placeholder="Nama (opsional)"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-gold-300"
        />
        <select
          value={form.category}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, category: event.target.value }))
          }
          className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-gold-300"
        >
          <option>Kritik</option>
          <option>Saran</option>
          <option>Pengaduan</option>
        </select>
        <textarea
          placeholder="Tulis pesan Anda"
          rows={5}
          required
          value={form.message}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, message: event.target.value }))
          }
          className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-gold-300"
        />
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full border border-gold-400 px-5 py-3 font-semibold uppercase tracking-[0.25em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold disabled:opacity-60"
        >
          {isPending ? "Mengirim..." : "Kirim"}
        </button>
      </form>
    </SectionCard>
  );
}
