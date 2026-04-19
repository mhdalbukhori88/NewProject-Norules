"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

export function MemberLoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    nickname: "",
    password: "",
    remember: true
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const response = await fetch("/api/member/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Login member gagal.");
        return;
      }

      toast.success("Login member berhasil.");
      router.push("/member/account");
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <input
        placeholder="Nickname member"
        value={form.nickname}
        onChange={(event) => setForm((prev) => ({ ...prev, nickname: event.target.value }))}
        className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-gold-300"
      />
      <input
        type="password"
        placeholder="Password member"
        value={form.password}
        onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-gold-300"
      />
      <label className="flex items-center gap-2 text-sm text-white/65">
        <input
          type="checkbox"
          checked={form.remember}
          onChange={(event) => setForm((prev) => ({ ...prev, remember: event.target.checked }))}
          className="accent-[#E8B84B]"
        />
        Ingat sesi saya
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full border border-gold-400 px-5 py-3 font-semibold uppercase tracking-[0.25em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold disabled:opacity-50"
      >
        {isPending ? "Memproses..." : "Login Member"}
      </button>
    </form>
  );
}
