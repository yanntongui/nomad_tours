"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useAdminRole } from "@/context/AdminRoleContext";
import { createBookingAction } from "../actions";
import type { Tables } from "@/lib/server/types";
import type { CircuitRow } from "@/lib/server/circuits";
import type { DestinationRow } from "@/lib/server/destinations";
import { cn } from "@/lib/utils";

const schema = z.object({
  type: z.enum(["CIRCUIT", "FLIGHT", "EVENT"]),
  circuitId: z.string().optional(),
  referenceLabel: z.string().min(2, "Requis"),
  destinationName: z.string().min(2, "Requis"),
  clientId: z.string().min(1, "Client requis"),
  passengers: z.number().min(1, "Au moins 1 passager"),
  departDate: z.string().min(1, "Date requise"),
  totalPriceXOF: z.number().min(1, "Montant requis"),
  paidXOF: z.number().min(0),
  agentId: z.string().min(1, "Agent requis"),
});
type FormValues = z.infer<typeof schema>;

const STEP_FIELDS: (keyof FormValues)[][] = [
  ["type", "referenceLabel", "destinationName"],
  ["clientId"],
  ["passengers", "departDate"],
  ["totalPriceXOF", "paidXOF", "agentId"],
  [],
];

const STEPS = ["Prestation", "Client", "Voyage", "Tarification", "Récapitulatif"];

export function NewBookingClient({
  clients,
  agents,
  circuits,
  destinations,
}: {
  clients: Tables<"clients">[];
  agents: Tables<"admin_profiles">[];
  circuits: CircuitRow[];
  destinations: DestinationRow[];
}) {
  const router = useRouter();
  const { user } = useAdminRole();
  const [step, setStep] = React.useState(0);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    watch,
    setValue,
    trigger,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      type: "CIRCUIT",
      referenceLabel: "",
      destinationName: "",
      clientId: "",
      passengers: 1,
      departDate: "",
      totalPriceXOF: 0,
      paidXOF: 0,
      agentId: agents[0]?.id ?? "",
    },
  });

  const values = watch();
  const selectedClient = clients.find((c) => c.id === values.clientId);
  const selectedAgent = agents.find((a) => a.id === values.agentId);

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    const result = await createBookingAction({
      client_id: data.clientId,
      agent_id: data.agentId,
      type: data.type,
      reference_id: data.circuitId ?? `${data.type.toLowerCase()}-${Date.now()}`,
      reference_label: data.referenceLabel,
      destination_name: data.destinationName,
      passengers: data.passengers,
      depart_date: new Date(data.departDate).toISOString(),
      total_price_xof: data.totalPriceXOF,
      paid_xof: data.paidXOF,
      actor: user.name,
    });
    setSubmitting(false);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    if (result.data) router.push(`/admin/reservations/${result.data.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/admin/reservations")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-lg font-bold text-stone-800 dark:text-stone-100">Nouvelle réservation</h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">Étape {step + 1} sur {STEPS.length} — {STEPS[step]}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1 flex items-center gap-2">
            <div
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                i < step ? "bg-luxe-terracotta text-white" : i === step ? "bg-luxe-terracotta/15 text-luxe-terracotta border-2 border-luxe-terracotta" : "bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500"
              )}
            >
              {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={cn("h-0.5 flex-1", i < step ? "bg-luxe-terracotta" : "bg-stone-100 dark:bg-stone-800")} />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {step === 0 && (
            <>
              <div className="space-y-1.5">
                <Label>Type de prestation</Label>
                <Select value={values.type} onValueChange={(v) => setValue("type", v as FormValues["type"], { shouldValidate: true })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CIRCUIT">Circuit</SelectItem>
                    <SelectItem value="FLIGHT">Vol</SelectItem>
                    <SelectItem value="EVENT">Événement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {values.type === "CIRCUIT" && (
                <div className="space-y-1.5">
                  <Label>Circuit</Label>
                  <Select
                    onValueChange={(id) => {
                      const c = circuits.find((c) => c.id === id);
                      if (c) {
                        const destination = destinations.find((d) => d.id === c.destination_id);
                        setValue("circuitId", c.id);
                        setValue("referenceLabel", c.title, { shouldValidate: true });
                        setValue("destinationName", destination?.name ?? "", { shouldValidate: true });
                        setValue("totalPriceXOF", c.price_xof, { shouldValidate: true });
                      }
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Choisir un circuit..." /></SelectTrigger>
                    <SelectContent>
                      {circuits.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Libellé de la prestation</Label>
                <Input {...register("referenceLabel")} placeholder="Ex. Vol Cotonou → Paris" />
                {errors.referenceLabel && <p className="text-xs text-red-600">{errors.referenceLabel.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Destination</Label>
                <Input {...register("destinationName")} placeholder="Ex. Paris, France" />
                {errors.destinationName && <p className="text-xs text-red-600">{errors.destinationName.message}</p>}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select value={values.clientId} onValueChange={(v) => setValue("clientId", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue placeholder="Choisir un client..." /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name} — {c.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.clientId && <p className="text-xs text-red-600">{errors.clientId.message}</p>}
              </div>
              {selectedClient && (
                <div className="rounded-lg border border-stone-100 px-3 py-2 text-sm dark:border-stone-800">
                  <p className="text-stone-500 dark:text-stone-400">{selectedClient.email}</p>
                  <p className="text-stone-500 dark:text-stone-400">{selectedClient.phone}</p>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-1.5">
                <Label>Nombre de passagers</Label>
                <Input type="number" min={1} {...register("passengers", { valueAsNumber: true })} />
                {errors.passengers && <p className="text-xs text-red-600">{errors.passengers.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Date de départ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start font-normal">
                      <CalendarIcon className="h-4 w-4" />
                      {values.departDate ? format(new Date(values.departDate), "PPP", { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto">
                    <Calendar
                      mode="single"
                      selected={values.departDate ? new Date(values.departDate) : undefined}
                      onSelect={(d) => setValue("departDate", (d as Date)?.toISOString() ?? "", { shouldValidate: true })}
                    />
                  </PopoverContent>
                </Popover>
                {errors.departDate && <p className="text-xs text-red-600">{errors.departDate.message}</p>}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-1.5">
                <Label>Montant total (FCFA)</Label>
                <Input type="number" min={0} {...register("totalPriceXOF", { valueAsNumber: true })} />
                {errors.totalPriceXOF && <p className="text-xs text-red-600">{errors.totalPriceXOF.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Montant déjà payé (FCFA)</Label>
                <Input type="number" min={0} {...register("paidXOF", { valueAsNumber: true })} />
                {errors.paidXOF && <p className="text-xs text-red-600">{errors.paidXOF.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Agent en charge</Label>
                <Select value={values.agentId} onValueChange={(v) => setValue("agentId", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Prestation</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.referenceLabel} <StatusBadge status={values.type} label={{ CIRCUIT: "Circuit", FLIGHT: "Vol", EVENT: "Événement" }[values.type]} /></span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Destination</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.destinationName}</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Client</span><span className="font-medium text-stone-800 dark:text-stone-100">{selectedClient?.name} ({selectedClient?.email})</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Passagers</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.passengers}</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Départ</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.departDate ? format(new Date(values.departDate), "PPP", { locale: fr }) : "—"}</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Montant total</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.totalPriceXOF?.toLocaleString("fr-FR")} FCFA</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Déjà payé</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.paidXOF?.toLocaleString("fr-FR")} FCFA</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Agent</span><span className="font-medium text-stone-800 dark:text-stone-100">{selectedAgent?.name}</span></div>
              {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={back} disabled={step === 0}>
          <ArrowLeft className="h-4 w-4" />
          Précédent
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit(onSubmit)} disabled={submitting}>
            <Check className="h-4 w-4" />
            {submitting ? "Création..." : "Créer la réservation"}
          </Button>
        )}
      </div>
    </div>
  );
}
