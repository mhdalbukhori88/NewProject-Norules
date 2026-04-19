import { SectionCard } from "@/components/shared/shell";
import { RULES_SECTIONS } from "@/lib/constants";

export default function RulesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionCard>
        <h1 className="font-orbitron text-4xl text-gold-300">RULES NORULES COMMUNITY</h1>
        <div className="mt-8 space-y-4">
          {RULES_SECTIONS.map((section) => (
            <details key={section.slice(0, 20)} open className="rounded-2xl border border-white/10 bg-black/40 p-5">
              <summary className="cursor-pointer list-none font-semibold text-gold-300">
                {section.split("\n")[0]}
              </summary>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/75">{section}</p>
            </details>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
