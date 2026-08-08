import type { Enums } from "@/lib/server/types";

export type VipTier = Enums<"vip_tier">;

export const VIP_TIERS: VipTier[] = ["STANDARD", "SILVER", "GOLD", "PLATINUM"];

export function tierRank(tier: VipTier) {
  return VIP_TIERS.indexOf(tier);
}
