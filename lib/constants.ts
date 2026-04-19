export const COMMUNITY_NAME = "NORULES COMMUNITY";
export const TAGLINE = "Play Freely, Stay United, No Limits!";
export const FOUNDED_AT = "27 Oktober 2024";
export const GAME_NAME = "AyoDance";

export const RULES_CONTENT = `RULES NORULES COMMUNITY
"Play Freely, Stay United, No Limits!"

Tentang Kami
RISE AS ONE artinya:
Bangkit sebagai satu.” / “Naik bersama sebagai satu tim.”
Maknanya:
Komunitas yang solid dan kompak. Menang, kalah, berkembang — semuanya bareng-bareng, tidak ada yang ditinggal, semua satu tujuan.

Vibenya: kuat & bersatu
- teamwork tinggi
- tim yang terlihat kompak dan powerful

Versi santainya:  “Naik bareng, kuat bareng.”

Cocok kalau mau nunjukin identitas komunitas yang loyal, solid, dan siap push bareng untuk berkembang

Visi dan Misi
Visi: Menjadi komunitas AyoDance yang solid, kreatif, dan bebas berekspresi tanpa batas, serta menjunjung tinggi kebersamaan, sportivitas, dan kesenangan dalam bermain.

Misi:
1. Membangun komunitas yang ramah dan saling menghargai
2. Menciptakan suasana bermain yang seru dan positif
3. Mengembangkan skill anggota tidak hanya dalam permainan melalui pelatihan & event
4. Mengadakan kegiatan rutin komunitas
5. Menjaga solidaritas antar member
6. Memberikan kebebasan berekspresi dengan tetap beretika

Kegiatan Komunitas
Kegiatan:
1. Fun Mabar
2. Gathering Member
3. Event Party / Dance
4. Nongkrong Bareng
5. Bakti Sosial
6. Merchandise NORULES

Peraturan Komunitas
1. MEMBER CLUB WAJIB/COM FORMAT nrL DI SEMUA AKUN
2. Bercanda boleh, yang tidak diperbolehkan mengandung isu SARA & POLITIK
3. DILARANG KERAS PINJAM MEMINJAM UANG PADA MEMBER & STAFF DI CLUB NORULES DALAM BENTUK APAPUN
4. DILARANG MEMAKAI PROGRAM ILEGAL/CHEAT
5. TEGURAN 3x PADA MEMBER YANG TIDAK MEMATUHI ATURAN
6. DILARANG KELUAR & MASUK CLUB TANPA IZIN KE STAFF
7. RE DATA MEMBER CLUB/COM 3x DALAM 1 TAHUN
8. TIDAK MENERIMA HODE/DEHO
9. JAGA NAMA BAIK CLUB NORULES`;

export const RULES_SECTIONS = RULES_CONTENT.split(/\n(?=BAB )/g);

export const PARTICLE_CONFIG = {
  particles: {
    number: { value: 80 },
    color: { value: "#E8B84B" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#C9952A",
      opacity: 0.3,
      width: 1
    },
    move: { enable: true, speed: 2 }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" }
    }
  }
};
