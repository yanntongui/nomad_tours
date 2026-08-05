"use client";
import * as React from "react";
import { Save, Moon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useSettings, updateSettings } from "@/lib/admin/store/settings-store";
import { AgencySettings } from "@/lib/admin/types";

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

export default function ParametresPage() {
  const settings = useSettings();
  const [form, setForm] = React.useState<AgencySettings>(settings);

  React.useEffect(() => {
    setForm(settings);
  }, [settings]);

  const dirty = JSON.stringify(form) !== JSON.stringify(settings);

  const set = <K extends keyof AgencySettings>(key: K, value: AgencySettings[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Paramètres</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">Configuration générale de l'agence.</p>
      </div>

      <Tabs defaultValue="agence">
        <TabsList>
          <TabsTrigger value="agence">Agence</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="apparence">Apparence</TabsTrigger>
        </TabsList>

        <TabsContent value="agence">
          <Card>
            <CardHeader><CardTitle className="text-sm">Coordonnées de l'agence</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nom de l'agence</Label>
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
              <Button disabled={!dirty} onClick={() => updateSettings(form)}>
                <Save className="h-3.5 w-3.5" />
                Enregistrer
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
                checked={form.notifyNewBooking}
                onCheckedChange={(v) => { set("notifyNewBooking", v); updateSettings({ notifyNewBooking: v }); }}
              />
              <ToggleRow
                label="Nouvelle demande de visa"
                description="Recevoir un email à chaque nouvelle demande de visa soumise."
                checked={form.notifyNewVisa}
                onCheckedChange={(v) => { set("notifyNewVisa", v); updateSettings({ notifyNewVisa: v }); }}
              />
              <ToggleRow
                label="Nouvelle demande événementielle"
                description="Recevoir un email à chaque nouvelle demande événementielle."
                checked={form.notifyNewEvent}
                onCheckedChange={(v) => { set("notifyNewEvent", v); updateSettings({ notifyNewEvent: v }); }}
              />
              <ToggleRow
                label="Échéance de paiement en retard"
                description="Recevoir une alerte quand une échéance passe en retard."
                checked={form.notifyPaymentLate}
                onCheckedChange={(v) => { set("notifyPaymentLate", v); updateSettings({ notifyPaymentLate: v }); }}
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
                checked={form.darkMode}
                onCheckedChange={(v) => { set("darkMode", v); updateSettings({ darkMode: v }); }}
              />
              {form.darkMode && (
                <div className="flex items-center gap-2 rounded-lg bg-stone-100 dark:bg-stone-800 p-3 text-xs text-stone-500 dark:text-stone-400">
                  <Moon className="h-3.5 w-3.5" />
                  Mode sombre activé.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
