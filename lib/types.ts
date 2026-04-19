export type MemberStatus = "approved" | "pending" | "blacklist" | "warning";

export interface Member {
  id: string;
  nama: string;
  nickname: string;
  gender: string | null;
  tanggal_lahir: string | null;
  domisili: string | null;
  no_hp: string | null;
  division: string | null;
  role: string;
  photo_url: string | null;
  status: MemberStatus | string;
  join_date: string;
  created_at?: string;
  member_password_hash?: string | null;
}

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  banner_url: string | null;
}

export interface Tester {
  id: string;
  nama: string;
  whatsapp: string;
  is_online: boolean;
}

export interface FeedbackItem {
  id: string;
  name: string | null;
  category: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface BlacklistEntry {
  id: string;
  nama: string;
  nickname: string;
  status: string;
  durasi: string;
  alasan: string | null;
  created_at: string;
}

export interface AdminStats {
  totalMembers: number;
  pendingApproval: number;
  blacklistCount: number;
  unreadFeedback: number;
}

export interface DashboardData {
  stats: AdminStats;
  members: Member[];
  blacklist: BlacklistEntry[];
  events: EventItem[];
  testers: Tester[];
  feedback: FeedbackItem[];
  recruitmentStatus: string;
}
