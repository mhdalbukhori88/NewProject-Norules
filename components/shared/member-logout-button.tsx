"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function MemberLogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/member/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className="text-sm text-white/70 transition hover:text-gold-300"
    >
      {isPending ? "Logout..." : "Logout Member"}
    </button>
  );
}
