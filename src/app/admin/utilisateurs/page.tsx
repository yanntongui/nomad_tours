"use client";
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Search, UserX, UserCheck, Pencil } from "lucide-react";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { RequireSuperAdmin } from "@/components/admin/RequireSuperAdmin";
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
import { useUsersStore, addUser, updateUser, toggleUserActive, UserInput } from "@/lib/admin/store/users-store";
import { AdminRole, AdminUser } from "@/lib/admin/types";

const ROLE_LABELS: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super Admin",
  AGENT: "Agent commercial",
  GUIDE: "Guide",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const EMPTY_FORM: UserInput = { name: "", email: "", phone: "", role: "AGENT" };

function UserFormDialog({
  open,
  onOpenChange,
  editingUser,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: AdminUser | null;
}) {
  const [form, setForm] = React.useState<UserInput>(EMPTY_FORM);

  React.useEffect(() => {
    if (open) {
      setForm(editingUser ? { name: editingUser.name, email: editingUser.email, phone: editingUser.phone ?? "", role: editingUser.role } : EMPTY_FORM);
    }
  }, [open, editingUser]);

  const valid = form.name.trim().length > 1 && form.email.includes("@");

  const submit = () => {
    if (!valid) return;
    if (editingUser) {
      updateUser(editingUser.id, form);
    } else {
      addUser(form);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Nom complet</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ex. Awa Mensah" />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nom@nomadtours.bj" />
          </div>
          <div className="space-y-1.5">
            <Label>Téléphone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+229 ..." />
          </div>
          <div className="space-y-1.5">
            <Label>Rôle</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as AdminRole })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(ROLE_LABELS) as AdminRole[]).map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABELS[r]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid} onClick={submit}>{editingUser ? "Enregistrer" : "Créer l'utilisateur"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UtilisateursContent() {
  const store = useUsersStore();
  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState<string>("ALL");
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<AdminUser | null>(null);
  const [toggleTarget, setToggleTarget] = React.useState<AdminUser | null>(null);

  const filtered = React.useMemo(() => {
    return store.users.filter((u) => {
      if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (role !== "ALL" && u.role !== role) return false;
      return true;
    });
  }, [store.users, search, role]);

  const columns = React.useMemo<ColumnDef<AdminUser, any>[]>(
    () => [
      {
        id: "name",
        header: "Utilisateur",
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: row.original.avatarColor }}
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
          <StatusBadge status={row.original.active ? "CONFIRMED" : "CANCELLED"} label={row.original.active ? "Actif" : "Inactif"} />
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
              <DropdownMenuItem onSelect={() => { setEditingUser(row.original); setFormOpen(true); }}>
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setToggleTarget(row.original)}>
                {row.original.active ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                {row.original.active ? "Désactiver" : "Réactiver"}
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
          <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">{filtered.length} utilisateur{filtered.length > 1 ? "s" : ""} sur {store.users.length}</p>
        </div>
        <Button onClick={() => { setEditingUser(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>

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

      <DataTable
        columns={columns}
        data={filtered}
        getRowId={(u) => u.id}
        emptyMessage="Aucun utilisateur ne correspond aux filtres."
      />

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} editingUser={editingUser} />

      <ConfirmDialog
        open={Boolean(toggleTarget)}
        onOpenChange={(open) => !open && setToggleTarget(null)}
        title={toggleTarget?.active ? "Désactiver cet utilisateur ?" : "Réactiver cet utilisateur ?"}
        description={
          toggleTarget?.active
            ? "Il n'apparaîtra plus dans les listes d'assignation (agent, guide)."
            : "Il redeviendra disponible pour les assignations."
        }
        destructive={toggleTarget?.active}
        confirmLabel={toggleTarget?.active ? "Désactiver" : "Réactiver"}
        onConfirm={() => {
          if (toggleTarget) toggleUserActive(toggleTarget.id);
        }}
      />
    </div>
  );
}

export default function UtilisateursPage() {
  return (
    <RequireSuperAdmin>
      <UtilisateursContent />
    </RequireSuperAdmin>
  );
}
