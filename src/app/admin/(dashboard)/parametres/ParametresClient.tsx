"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Save, Moon, Wallet, Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  CommTemplateFormDialog,
  CHANNEL_LABELS,
  type CommunicationTemplateRow,
} from "@/components/admin/CommTemplateFormDialog";
import { updateAgencySettingsAction } from "./actions";
import { deleteCommunicationTemplateAction } from "@/app/admin/(dashboard)/voyages/modeles/actions";
import type { AgencySettingsRow } from "@/lib/server/settings";
import { updateSettings as updateThemeSettings } from "@/lib/admin/store/settings-store";
import { usePaymentSettings, updatePaymentSettings } from "@/lib/admin/store/payment-settings-store";
import {
  useCurrencies,
  createEmptyCurrency,
  upsertCurrency,
  deleteCurrency,
} from "@/lib/admin/store/currencies-store";
import { PaymentSettings, CurrencyRate } from "@/lib/admin/types";

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-lg border border-stone-200 p-3 cursor-pointer hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800/50">
      <Checkbox checked={checked} onCheckedChange={(v) => onCheckedChange(Boolean(v))} className="mt-0.5" />
      <div>
        <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{label}</p>
        <p className="text-xs text-stone-500 dark:text-stone-400">{description}</p>
      </div>
    </label>
  );
}

function EmailTemplatesTab({ templates }: { templates: CommunicationTemplateRow[] }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CommunicationTemplateRow | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<CommunicationTemplateRow | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<CommunicationTemplateRow, any>[]>(
    () => [
      { accessorKey: "name", header: "Modèle", cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.name}</span> },
      { id: "channel", header: "Canal", cell: ({ row }) => <StatusBadge status={row.original.channel} label={CHANNEL_LABELS[row.original.channel]} /> },
      {
        id: "body",
        header: "Aperçu",
        cell: ({ row }) => <span className="text-sm text-stone-500 line-clamp-1 max-w-xs block dark:text-stone-400">{row.original.body}</span>,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onSelect={() => { setEditing(row.original); setFormOpen(true); }}>
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDeleteTarget(row.original)} className="text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
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
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Nouveau modèle
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <DataTable
        columns={columns}
        data={templates}
        getRowId={(t) => t.id}
        onRowClick={(t) => { setEditing(t); setFormOpen(true); }}
        emptyMessage="Aucun modèle système."
      />
      <CommTemplateFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} scope="SYSTEM" />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer ce modèle ?"
        description="Les communications déjà envoyées ne sont pas affectées."
        destructive
        confirmLabel="Supprimer"
        onConfirm={async () => {
          if (!deleteTarget) return;
          const result = await deleteCommunicationTemplateAction(deleteTarget.id);
          if (result.error) setError(result.error);
          else router.refresh();
        }}
      />
    </div>
  );
}

function CurrencyFormDialog({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: CurrencyRate | null;
}) {
  const [form, setForm] = React.useState<CurrencyRate>(() => editing ?? createEmptyCurrency());

  React.useEffect(() => {
    if (open) setForm(editing ?? createEmptyCurrency());
  }, [open, editing]);

  function set<K extends keyof CurrencyRate>(key: K, value: CurrencyRate[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const valid = form.code.trim().length > 0 && form.label.trim().length > 0 && form.rateToXOF > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier la devise" : "Nouvelle devise"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="Ex. EUR" maxLength={3} />
            </div>
            <div className="space-y-1.5">
              <Label>Taux vers XOF</Label>
              <Input
                type="number"
                step="0.001"
                value={form.rateToXOF}
                onChange={(e) => set("rateToXOF", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Libellé</Label>
            <Input value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="Ex. Euro" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button
            disabled={!valid}
            onClick={() => {
              upsertCurrency(form);
              onOpenChange(false);
            }}
          >
            {editing ? "Enregistrer" : "Créer la devise"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CurrenciesTab() {
  const currencies = useCurrencies();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CurrencyRate | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<CurrencyRate | null>(null);

  const columns = React.useMemo<ColumnDef<CurrencyRate, any>[]>(
    () => [
      { accessorKey: "code", header: "Code", cell: ({ row }) => <StatusBadge status={row.original.code} label={row.original.code} /> },
      { accessorKey: "label", header: "Libellé", cell: ({ row }) => <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{row.original.label}</span> },
      {
        id: "rate",
        header: "Taux vers XOF",
        cell: ({ row }) => <span className="text-sm text-stone-600 dark:text-stone-400">1 {row.original.code} = {row.original.rateToXOF.toLocaleString("fr-FR")} XOF</span>,
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onSelect={() => { setEditing(row.original); setFormOpen(true); }}>
                <Pencil className="h-3.5 w-3.5" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDeleteTarget(row.original)} className="text-red-600">
                <Trash2 className="h-3.5 w-3.5" />
                Supprimer
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
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Nouvelle devise
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={currencies}
        getRowId={(c) => c.id}
        onRowClick={(c) => { setEditing(c); setFormOpen(true); }}
        emptyMessage="Aucune devise."
      />
      <CurrencyFormDialog open={formOpen} onOpenChange={setFormOpen} editing={editing} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Supprimer cette devise ?"
        description="Les montants déjà affichés dans cette devise ne sont pas recalculés rétroactivement."
        destructive
        confirmLabel="Supprimer"
        onConfirm={() => deleteTarget && deleteCurrency(deleteTarget.id)}
      />
    </div>
  );
}

export function ParametresClient({
  agencySettings,
  commTemplates,
}: {
  agencySettings: AgencySettingsRow;
  commTemplates: CommunicationTemplateRow[];
}) {
  const router = useRouter();
  const [form, setForm] = React.useState<AgencySettingsRow>(agencySettings);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setForm(agencySettings);
  }, [agencySettings]);

  const dirty = JSON.stringify(form) !== JSON.stringify(agencySettings);

  const set = <K extends keyof AgencySettingsRow>(key: K, value: AgencySettingsRow[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  async function save(patch: Partial<AgencySettingsRow>) {
    setSaving(true);
    setError(null);
    const result = await updateAgencySettingsAction(patch);
    setSaving(false);
    if (result.error) setError(result.error);
    else router.refresh();
  }

  async function toggle<K extends keyof AgencySettingsRow>(key: K, value: AgencySettingsRow[K]) {
    set(key, value);
    if (key === "dark_mode") updateThemeSettings({ darkMode: value as boolean });
    await save({ [key]: value } as Partial<AgencySettingsRow>);
  }

  const paymentSettings = usePaymentSettings();
  const [paymentForm, setPaymentForm] = React.useState<PaymentSettings>(paymentSettings);

  React.useEffect(() => {
    setPaymentForm(paymentSettings);
  }, [paymentSettings]);

  const paymentDirty = JSON.stringify(paymentForm) !== JSON.stringify(paymentSettings);

  const setPayment = <K extends keyof PaymentSettings>(key: K, value: PaymentSettings[K]) => {
    setPaymentForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Paramètres</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Configuration générale de l&apos;agence.</p>
      </div>

      <Tabs defaultValue="agence">
        <TabsList>
          <TabsTrigger value="agence">Agence</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="apparence">Apparence</TabsTrigger>
          <TabsTrigger value="paiements">Moyens de paiement</TabsTrigger>
          <TabsTrigger value="emails">Templates d&apos;emails</TabsTrigger>
          <TabsTrigger value="devises">Devises & taux de change</TabsTrigger>
        </TabsList>

        <TabsContent value="agence">
          <Card>
            <CardHeader><CardTitle className="text-sm">Coordonnées de l&apos;agence</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nom de l&apos;agence</Label>
                  <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Téléphone</Label>
                  <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>WhatsApp</Label>
                  <Input value={form.whatsapp ?? ""} onChange={(e) => set("whatsapp", e.target.value)} />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Adresse</Label>
                  <Input value={form.address} onChange={(e) => set("address", e.target.value)} />
                </div>
              </div>
              {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
              <Button
                disabled={!dirty || saving}
                onClick={() =>
                  save({
                    name: form.name,
                    email: form.email,
                    phone: form.phone,
                    whatsapp: form.whatsapp,
                    address: form.address,
                  })
                }
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader><CardTitle className="text-sm">Notifications par email</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <ToggleRow
                label="Nouvelle réservation"
                description="Recevoir un email à chaque nouvelle réservation créée."
                checked={form.notify_new_booking}
                onCheckedChange={(v) => toggle("notify_new_booking", v)}
              />
              <ToggleRow
                label="Nouvelle demande de visa"
                description="Recevoir un email à chaque nouvelle demande de visa soumise."
                checked={form.notify_new_visa}
                onCheckedChange={(v) => toggle("notify_new_visa", v)}
              />
              <ToggleRow
                label="Nouvelle demande événementielle"
                description="Recevoir un email à chaque nouvelle demande événementielle."
                checked={form.notify_new_event}
                onCheckedChange={(v) => toggle("notify_new_event", v)}
              />
              <ToggleRow
                label="Échéance de paiement en retard"
                description="Recevoir une alerte quand une échéance passe en retard."
                checked={form.notify_payment_late}
                onCheckedChange={(v) => toggle("notify_payment_late", v)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apparence">
          <Card>
            <CardHeader><CardTitle className="text-sm">Apparence</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow
                label="Mode sombre"
                description="Bascule l'interface d'administration en thème sombre. Le site public n'est pas concerné."
                checked={form.dark_mode}
                onCheckedChange={(v) => toggle("dark_mode", v)}
              />
              {form.dark_mode && (
                <div className="flex items-center gap-2 rounded-lg bg-stone-100 dark:bg-stone-800 p-3 text-xs text-stone-500 dark:text-stone-400">
                  <Moon className="h-3.5 w-3.5" />
                  Mode sombre activé.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paiements" className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-stone-100 p-3 text-xs text-stone-500 dark:bg-stone-800 dark:text-stone-400">
            <Wallet className="h-3.5 w-3.5 shrink-0" />
            Configuration de démonstration — aucun appel n&apos;est envoyé aux prestataires de paiement.
          </div>

          <Card>
            <CardHeader><CardTitle className="text-sm">FedaPay</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow
                label="Activer FedaPay"
                description="Mobile Money, cartes bancaires locales via FedaPay."
                checked={paymentForm.fedapayEnabled}
                onCheckedChange={(v) => setPayment("fedapayEnabled", v)}
              />
              {paymentForm.fedapayEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Clé publique</Label>
                    <Input value={paymentForm.fedapayPublicKey} onChange={(e) => setPayment("fedapayPublicKey", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Clé secrète</Label>
                    <Input type="password" value={paymentForm.fedapaySecretKey} onChange={(e) => setPayment("fedapaySecretKey", e.target.value)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Stripe</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow
                label="Activer Stripe"
                description="Paiements par carte bancaire internationale."
                checked={paymentForm.stripeEnabled}
                onCheckedChange={(v) => setPayment("stripeEnabled", v)}
              />
              {paymentForm.stripeEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Clé publiable</Label>
                    <Input value={paymentForm.stripePublishableKey} onChange={(e) => setPayment("stripePublishableKey", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Clé secrète</Label>
                    <Input type="password" value={paymentForm.stripeSecretKey} onChange={(e) => setPayment("stripeSecretKey", e.target.value)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Mobile Money</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow
                label="MTN Mobile Money"
                description="Numéro de réception des paiements MTN."
                checked={paymentForm.mobileMoneyMtnEnabled}
                onCheckedChange={(v) => setPayment("mobileMoneyMtnEnabled", v)}
              />
              {paymentForm.mobileMoneyMtnEnabled && (
                <div className="space-y-1.5">
                  <Label>Numéro MTN</Label>
                  <Input value={paymentForm.mobileMoneyMtnNumber} onChange={(e) => setPayment("mobileMoneyMtnNumber", e.target.value)} />
                </div>
              )}
              <ToggleRow
                label="Moov Money"
                description="Numéro de réception des paiements Moov."
                checked={paymentForm.mobileMoneyMoovEnabled}
                onCheckedChange={(v) => setPayment("mobileMoneyMoovEnabled", v)}
              />
              {paymentForm.mobileMoneyMoovEnabled && (
                <div className="space-y-1.5">
                  <Label>Numéro Moov</Label>
                  <Input value={paymentForm.mobileMoneyMoovNumber} onChange={(e) => setPayment("mobileMoneyMoovNumber", e.target.value)} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Virement bancaire</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <ToggleRow
                label="Activer le virement bancaire"
                description="Afficher les coordonnées bancaires sur les factures et devis."
                checked={paymentForm.bankTransferEnabled}
                onCheckedChange={(v) => setPayment("bankTransferEnabled", v)}
              />
              {paymentForm.bankTransferEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <Label>Banque</Label>
                    <Input value={paymentForm.bankName} onChange={(e) => setPayment("bankName", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>IBAN</Label>
                    <Input value={paymentForm.bankIban} onChange={(e) => setPayment("bankIban", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>BIC / SWIFT</Label>
                    <Input value={paymentForm.bankBic} onChange={(e) => setPayment("bankBic", e.target.value)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button disabled={!paymentDirty} onClick={() => updatePaymentSettings(paymentForm)}>
            <Save className="h-3.5 w-3.5" />
            Enregistrer
          </Button>
        </TabsContent>

        <TabsContent value="emails">
          <EmailTemplatesTab templates={commTemplates} />
        </TabsContent>

        <TabsContent value="devises">
          <CurrenciesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
