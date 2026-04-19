import bcrypt from "bcryptjs";
import { query, isDbConfigured } from "@/lib/db";
import type {
  AdminStats,
  BlacklistEntry,
  DashboardData,
  EventItem,
  FeedbackItem,
  Member,
  Tester
} from "@/lib/types";

const demoMembers: Member[] = [
  {
    id: "1",
    nama: "Alya Putri",
    nickname: "nrL_Alya",
    gender: "Perempuan",
    tanggal_lahir: "2001-07-11",
    domisili: "Jakarta",
    no_hp: "081234567890",
    division: "Community",
    role: "Officer",
    photo_url: "/assets/logo-primary.jpeg",
    status: "approved",
    join_date: "2024-10-27"
  },
  {
    id: "2",
    nama: "Raka Pratama",
    nickname: "nrL_Raka",
    gender: "Laki-laki",
    tanggal_lahir: "1999-02-05",
    domisili: "Bandung",
    no_hp: "081298765432",
    division: "Both",
    role: "Member",
    photo_url: "/assets/logo-primary.jpeg",
    status: "approved",
    join_date: "2024-11-04"
  }
];

const demoEvents: EventItem[] = [
  {
    id: "1",
    title: "Party Dance Night",
    description: "Malam seru dengan sesi dance, mini games, dan hadiah komunitas.",
    event_date: "2026-04-20",
    banner_url: "/assets/logo-primary.jpeg"
  },
  {
    id: "2",
    title: "Fun Mabar Weekend",
    description: "Push rank dan nongkrong virtual bersama member NORULES.",
    event_date: "2026-04-27",
    banner_url: "/assets/logo-primary.jpeg"
  }
];

const demoTesters: Tester[] = [
  {
    id: "1",
    nama: "Staff Naya",
    whatsapp: "81234567890",
    is_online: true
  },
  {
    id: "2",
    nama: "Officer Dimas",
    whatsapp: "81345678901",
    is_online: false
  }
];

const demoFeedback: FeedbackItem[] = [
  {
    id: "1",
    name: "Anonim",
    category: "Saran",
    message: "Tambahkan event mingguan untuk member baru.",
    is_read: false,
    created_at: new Date().toISOString()
  }
];

const demoBlacklist: BlacklistEntry[] = [
  {
    id: "1",
    nama: "Bima",
    nickname: "nrL_Bima",
    status: "WARNING",
    durasi: "30 Hari",
    alasan: "Pelanggaran etika komunikasi",
    created_at: new Date().toISOString()
  }
];

export async function getApprovedMembers(limit?: number) {
  if (!isDbConfigured()) {
    return demoMembers.slice(0, limit ?? demoMembers.length);
  }

  const rows = await query<Member>(
    `SELECT * FROM members WHERE status = 'approved' ORDER BY created_at DESC ${limit ? "LIMIT ?" : ""}`,
    limit ? [limit] : []
  );
  return rows;
}

export async function getMembersForAdmin() {
  if (!isDbConfigured()) {
    return demoMembers;
  }

  return query<Member>("SELECT * FROM members ORDER BY created_at DESC");
}

export async function getAllMembers(filters?: {
  q?: string;
  role?: string;
  gender?: string;
  domisili?: string;
}) {
  if (!isDbConfigured()) {
    return demoMembers.filter((member) => {
      return [member.nama, member.nickname].join(" ").toLowerCase().includes((filters?.q || "").toLowerCase());
    });
  }

  const clauses = ["status IN ('approved', 'pending', 'warning')"];
  const params: unknown[] = [];

  if (filters?.q) {
    clauses.push("(nama LIKE ? OR nickname LIKE ?)");
    params.push(`%${filters.q}%`, `%${filters.q}%`);
  }

  if (filters?.role) {
    clauses.push("role = ?");
    params.push(filters.role);
  }

  if (filters?.gender) {
    clauses.push("gender = ?");
    params.push(filters.gender);
  }

  if (filters?.domisili) {
    clauses.push("domisili LIKE ?");
    params.push(`%${filters.domisili}%`);
  }

  return query<Member>(
    `SELECT * FROM members WHERE ${clauses.join(" AND ")} ORDER BY created_at DESC`,
    params
  );
}

export async function getMemberById(id: string) {
  if (!isDbConfigured()) {
    return demoMembers.find((member) => member.id === id) || null;
  }

  const rows = await query<Member>("SELECT * FROM members WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}

export async function getApprovedMemberByNickname(nickname: string) {
  if (!isDbConfigured()) {
    return (
      demoMembers.find(
        (member) =>
          member.nickname.toLowerCase() === nickname.toLowerCase() &&
          member.status === "approved"
      ) || null
    );
  }

  const rows = await query<Member>(
    "SELECT * FROM members WHERE nickname = ? AND status = 'approved' LIMIT 1",
    [nickname]
  );
  return rows[0] || null;
}

export async function getEvents() {
  if (!isDbConfigured()) {
    return demoEvents;
  }

  return query<EventItem>("SELECT * FROM events ORDER BY event_date ASC");
}

export async function getTesters() {
  if (!isDbConfigured()) {
    return demoTesters;
  }

  return query<Tester>("SELECT * FROM testers ORDER BY is_online DESC, nama ASC");
}

export async function getFeedback() {
  if (!isDbConfigured()) {
    return demoFeedback;
  }

  return query<FeedbackItem>("SELECT * FROM feedback ORDER BY created_at DESC");
}

export async function getBlacklist() {
  if (!isDbConfigured()) {
    return demoBlacklist;
  }

  return query<BlacklistEntry>("SELECT * FROM blacklist ORDER BY created_at DESC");
}

export async function getRecruitmentStatus() {
  if (!isDbConfigured()) {
    return "ACTIVE";
  }

  const rows = await query<{ value: string }>(
    "SELECT value FROM settings WHERE `key` = 'recruitment_status' LIMIT 1"
  );

  return rows[0]?.value || "ACTIVE";
}

export async function getAdminStats() {
  if (!isDbConfigured()) {
    return {
      totalMembers: demoMembers.length,
      pendingApproval: 3,
      blacklistCount: demoBlacklist.length,
      unreadFeedback: demoFeedback.filter((item) => !item.is_read).length
    };
  }

  const [memberCount] = await query<{ total: number }>("SELECT COUNT(*) AS total FROM members");
  const [pendingCount] = await query<{ total: number }>(
    "SELECT COUNT(*) AS total FROM members WHERE status = 'pending'"
  );
  const [blacklistCount] = await query<{ total: number }>(
    "SELECT COUNT(*) AS total FROM blacklist"
  );
  const [feedbackCount] = await query<{ total: number }>(
    "SELECT COUNT(*) AS total FROM feedback WHERE is_read = 0"
  );

  return {
    totalMembers: memberCount?.total || 0,
    pendingApproval: pendingCount?.total || 0,
    blacklistCount: blacklistCount?.total || 0,
    unreadFeedback: feedbackCount?.total || 0
  } satisfies AdminStats;
}

export async function authenticateAdmin(username: string, password: string) {
  if (!isDbConfigured()) {
    const demoHash = await bcrypt.hash("admin123", 10);
    const isMatch = username === "admin" && (await bcrypt.compare(password, demoHash));
    return isMatch ? { id: "demo-admin", username: "admin" } : null;
  }

  const rows = await query<{ id: string; username: string; password_hash: string }>(
    "SELECT * FROM admins WHERE username = ? LIMIT 1",
    [username]
  );
  const admin = rows[0];

  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);
  return isValid ? { id: admin.id, username: admin.username } : null;
}

export async function authenticateMember(nickname: string, password: string) {
  if (!isDbConfigured()) {
    const demoHash = await bcrypt.hash("member123", 10);
    const member = demoMembers.find(
      (item) => item.nickname.toLowerCase() === nickname.toLowerCase()
    );
    const isMatch = Boolean(member) && (await bcrypt.compare(password, demoHash));
    return isMatch && member
      ? { id: member.id, nickname: member.nickname, nama: member.nama }
      : null;
  }

  const rows = await query<Member>(
    "SELECT * FROM members WHERE nickname = ? AND status IN ('approved', 'pending', 'warning') LIMIT 1",
    [nickname]
  );
  const member = rows[0];

  if (!member?.member_password_hash) {
    return null;
  }

  const isValid = await bcrypt.compare(password, member.member_password_hash);
  return isValid
    ? { id: member.id, nickname: member.nickname, nama: member.nama }
    : null;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [stats, members, blacklist, events, testers, feedback, recruitmentStatus] =
    await Promise.all([
      getAdminStats(),
      getMembersForAdmin(),
      getBlacklist(),
      getEvents(),
      getTesters(),
      getFeedback(),
      getRecruitmentStatus()
    ]);

  return {
    stats,
    members,
    blacklist,
    events,
    testers,
    feedback,
    recruitmentStatus
  };
}
