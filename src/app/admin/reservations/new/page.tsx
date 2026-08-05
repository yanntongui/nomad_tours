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
import { useAgents } from "@/lib/admin/store/users-store";
import { ADMIN_CIRCUITS } from "@/lib/admin/mock/circuits";
import { addBooking } from "@/lib/admin/store/bookings-store";
import { cn } from "@/lib/utils";

const schema = z.object({
  type: z.enum(["CIRCUIT", "FLIGHT", "EVENT"]),
  circuitId: z.string().optional(),
  referenceLabel: z.string().min(2, "Requis"),
  destinationName: z.string().min(2, "Requis"),
  clientName: z.string().min(2, "Requis"),
  clientEmail: z.string().email("Email invalide"),
  clientPhone: z.string().min(6, "Numéro requis"),
  passengers: z.number().min(1, "Au moins 1 passager"),
  departDate: z.string().min(1, "Date requise"),
  totalPriceXOF: z.number().min(1, "Montant requis"),
  paidXOF: z.number().min(0),
  agent: z.string().min(1, "Agent requis"),
});
type FormValues = z.infer<typeof schema>;

const STEP_FIELDS: (keyof FormValues)[][] = [
  ["type", "referenceLabel", "destinationName"],
  ["clientName", "clientEmail", "clientPhone"],
  ["passengers", "departDate"],
  ["totalPriceXOF", "paidXOF", "agent"],
  [],
];

const STEPS = ["Prestation", "Client", "Voyage", "Tarification", "Récapitulatif"];

export default function NewBookingPage() {
  const router = useRouter();
  const { user } = useAdminRole();
  const agents = useAgents();
  const [step, setStep] = React.useState(0);

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
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      passengers: 1,
      departDate: "",
      totalPriceXOF: 0,
      paidXOF: 0,
      agent: agents[0]?.name ?? "",
    },
  });

  const values = watch();

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: FormValues) => {
    const id = `bk-new-${Date.now()}`;
    addBooking(
      {
        id,
        bookingNumber: `NT-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        client: { id: `cl-new-${Date.now()}`, name: data.clientName, email: data.clientEmail, phone: data.clientPhone },
        type: data.type,
        referenceId: data.circuitId ?? `${data.type.toLowerCase()}-${Date.now()}`,
        referenceLabel: data.referenceLabel,
        destinationName: data.destinationName,
        totalPriceXOF: data.totalPriceXOF,
        paidXOF: data.paidXOF,
        status: "PENDING",
        paymentStatus: data.paidXOF >= data.totalPriceXOF ? "PAID" : data.paidXOF > 0 ? "PARTIAL" : "PENDING",
        agent: data.agent,
        passengers: data.passengers,
        departDate: new Date(data.departDate).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      user.name
    );
    router.push(`/admin/reservations/${id}`);
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
                      const c = ADMIN_CIRCUITS.find((c) => c.id === id);
                      if (c) {
                        setValue("circuitId", c.id);
                        setValue("referenceLabel", c.title, { shouldValidate: true });
                        setValue("destinationName", c.destinationName, { shouldValidate: true });
                        setValue("totalPriceXOF", c.priceXOF, { shouldValidate: true });
                      }
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Choisir un circuit..." /></SelectTrigger>
                    <SelectContent>
                      {ADMIN_CIRCUITS.map((c) => (
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
                <Label>Nom du client</Label>
                <Input {...register("clientName")} placeholder="Nom complet" />
                {errors.clientName && <p className="text-xs text-red-600">{errors.clientName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input type="email" {...register("clientEmail")} placeholder="client@email.com" />
                {errors.clientEmail && <p className="text-xs text-red-600">{errors.clientEmail.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Téléphone</Label>
                <Input {...register("clientPhone")} placeholder="+229 XX XX XX XX" />
                {errors.clientPhone && <p className="text-xs text-red-600">{errors.clientPhone.message}</p>}
              </div>
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
                <Select value={values.agent} onValueChange={(v) => setValue("agent", v, { shouldValidate: true })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {agents.map((a) => (
                      <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>
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
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Client</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.clientName} ({values.clientEmail})</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Passagers</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.passengers}</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Départ</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.departDate ? format(new Date(values.departDate), "PPP", { locale: fr }) : "—"}</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Montant total</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.totalPriceXOF?.toLocaleString("fr-FR")} FCFA</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Déjà payé</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.paidXOF?.toLocaleString("fr-FR")} FCFA</span></div>
              <div className="flex items-center justify-between"><span className="text-stone-400 dark:text-stone-500">Agent</span><span className="font-medium text-stone-800 dark:text-stone-100">{values.agent}</span></div>
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
          <Button onClick={handleSubmit(onSubmit)}>
            <Check className="h-4 w-4" />
            Créer la réservation
          </Button>
        )}
      </div>
    </div>
  );
}
