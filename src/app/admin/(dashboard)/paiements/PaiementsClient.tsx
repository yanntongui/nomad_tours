"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Wallet, Clock, AlertCircle, FileDown } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { KpiCard } from "@/components/admin/KpiCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PaymentListRow, PaymentScheduleListRow } from "@/lib/server/bookings";
import type { Tables } from "@/lib/server/types";

type PaymentMethod = Tables<"payments">["method"];

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

const METHOD_LABELS: Record<PaymentMethod, string> = {
  MOBILE_MONEY_MTN: "Mobile Money MTN",
  MOBILE_MONEY_MOOV: "Mobile Money Moov",
  FEDAPAY: "FedaPay",
  STRIPE_CARD: "Carte bancaire",
  BANK_TRANSFER: "Virement bancaire",
  CASH: "Espèces",
};

export function PaiementsClient({ payments, schedules }: { payments: PaymentListRow[]; schedules: PaymentScheduleListRow[] }) {
  const router = useRouter();

  const totalEncaisse = React.useMemo(() => payments.reduce((sum, p) => sum + p.amount_xof, 0), [payments]);
  const totalEnAttente = React.useMemo(
    () => schedules.filter((s) => s.status === "PENDING").reduce((sum, s) => sum + s.amount_xof, 0),
    [schedules]
  );
  const lateSchedules = React.useMemo(() => schedules.filter((s) => s.status === "LATE"), [schedules]);
  const totalEnRetard = React.useMemo(() => lateSchedules.reduce((sum, s) => sum + s.amount_xof, 0), [lateSchedules]);

  const paymentColumns = React.useMemo<ColumnDef<PaymentListRow, any>[]>(
    () => [
      {
        id: "booking",
        header: "Réservation",
        cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.bookings?.booking_number ?? row.original.booking_id}</span>,
      },
      {
        id: "client",
        header: "Client",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.bookings?.clients?.name ?? "—"}</span>,
      },
      {
        accessorKey: "amount_xof",
        header: "Montant",
        cell: ({ row }) => <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(row.original.amount_xof)}</span>,
      },
      {
        accessorKey: "method",
        header: "Méthode",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{METHOD_LABELS[row.original.method]}</span>,
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "created_at",
        header: "Date",
        cell: ({ row }) => <span className="text-sm text-stone-500 dark:text-stone-400">{formatDate(row.original.created_at)}</span>,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/reservations/${row.original.booking_id}`);
              }}
            >
              Voir la réservation
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.print();
              }}
            >
              <FileDown className="h-3.5 w-3.5" />
              Facture
            </Button>
          </div>
        ),
      },
    ],
    [router]
  );

  const scheduleColumns = React.useMemo<ColumnDef<PaymentScheduleListRow, any>[]>(
    () => [
      {
        id: "booking",
        header: "Réservation",
        cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.bookings?.booking_number ?? row.original.booking_id}</span>,
      },
      {
        id: "client",
        header: "Client",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.bookings?.clients?.name ?? "—"}</span>,
      },
      {
        accessorKey: "due_date",
        header: "Échéance",
        cell: ({ row }) => <span className="text-sm text-red-600 font-medium">{formatDate(row.original.due_date)}</span>,
      },
      {
        accessorKey: "amount_xof",
        header: "Montant",
        cell: ({ row }) => <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">{formatXOF(row.original.amount_xof)}</span>,
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/reservations/${row.original.booking_id}`);
            }}
          >
            Voir la réservation
          </Button>
        ),
      },
    ],
    [router]
  );

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Paiements & Facturation</h1>
        <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">Vue consolidée des encaissements et échéanciers.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total encaissé" value={formatXOF(totalEncaisse)} icon={Wallet} helper="tous paiements" />
        <KpiCard label="En attente" value={formatXOF(totalEnAttente)} icon={Clock} helper="échéances à venir" />
        <KpiCard label="En retard" value={formatXOF(totalEnRetard)} icon={AlertCircle} helper={`${lateSchedules.length} échéance${lateSchedules.length > 1 ? "s" : ""}`} />
        <KpiCard label="Paiements enregistrés" value={String(payments.length)} icon={Wallet} />
      </div>

      <Tabs defaultValue="tous">
        <TabsList>
          <TabsTrigger value="tous">Tous les paiements</TabsTrigger>
          <TabsTrigger value="retard">Échéances en retard ({lateSchedules.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="tous">
          <DataTable
            columns={paymentColumns}
            data={payments}
            getRowId={(p) => p.id}
            emptyMessage="Aucun paiement enregistré."
          />
        </TabsContent>
        <TabsContent value="retard">
          <DataTable
            columns={scheduleColumns}
            data={lateSchedules}
            getRowId={(s) => s.id}
            emptyMessage="Aucune échéance en retard."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
