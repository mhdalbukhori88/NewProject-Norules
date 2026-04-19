import clsx from "clsx";
import Link from "next/link";

export function SectionCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-[#E8B84B44] bg-[#111111cc] p-6 shadow-panel backdrop-blur-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function GoldButton({
  href,
  children,
  className
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const styles =
    "inline-flex items-center justify-center rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold";

  if (href) {
    return (
      <Link href={href} className={clsx(styles, className)}>
        {children}
      </Link>
    );
  }

  return <div className={clsx(styles, className)}>{children}</div>;
}

import { Instagram, MessageCircle, Music2 } from "lucide-react";

export function SiteFooter() {
  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/norules.au?igsh=NGxpNGV2Y2NrOWoz",
      icon: Instagram,
    },
    {
      name: "Discord",
      url: "https://discord.gg/YFb848tQ7",
      icon: MessageCircle,
    },
  ];

  return (
    <footer className="border-t border-white/5 bg-black/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-white/60 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        
        {/* LEFT */}
        <div>
          <p className="font-orbitron text-gold-300 text-lg tracking-wide">
            NORULES COMMUNITY
          </p>

          <div className="mt-3 flex gap-4">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;

              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-full px-3 py-1.5 transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-105"
                >
                  <Icon
                    size={16}
                    className="transition group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]"
                  />
                  <span className="transition group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]">
                    {link.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <p className="text-xs text-white/40">
          © 2026 NORULES COMMUNITY. Seluruh hak cipta dilindungi undang-undang.
        </p>
      </div>
    </footer>
  );
}
