"use client";

import { useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import html2canvas from "html2canvas";
import { SectionCard } from "@/components/shared/shell";
import type { Tester } from "@/lib/types";

function formatWhatsapp(value: string) {
  const numeric = value.replace(/\D/g, "").replace(/^0/, "");
  return `https://wa.me/62${numeric}?text=Halo%20saya%20ingin%20bergabung%20dengan%20NORULES%20COMMUNITY`;
}

export function TesterSelector({
  testers,
  status
}: {
  testers: Tester[];
  status: string;
}) {
  const [selectedId, setSelectedId] = useState(testers[0]?.id ?? "");
  const qrRef = useRef<HTMLDivElement | null>(null);
  const selected = useMemo(
    () => testers.find((tester) => tester.id === selectedId) || testers[0],
    [selectedId, testers]
  );
  const qrValue = selected ? formatWhatsapp(selected.whatsapp) : "";

  async function downloadQr() {
    if (!qrRef.current || !selected) return;
    const canvas = await html2canvas(qrRef.current, { backgroundColor: "#0A0A0A" });
    const link = document.createElement("a");
    link.download = `QR-${selected.nama}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <SectionCard className="h-full">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-orbitron text-2xl text-gold-300">RECRUITMENT</p>
          <p className="mt-2 text-sm text-white/65">
            Pilih tester yang sedang online dan hubungi mereka melalui WhatsApp atau scan QR code.
          </p>
        </div>
        <span className="rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">
          {status}
        </span>
      </div>

      <select
        value={selected?.id}
        onChange={(event) => setSelectedId(event.target.value)}
        className="mb-5 w-full rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-gold-300"
      >
        {testers.map((tester) => (
          <option key={tester.id} value={tester.id}>
            {tester.nama}
          </option>
        ))}
      </select>

      {selected ? (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4 rounded-3xl border border-gold-400/20 bg-black/40 p-5">
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${selected.is_online ? "bg-emerald-400" : "bg-white/30"}`}
              />
              <div>
                <p className="text-xl font-semibold text-white">{selected.nama}</p>
                <p className="text-sm text-white/55">
                  {selected.is_online ? "Sedang online" : "Sedang offline"}
                </p>
              </div>
            </div>
            <a
              href={qrValue}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-gold-400 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold"
            >
              Chat WhatsApp
            </a>
          </div>

          <div className="rounded-3xl border border-gold-400/35 bg-[#111111cc] p-5">
            <p className="mb-4 text-center text-sm uppercase tracking-[0.3em] text-gold-300">
              QR Tester
            </p>
            <div
              ref={qrRef}
              className="mx-auto flex w-fit flex-col items-center gap-3 rounded-3xl border border-gold-400/35 bg-black p-5"
            >
              <p className="text-sm text-white">{selected.nama}</p>
              <QRCode value={qrValue} size={180} fgColor="#E8B84B" bgColor="#0A0A0A" />
            </div>
            <button
              type="button"
              onClick={downloadQr}
              className="mt-4 w-full rounded-full border border-gold-400 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-300 transition hover:bg-gold-400/10 hover:shadow-gold"
            >
              Download QR
            </button>
          </div>
        </div>
      ) : (
        <p className="text-white/60">Belum ada tester officer.</p>
      )}
    </SectionCard>
  );
}
