"use client";

import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { LogoutButton } from "@/components/admin/logout-button";
import { SectionCard } from "@/components/shared/shell";
import type {
  BlacklistEntry,
  DashboardData,
  EventItem,
  FeedbackItem,
  Member,
  Tester
} from "@/lib/types";

type MemberForm = Omit<Member, "created_at" | "join_date"> & {
  join_date?: string;
  password?: string;
};
type EventForm = EventItem;
type TesterForm = Tester;
type BlacklistForm = BlacklistEntry;

const emptyMember: MemberForm = {
  id: "",
  nama: "",
  nickname: "",
  gender: "",
  tanggal_lahir: "",
  domisili: "",
  no_hp: "",
  division: "Community",
  role: "Member",
  photo_url: "",
  status: "pending",
  password: ""
};

const emptyEvent: EventForm = {
  id: "",
  title: "",
  description: "",
  event_date: "",
  banner_url: ""
};

const emptyTester: TesterForm = {
  id: "",
  nama: "",
  whatsapp: "",
  is_online: false
};

const emptyBlacklist: BlacklistForm = {
  id: "",
  nama: "",
  nickname: "",
  status: "BLACKLIST",
  durasi: "PERMANEN",
  alasan: "",
  created_at: ""
};

async function uploadFile(file: File, folder: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Upload gagal.");
  }

  return result.url as string;
}

export function AdminDashboardClient({ initialData }: { initialData: DashboardData }) {
  const [data, setData] = useState(initialData);
  const [memberForm, setMemberForm] = useState<MemberForm>(emptyMember);
  const [eventForm, setEventForm] = useState<EventForm>(emptyEvent);
  const [testerForm, setTesterForm] = useState<TesterForm>(emptyTester);
  const [blacklistForm, setBlacklistForm] = useState<BlacklistForm>(emptyBlacklist);
  const [password, setPassword] = useState("");
  const [recruitmentStatus, setRecruitmentStatus] = useState(initialData.recruitmentStatus);
  const [isPending, startTransition] = useTransition();

  async function refreshDashboard() {
    const response = await fetch("/api/admin/dashboard", { cache: "no-store" });
    const result = await response.json();
    setData(result);
    setRecruitmentStatus(result.recruitmentStatus);
  }

  function submitAction(action: () => Promise<void>, successMessage: string) {
    startTransition(async () => {
      try {
        await action();
        await refreshDashboard();
        toast.success(successMessage);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Terjadi kesalahan.");
      }
    });
  }

  async function sendJson(url: string, method: string, payload: unknown) {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Permintaan gagal.");
    }
    return result;
  }

  async function handleMemberSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitAction(
      async () => {
        await sendJson("/api/members", memberForm.id ? "PUT" : "POST", memberForm);
        setMemberForm(emptyMember);
      },
      memberForm.id ? "Member diperbarui." : "Member ditambahkan."
    );
  }

  async function handleEventSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitAction(
      async () => {
        await sendJson("/api/events", eventForm.id ? "PUT" : "POST", eventForm);
        setEventForm(emptyEvent);
      },
      eventForm.id ? "Event diperbarui." : "Event ditambahkan."
    );
  }

  async function handleTesterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitAction(
      async () => {
        await sendJson("/api/testers", testerForm.id ? "PUT" : "POST", testerForm);
        setTesterForm(emptyTester);
      },
      testerForm.id ? "Tester diperbarui." : "Tester ditambahkan."
    );
  }

  async function handleBlacklistSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitAction(
      async () => {
        await sendJson(
          "/api/blacklist",
          blacklistForm.id ? "PUT" : "POST",
          blacklistForm
        );
        setBlacklistForm(emptyBlacklist);
      },
      blacklistForm.id ? "Blacklist diperbarui." : "Blacklist ditambahkan."
    );
  }

  const statCards = [
    ["Total Members", data.stats.totalMembers],
    ["Pending Approval", data.stats.pendingApproval],
    ["Blacklist Count", data.stats.blacklistCount],
    ["Unread Feedback", data.stats.unreadFeedback]
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-orbitron text-4xl text-gold-300">ADMIN DASHBOARD</h1>
          <p className="mt-2 text-white/65">
            Kelola member, approval, event, tester, feedback, blacklist, dan pengaturan website.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(([label, value]) => (
          <SectionCard key={String(label)}>
            <p className="text-sm uppercase tracking-[0.25em] text-white/45">{label}</p>
            <p className="mt-3 font-orbitron text-4xl text-gold-300">{value}</p>
          </SectionCard>
        ))}
      </div>

      <div className="mt-8 grid gap-6">
        <SectionCard>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-orbitron text-2xl text-gold-300">Members</p>
              <p className="mt-1 text-sm text-white/50">
                Termasuk fitur ganti nickname member dari form ini.
              </p>
            </div>
            <span className="text-sm text-white/50">Approve / Reject / Edit / Delete</span>
          </div>
          <form onSubmit={handleMemberSubmit} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input value={memberForm.nama} onChange={(e) => setMemberForm((p) => ({ ...p, nama: e.target.value }))} placeholder="Nama lengkap" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
            <input value={memberForm.nickname} onChange={(e) => setMemberForm((p) => ({ ...p, nickname: e.target.value }))} placeholder="Nickname" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
            <input value={memberForm.domisili || ""} onChange={(e) => setMemberForm((p) => ({ ...p, domisili: e.target.value }))} placeholder="Domisili" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
            <input value={memberForm.no_hp || ""} onChange={(e) => setMemberForm((p) => ({ ...p, no_hp: e.target.value }))} placeholder="No. HP" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
            <select value={memberForm.gender || ""} onChange={(e) => setMemberForm((p) => ({ ...p, gender: e.target.value }))} className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none">
              <option value="">Pilih Gender</option>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
            <input type="date" value={memberForm.tanggal_lahir || ""} onChange={(e) => setMemberForm((p) => ({ ...p, tanggal_lahir: e.target.value }))} className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
            <select value={memberForm.division || ""} onChange={(e) => setMemberForm((p) => ({ ...p, division: e.target.value }))} className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none">
              <option>Club</option>
              <option>Com</option>
            </select>
            <select value={memberForm.role} onChange={(e) => setMemberForm((p) => ({ ...p, role: e.target.value }))} className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none">
              <option>Member</option>
              <option>Staff</option>
            </select>
            <select value={memberForm.status} onChange={(e) => setMemberForm((p) => ({ ...p, status: e.target.value }))} className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none">
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="warning">Warning</option>
              <option value="blacklist">Blacklist</option>
            </select>
            <input value={memberForm.password || ""} onChange={(e) => setMemberForm((p) => ({ ...p, password: e.target.value }))} placeholder="Password member baru / reset" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
            <label className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white/70">
              Upload Foto
              <input
                type="file"
                accept="image/*"
                className="mt-2 block w-full text-xs"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadFile(file, "members");
                    setMemberForm((prev) => ({ ...prev, photo_url: url }));
                    toast.success("Foto member berhasil diupload.");
                  } catch (error) {
                    toast.error(error instanceof Error ? error.message : "Upload gagal.");
                  }
                }}
              />
            </label>
            <div className="flex gap-3 xl:col-span-3">
              <button type="submit" disabled={isPending} className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
                {memberForm.id ? "Update Member" : "Tambah Member"}
              </button>
              <button type="button" onClick={() => setMemberForm(emptyMember)} className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70">
                Reset
              </button>
            </div>
          </form>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white/75">
              <thead>
                <tr className="border-b border-white/10 text-white/45">
                  <th className="px-4 py-3">Nama</th>
                  <th className="px-4 py-3">Nickname</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.members.map((member) => (
                  <tr key={member.id} className="border-b border-white/5">
                    <td className="px-4 py-4">{member.nama}</td>
                    <td className="px-4 py-4">{member.nickname}</td>
                    <td className="px-4 py-4">{member.role}</td>
                    <td className="px-4 py-4 uppercase">{member.status}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => setMemberForm({ ...member })} className="rounded-full border border-gold-400/30 px-3 py-1 text-xs text-gold-300">Edit / Nickname</button>
                        <button type="button" onClick={() => submitAction(() => sendJson("/api/members", "PATCH", { id: member.id, status: "approved" }), "Member disetujui.")} className="rounded-full border border-emerald-400/30 px-3 py-1 text-xs text-emerald-300">Approve</button>
                        <button type="button" onClick={() => submitAction(() => sendJson("/api/members", "PATCH", { id: member.id, status: "rejected" }), "Member ditolak.")} className="rounded-full border border-amber-400/30 px-3 py-1 text-xs text-amber-300">Reject</button>
                        <button type="button" onClick={() => submitAction(() => sendJson("/api/members", "DELETE", { id: member.id }), "Member dihapus.")} className="rounded-full border border-rose-400/30 px-3 py-1 text-xs text-rose-300">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard>
            <p className="font-orbitron text-2xl text-gold-300">Events</p>
            <form onSubmit={handleEventSubmit} className="mt-5 grid gap-4">
              <input value={eventForm.title} onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))} placeholder="Judul event" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
              <input type="date" value={eventForm.event_date} onChange={(e) => setEventForm((p) => ({ ...p, event_date: e.target.value }))} className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
              <textarea value={eventForm.description || ""} onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))} placeholder="Deskripsi event" rows={4} className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
              <label className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white/70">
                Upload Banner
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const url = await uploadFile(file, "events");
                      setEventForm((prev) => ({ ...prev, banner_url: url }));
                      toast.success("Banner event berhasil diupload.");
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Upload gagal.");
                    }
                  }}
                />
              </label>
              <div className="flex gap-3">
                <button type="submit" className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
                  {eventForm.id ? "Update Event" : "Tambah Event"}
                </button>
                <button type="button" onClick={() => setEventForm(emptyEvent)} className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70">
                  Reset
                </button>
              </div>
            </form>
            <div className="mt-5 grid gap-3">
              {data.events.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-white/55">{item.description}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => setEventForm({ ...item })} className="rounded-full border border-gold-400/30 px-3 py-1 text-xs text-gold-300">Edit</button>
                    <button type="button" onClick={() => submitAction(() => sendJson("/api/events", "DELETE", { id: item.id }), "Event dihapus.")} className="rounded-full border border-rose-400/30 px-3 py-1 text-xs text-rose-300">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <div className="flex items-center justify-between gap-4">
              <p className="font-orbitron text-2xl text-gold-300">Tester Officers</p>
              <span className="rounded-full border border-gold-400/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold-300">
                {recruitmentStatus}
              </span>
            </div>
            <form onSubmit={handleTesterSubmit} className="mt-5 grid gap-4">
              <input value={testerForm.nama} onChange={(e) => setTesterForm((p) => ({ ...p, nama: e.target.value }))} placeholder="Nama tester" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
              <input value={testerForm.whatsapp} onChange={(e) => setTesterForm((p) => ({ ...p, whatsapp: e.target.value }))} placeholder="Nomor WhatsApp" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
              <label className="flex items-center gap-3 rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white/80">
                <input type="checkbox" checked={testerForm.is_online} onChange={(e) => setTesterForm((p) => ({ ...p, is_online: e.target.checked }))} className="accent-[#E8B84B]" />
                Sedang online
              </label>
              <div className="flex gap-3">
                <button type="submit" className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
                  {testerForm.id ? "Update Tester" : "Tambah Tester"}
                </button>
                <button type="button" onClick={() => setTesterForm(emptyTester)} className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70">
                  Reset
                </button>
                <button type="button" onClick={() => submitAction(() => sendJson("/api/settings", "PATCH", { recruitmentStatus: recruitmentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE" }), "Status recruitment diperbarui.")} className="rounded-full border border-gold-400/50 px-5 py-3 text-sm text-gold-300">
                  Toggle Recruitment
                </button>
              </div>
            </form>
            <div className="mt-5 grid gap-3">
              {data.testers.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="font-semibold text-white">{item.nama}</p>
                  <p className="mt-1 text-sm text-white/55">{item.whatsapp}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gold-300">
                    {item.is_online ? "ONLINE" : "OFFLINE"}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => setTesterForm({ ...item, is_online: Boolean(item.is_online) })} className="rounded-full border border-gold-400/30 px-3 py-1 text-xs text-gold-300">Edit</button>
                    <button type="button" onClick={() => submitAction(() => sendJson("/api/testers", "DELETE", { id: item.id }), "Tester dihapus.")} className="rounded-full border border-rose-400/30 px-3 py-1 text-xs text-rose-300">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard>
            <p className="font-orbitron text-2xl text-gold-300">Blacklist</p>
            <form onSubmit={handleBlacklistSubmit} className="mt-5 grid gap-4">
              <input value={blacklistForm.nama} onChange={(e) => setBlacklistForm((p) => ({ ...p, nama: e.target.value }))} placeholder="Nama" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
              <input value={blacklistForm.nickname} onChange={(e) => setBlacklistForm((p) => ({ ...p, nickname: e.target.value }))} placeholder="Nickname" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
              <select value={blacklistForm.status} onChange={(e) => setBlacklistForm((p) => ({ ...p, status: e.target.value }))} className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none">
                <option>BLACKLIST</option>
                <option>OUT COMMUNITY</option>
                <option>WARNING</option>
              </select>
              <input value={blacklistForm.durasi} onChange={(e) => setBlacklistForm((p) => ({ ...p, durasi: e.target.value }))} placeholder="Durasi" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
              <textarea value={blacklistForm.alasan || ""} onChange={(e) => setBlacklistForm((p) => ({ ...p, alasan: e.target.value }))} placeholder="Alasan" rows={4} className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
              <div className="flex gap-3">
                <button type="submit" className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
                  {blacklistForm.id ? "Update Blacklist" : "Tambah Blacklist"}
                </button>
                <button type="button" onClick={() => setBlacklistForm(emptyBlacklist)} className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70">
                  Reset
                </button>
              </div>
            </form>
            <div className="mt-5 grid gap-3">
              {data.blacklist.map((item) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="font-semibold text-white">{item.nama} ({item.nickname})</p>
                  <p className="mt-1 text-sm text-white/55">{item.alasan}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => setBlacklistForm({ ...item })} className="rounded-full border border-gold-400/30 px-3 py-1 text-xs text-gold-300">Edit</button>
                    <button type="button" onClick={() => submitAction(() => sendJson("/api/blacklist", "DELETE", { id: item.id }), "Entry blacklist dihapus.")} className="rounded-full border border-rose-400/30 px-3 py-1 text-xs text-rose-300">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard>
            <p className="font-orbitron text-2xl text-gold-300">Feedback</p>
            <div className="mt-5 grid gap-3">
              {data.feedback.map((item: FeedbackItem) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                  <p className="font-semibold text-white">
                    {item.category} • {item.name || "Anonim"}
                  </p>
                  <p className="mt-1 text-sm text-white/55">{item.message}</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => submitAction(() => sendJson("/api/feedback", "PATCH", { id: item.id, is_read: !item.is_read }), item.is_read ? "Feedback ditandai belum dibaca." : "Feedback ditandai sudah dibaca.")} className="rounded-full border border-gold-400/30 px-3 py-1 text-xs text-gold-300">
                      {item.is_read ? "Unread" : "Mark Read"}
                    </button>
                    <button type="button" onClick={() => submitAction(() => sendJson("/api/feedback", "DELETE", { id: item.id }), "Feedback dihapus.")} className="rounded-full border border-rose-400/30 px-3 py-1 text-xs text-rose-300">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SectionCard>
            <p className="font-orbitron text-2xl text-gold-300">Rules</p>
            <p className="mt-3 text-sm text-white/65">
              Rules komunitas bersifat read-only dan dipakai juga di halaman registrasi.
            </p>
            <a href="/rules" className="mt-5 inline-flex rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
              Buka Halaman Rules
            </a>
          </SectionCard>

          <SectionCard>
            <p className="font-orbitron text-2xl text-gold-300">Settings</p>
            <div className="mt-5 grid gap-4">
              <select value={recruitmentStatus} onChange={(e) => setRecruitmentStatus(e.target.value)} className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none">
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password admin baru" className="rounded-2xl border border-gold-400/30 bg-black/50 px-4 py-3 text-white outline-none" />
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => submitAction(() => sendJson("/api/settings", "PATCH", { recruitmentStatus, password: password || undefined }), "Pengaturan berhasil disimpan.")} className="rounded-full border border-gold-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">
                  Simpan Pengaturan
                </button>
                <button type="button" onClick={() => setPassword("")} className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/70">
                  Reset Password Field
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
