"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { UserX, UserCheck, Pencil, Search } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateAdminProfileAction, setAdminProfileActiveAction } from "./actions";
import type { Tables, Enums } from "@/lib/server/types";

export type AdminProfileRow = Tables<"admin_profiles">;
type AdminRole = Enums<"admin_role">;

const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  AGENT: "Agent commercial",
  GUIDE: "Guide",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

interface FormValues {
  name: string;
  phone: string;
  role: AdminRole;
}

function UserEditDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: AdminProfileRow | null;
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<FormValues>({ name: "", phone: "", role: "AGENT" });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open && editing) {
      setForm({ name: editing.name, phone: editing.phone ?? "", role: editing.role });
      setError(null);
    }
  }, [open, editing]);

  const valid = form.name.trim().length > 1;

  async function submit() {
    if (!editing || !valid) return;
    setSaving(true);
    setError(null);
    const result = await updateAdminProfileAction(editing.id, {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      role: form.role,
    });
    setSaving(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Nom complet</Label>
            <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Ex. Awa Mensah" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={editing?.email ?? ""} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Téléphone</Label>
            <Input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+229 ..." />
          </div>
          <div className="space-y-1.5">
            <Label>Rôle</Label>
            <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v as AdminRole }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid || saving} onClick={submit}>{saving ? "Enregistrement..." : "Enregistrer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UtilisateursClient({ users }: { users: AdminProfileRow[] }) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState<string>("ALL");
  const [editingUser, setEditingUser] = React.useState<AdminProfileRow | null>(null);
  const [toggleTarget, setToggleTarget] = React.useState<AdminProfileRow | null>(null);
  const [toggleError, setToggleError] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    return users.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (role !== "ALL" && u.role !== role) return false;
      return true;
    });
  }, [users, search, role]);

  const columns = React.useMemo<ColumnDef<AdminProfileRow, any>[]>(
    () => [
      {
        id: "name",
        header: "Utilisateur",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: row.original.avatar_color }}
            >
              {initials(row.original.name)}
            </span>
            <div>
              <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.name}</p>
              <p className="text-xs text-stone-400 dark:text-stone-500">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: "phone", header: "Téléphone", cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">{row.original.phone || "—"}</span> },
      { id: "role", header: "Rôle", cell: ({ row }) => <StatusBadge status={row.original.role} /> },
      {
        id: "active",
        header: "Statut",
        cell: ({ row }) => (
          <StatusBadge status={row.original.active ? "CONFIRMED" : "CANCELLED"} label={row.original.active ? "Actif" : "En attente / Inactif"} />
        ),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onSelect={() => setEditingUser(row.original)}>
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setToggleTarget(row.original)}>
                {row.original.active ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                {row.original.active ? "Désactiver" : "Activer"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Utilisateurs & Rôles</h1>
          <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">{filtered.length} utilisateur{filtered.length > 1 ? "s" : ""} sur {users.length}</p>
        </div>
      </div>

      <p className="text-sm text-stone-500 dark:text-stone-400">
        Les nouveaux comptes sont créés via la page d&apos;inscription (<code>/admin/inscription</code>) puis apparaissent ici en attente d&apos;activation.
      </p>

      <div className="rounded-xl border border-stone-200 bg-white p-3 flex flex-wrap items-center gap-2 dark:border-stone-800 dark:bg-stone-900">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
          <Input placeholder="Nom ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-52"><SelectValue placeholder="Rôle" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous les rôles</SelectItem>
            {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
              <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {toggleError && <p className="text-sm text-red-600 dark:text-red-400">{toggleError}</p>}

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(u) => u.id}
        emptyMessage="Aucun utilisateur ne correspond aux filtres."
      />

      <UserEditDialog open={Boolean(editingUser)} onOpenChange={(open) => !open && setEditingUser(null)} editing={editingUser} />

      <ConfirmDialog
        open={Boolean(toggleTarget)}
        onOpenChange={(open) => !open && setToggleTarget(null)}
        title={toggleTarget?.active ? "Désactiver cet utilisateur ?" : "Activer cet utilisateur ?"}
        description={
          toggleTarget?.active
            ? "Il n'apparaîtra plus dans les listes d'assignation (agent, guide) et ne pourra plus se connecter."
            : "Il redeviendra disponible pour les assignations et pourra se connecter."
        }
        destructive={toggleTarget?.active}
        confirmLabel={toggleTarget?.active ? "Désactiver" : "Activer"}
        onConfirm={async () => {
          if (!toggleTarget) return;
          setToggleError(null);
          const result = await setAdminProfileActiveAction(toggleTarget.id, !toggleTarget.active);
          if (result.error) setToggleError(result.error);
          else router.refresh();
        }}
      />
    </div>
  );
}
