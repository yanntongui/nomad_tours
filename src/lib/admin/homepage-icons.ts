import { Compass, Plane, FileCheck, PartyPopper, Headphones, Wallet, Car, Home, LucideIcon } from "lucide-react";
import { HomepageIconKey } from "@/lib/admin/types";

export const HOMEPAGE_ICON_MAP: Record<HomepageIconKey, LucideIcon> = {
  COMPASS: Compass,
  PLANE: Plane,
  FILE_CHECK: FileCheck,
  PARTY_POPPER: PartyPopper,
  HEADPHONES: Headphones,
  WALLET: Wallet,
  CAR: Car,
  HOME: Home,
};

export const HOMEPAGE_ICON_OPTIONS: { key: HomepageIconKey; label: string }[] = [
  { key: "COMPASS", label: "Boussole" },
  { key: "PLANE", label: "Avion" },
  { key: "FILE_CHECK", label: "Document validé" },
  { key: "PARTY_POPPER", label: "Fête" },
  { key: "HEADPHONES", label: "Casque / support" },
  { key: "WALLET", label: "Portefeuille" },
  { key: "CAR", label: "Voiture" },
  { key: "HOME", label: "Maison" },
];
