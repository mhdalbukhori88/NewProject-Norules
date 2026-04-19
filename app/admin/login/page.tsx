"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { SectionCard } from "@/components/shared/shell";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: true
  });

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    startTransition(async () => {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Login admin gagal.");
        return;
      }

      toast.success("Login berhasil.");
      router.push("/admin");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-xl items-center px-4 py-12 sm:px-6 lg:px-8">
      <SectionCard className="w-full">
        <h1 className="text-center font-orbitron text-4xl text-gold-300">
          Admin NORULES COMMUNITY
        </h1>
        <form onSubmit={submit} className="mt-8 grid gap-4">
          <input
            placeholder="Username"
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-gold-300"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-gold-300"
          />
          <div className="flex items-center justify-between text-sm text-white/60">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(event) => setForm((prev) => ({ ...prev, remember: event.target.checked }))}
                className="accent-[#E8B84B]"
              />
              Remember Me
            </label>
            <span>Forgot?</span>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full border border-gold-400 px-5 py-3 font-semibold uppercase tracking-[0.25em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold disabled:opacity-50"
          >
            {isPending ? "Memproses..." : "Sign In"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
