"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const LABELS: Record<string, string> = {
  admin: "Dashboard",
  reservations: "Réservations",
  voyages: "Voyages en cours",
  destinations: "Destinations",
  circuits: "Circuits",
  visas: "Demandes de Visa",
  evenementiel: "Événementiel",
  clients: "Clients",
  paiements: "Paiements",
  contenu: "Contenu (CMS)",
  utilisateurs: "Utilisateurs & Rôles",
  journal: "Journal d'audit",
  parametres: "Paramètres",
  new: "Nouveau",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1.5 text-xs text-stone-500 overflow-hidden dark:text-stone-400">
      <Link href="/admin" className="flex items-center gap-1 hover:text-stone-800 shrink-0 dark:hover:text-stone-200">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {segments.map((segment, i) => {
        const href = "/" + segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        const label = LABELS[segment] ?? decodeURIComponent(segment);
        return (
          <span key={href} className="flex items-center gap-1.5 min-w-0">
            <ChevronRight className="h-3 w-3 shrink-0 text-stone-300 dark:text-stone-700" />
            {isLast ? (
              <span className="font-medium text-stone-800 truncate dark:text-stone-100">{label}</span>
            ) : (
              <Link href={href} className="hover:text-stone-800 truncate dark:hover:text-stone-200">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
