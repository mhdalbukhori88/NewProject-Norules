import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { COMMUNITY_NAME } from "@/lib/constants";
import { MemberLogoutButton } from "@/components/shared/member-logout-button";
import { memberSessionCookieName, verifyMemberToken } from "@/lib/session";

export async function SiteHeader() {
  const baseLinks = [
    { href: "/", label: "Beranda" },
    { href: "/members", label: "Member" },
    { href: "/blacklist", label: "Blacklist" },
    { href: "/rules", label: "Rules" },
    { href: "/join", label: "Join" },
    { href: "/admin/login", label: "Admin" }
  ];
  const memberToken = cookies().get(memberSessionCookieName)?.value;
  let memberSession: { id: string; nickname: string } | null = null;

  if (memberToken) {
    try {
      memberSession = await verifyMemberToken(memberToken);
    } catch {
      memberSession = null;
    }
  }

  const links = memberSession
    ? baseLinks
    : [
        ...baseLinks.slice(0, 5),
        { href: "/member/login", label: "Login Member" },
        baseLinks[5]
      ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logo-primary.jpeg"
            alt="NORULES"
            width={46}
            height={46}
            className="rounded-full border border-gold-400/50 object-cover"
          />
          <div>
            <p className="font-orbitron text-sm tracking-[0.3em] text-gold-300">
              {COMMUNITY_NAME}
            </p>
            <p className="text-xs text-white/60">AyoDance Community</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 transition hover:text-gold-300"
            >
              {link.label}
            </Link>
          ))}
          {memberSession ? (
            <>
              <Link
                href="/member/account"
                className="text-sm text-gold-300 transition hover:text-white"
              >
                {memberSession.nickname}
              </Link>
              <MemberLogoutButton />
            </>
          ) : null}
        </nav>

        <button
          type="button"
          className="inline-flex rounded-full border border-gold-400/40 p-3 text-gold-300 lg:hidden"
          aria-label="Menu"
        >
          <Menu size={18} />
        </button>
      </div>
    </header>
  );
}
