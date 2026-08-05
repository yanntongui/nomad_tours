import { AdminUser } from "@/lib/admin/types";

export const ADMIN_USERS: AdminUser[] = [
  { id: "u-super", name: "Fabrice Adjovi", email: "fabrice@nomadtours.bj", role: "SUPER_ADMIN", avatarColor: "#C4633A", active: true },
  { id: "u-agent-1", name: "Sandra Houngbédji", email: "sandra@nomadtours.bj", role: "AGENT", avatarColor: "#1B4332", active: true },
  { id: "u-agent-2", name: "Roméo Agbodjan", email: "romeo@nomadtours.bj", role: "AGENT", avatarColor: "#C9A227", active: true },
  { id: "u-guide-1", name: "Idrissou Boukari", email: "idrissou@nomadtours.bj", role: "GUIDE", avatarColor: "#2563EB", active: true },
  { id: "u-guide-2", name: "Colette Zinsou", email: "colette@nomadtours.bj", role: "GUIDE", avatarColor: "#DB2777", active: false },
];

export const AGENTS = ADMIN_USERS.filter((u) => u.role === "AGENT" || u.role === "SUPER_ADMIN");
export const GUIDES = ADMIN_USERS.filter((u) => u.role === "GUIDE");
