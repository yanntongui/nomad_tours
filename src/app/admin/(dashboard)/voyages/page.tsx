"use client";
import * as React from "react";
import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Users, MapPin, Settings2, Check, Send, X } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { DataTable } from "@/components/admin/DataTable";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useTrips,
  useTripTasks,
  updateTaskStatus,
  useCommunicationQueue,
  validateCommunication,
  sendCommunication,
  cancelCommunication,
} from "@/lib/admin/store/trips-store";
import { useAdminRole } from "@/context/AdminRoleContext";
import { Trip, TripStatus, TripTask, TaskStatus, TripCommunication } from "@/lib/admin/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}
function formatDay(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "short" });
}

const GROUPS: { status: TripStatus; label: string }[] = [
  { status: "UPCOMING", label: "À venir" },
  { status: "ONGOING", label: "En cours" },
  { status: "COMPLETED", label: "Terminés" },
];

const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  FAIT: "Fait",
  BLOQUE: "Bloqué",
};

const CHANNEL_LABELS: Record<TripCommunication["channel"], string> = { EMAIL: "Email", SMS: "SMS", PUSH: "Push" };

function TripCard({ trip }: { trip: Trip }) {
  const doneCount = trip.participants.reduce((sum, p) => sum + p.checklist.filter((c) => c.done).length, 0);
  const totalCount = trip.participants.reduce((sum, p) => sum + p.checklist.length, 0);
  return (
    <Link href={`/admin/voyages/${trip.id}`}>
      <Card className="hover:border-luxe-terracotta/40 hover:shadow-md transition-all h-full">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <StatusBadge status={trip.status} />
            <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500">{trip.bookingNumber}</span>
          </div>
          <p className="text-sm font-semibold text-stone-800 truncate dark:text-stone-100">{trip.title}</p>
          <p className="text-xs text-stone-500 flex items-center gap-1 dark:text-stone-400"><MapPin className="h-3 w-3" />{trip.clientName}</p>
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1.5 border-t border-stone-100 dark:text-stone-400 dark:border-stone-800">
            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{trip.participants.length} pers.</span>
            <span>{formatDate(trip.startDate)} → {formatDate(trip.endDate)}</span>
          </div>
          {trip.guideName && <p className="text-[11px] text-stone-400 dark:text-stone-500">Guide : {trip.guideName}</p>}
          {totalCount > 0 && (
            <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden dark:bg-stone-800">
              <div className="h-full bg-luxe-terracotta" style={{ width: `${Math.round((doneCount / totalCount) * 100)}%` }} />
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

function GroupedView() {
  const trips = useTrips();
  return (
    <div className="space-y-8">
      {GROUPS.map((group) => {
        const groupTrips = trips.filter((t) => t.status === group.status);
        return (
          <div key={group.status} className="space-y-3">
            <h2 className="text-sm font-bold text-stone-700 flex items-center gap-2 dark:text-stone-300">
              {group.label}
              <span className="text-xs font-normal text-stone-400 dark:text-stone-500">({groupTrips.length})</span>
            </h2>
            {groupTrips.length === 0 ? (
              <p className="text-sm text-stone-400 py-4 dark:text-stone-500">Aucun voyage {group.label.toLowerCase()}.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {groupTrips.map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ThisWeekView() {
  const trips = useTrips();
  const tasks = useTripTasks();
  const { user } = useAdminRole();
  const tripById = React.useMemo(() => new Map(trips.map((t) => [t.id, t])), [trips]);

  const upcoming = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const in7 = new Date(today);
    in7.setDate(in7.getDate() + 7);
    return tasks
      .filter((t) => t.status !== "FAIT" && new Date(t.dueDate) >= today && new Date(t.dueDate) <= in7)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks]);

  const byDay = React.useMemo(() => {
    const map = new Map<string, TripTask[]>();
    upcoming.forEach((task) => {
      const key = new Date(task.dueDate).toDateString();
      map.set(key, [...(map.get(key) ?? []), task]);
    });
    return Array.from(map.entries());
  }, [upcoming]);

  if (upcoming.length === 0) {
    return <p className="text-sm text-stone-400 py-8 text-center dark:text-stone-500">Aucune tâche à échéance cette semaine.</p>;
  }

  return (
    <div className="space-y-6">
      {byDay.map(([day, dayTasks]) => (
        <div key={day} className="space-y-2">
          <h3 className="text-sm font-bold text-stone-700 capitalize dark:text-stone-300">{formatDay(dayTasks[0].dueDate)}</h3>
          <div className="rounded-xl border border-stone-200 bg-white divide-y divide-stone-100 dark:border-stone-800 dark:bg-stone-900 dark:divide-stone-800">
            {dayTasks.map((task) => {
              const trip = tripById.get(task.tripId);
              return (
                <div key={task.id} className="flex flex-wrap items-center gap-3 p-3">
                  <div className="flex-1 min-w-[180px]">
                    <Link href={`/admin/voyages/${task.tripId}`} className="text-sm font-medium text-stone-800 hover:text-luxe-terracotta dark:text-stone-100">
                      {trip?.title ?? "Voyage"}
                    </Link>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{task.title}</p>
                  </div>
                  <StatusBadge status={task.phase} />
                  {task.priority === "URGENTE" && <StatusBadge status="URGENTE" />}
                  <span className="text-xs text-stone-400 w-24 dark:text-stone-500">{task.assigneeName ?? "—"}</span>
                  <Select value={task.status} onValueChange={(v) => updateTaskStatus(task.id, v as TaskStatus, user.name)}>
                    <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>{TASK_STATUS_LABELS[s]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function CommunicationsView() {
  const communications = useCommunicationQueue();
  const trips = useTrips();
  const { user } = useAdminRole();
  const [cancelTarget, setCancelTarget] = React.useState<TripCommunication | null>(null);
  const tripById = React.useMemo(() => new Map(trips.map((t) => [t.id, t])), [trips]);

  const columns = React.useMemo<ColumnDef<TripCommunication, any>[]>(
    () => [
      {
        id: "trip",
        header: "Voyage",
        cell: ({ row }) => {
          const trip = tripById.get(row.original.tripId);
          return trip ? (
            <Link href={`/admin/voyages/${trip.id}`} className="text-sm font-medium text-stone-800 hover:text-luxe-terracotta dark:text-stone-100" onClick={(e) => e.stopPropagation()}>
              {trip.title}
            </Link>
          ) : <span className="text-sm text-stone-500 dark:text-stone-400">—</span>;
        },
      },
      {
        id: "recipients",
        header: "Destinataires",
        cell: ({ row }) => (
          <span className="text-sm text-stone-600 dark:text-stone-400">
            {row.original.recipientParticipantIds.length === 0 ? "Tous les participants" : `${row.original.recipientParticipantIds.length} participant(s)`}
          </span>
        ),
      },
      { id: "channel", header: "Canal", cell: ({ row }) => <StatusBadge status={row.original.channel} label={CHANNEL_LABELS[row.original.channel]} /> },
      { id: "status", header: "Statut", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
      {
        id: "date",
        header: "Date",
        cell: ({ row }) => <span className="text-sm text-stone-500 dark:text-stone-400">{row.original.sentAt ? formatDate(row.original.sentAt) : "—"}</span>,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {row.original.status === "EN_ATTENTE_VALIDATION" && (
              <Button variant="ghost" size="sm" onClick={() => validateCommunication(row.original.id, user.name)}>
                <Check className="h-3.5 w-3.5" />
                Valider
              </Button>
            )}
            {row.original.status === "PROGRAMMEE" && (
              <Button variant="ghost" size="sm" onClick={() => sendCommunication(row.original.id, user.name)}>
                <Send className="h-3.5 w-3.5" />
                Envoyer
              </Button>
            )}
            {(row.original.status === "EN_ATTENTE_VALIDATION" || row.original.status === "PROGRAMMEE") && (
              <Button variant="ghost" size="sm" onClick={() => setCancelTarget(row.original)}>
                <X className="h-3.5 w-3.5 text-red-500" />
                Annuler
              </Button>
            )}
          </div>
        ),
      },
    ],
    [tripById, user.name]
  );

  return (
    <div className="space-y-3">
      <DataTable columns={columns} data={communications} getRowId={(c) => c.id} emptyMessage="Aucune communication." />
      <ConfirmDialog
        open={Boolean(cancelTarget)}
        onOpenChange={(open) => !open && setCancelTarget(null)}
        title="Annuler cette communication ?"
        destructive
        confirmLabel="Annuler la communication"
        onConfirm={() => cancelTarget && cancelCommunication(cancelTarget.id, user.name)}
      />
    </div>
  );
}

export default function VoyagesPage() {
  const trips = useTrips();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Voyages en cours</h1>
          <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">{trips.length} voyage{trips.length > 1 ? "s" : ""} au total</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/voyages/modeles">
            <Settings2 className="h-4 w-4" />
            Modèles
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="grouped">
        <TabsList>
          <TabsTrigger value="grouped">Groupée</TabsTrigger>
          <TabsTrigger value="week">Cette semaine</TabsTrigger>
          <TabsTrigger value="comms">Communications</TabsTrigger>
        </TabsList>
        <TabsContent value="grouped"><GroupedView /></TabsContent>
        <TabsContent value="week"><ThisWeekView /></TabsContent>
        <TabsContent value="comms"><CommunicationsView /></TabsContent>
      </Tabs>
    </div>
  );
}
