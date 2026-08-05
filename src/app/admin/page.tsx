"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wallet,
  CalendarCheck,
  Plane,
  AlertTriangle,
  ArrowRight,
  Clock,
  BadgeAlert,
  FileCheck2,
  PartyPopper,
  UserPlus,
  CreditCard,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { KpiCard } from "@/components/admin/KpiCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Timeline } from "@/components/admin/Timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAdminRole } from "@/context/AdminRoleContext";
import { useBookingsStore, addPayment } from "@/lib/admin/store/bookings-store";
import { useTrips } from "@/lib/admin/store/trips-store";
import { createVisaRequest } from "@/lib/admin/store/visas-store";
import { createEventRequest } from "@/lib/admin/store/events-store";
import { useClientsStore, createClient } from "@/lib/admin/store/clients-store";
import { VISA_COUNTRIES } from "@/lib/admin/mock/visas";
import { EVENT_TYPES } from "@/lib/admin/mock/events";
import { AGENTS } from "@/lib/admin/mock/users";
import { ContactMethod, PaymentMethod, PaymentStatus, VipTier } from "@/lib/admin/types";

const TYPE_LABELS: Record<string, string> = { CIRCUIT: "Circuits", FLIGHT: "Vols", EVENT: "Événementiel" };
const TYPE_COLORS: Record<string, string> = { CIRCUIT: "#C4633A", FLIGHT: "#4A6FA5", EVENT: "#D9A441" };

const CA_HISTORY = [
  { month: "Sept 25", ca: 9_200_000 },
  { month: "Oct 25", ca: 11_450_000 },
  { month: "Nov 25", ca: 8_900_000 },
  { month: "Déc 25", ca: 15_300_000 },
  { month: "Jan 26", ca: 13_100_000 },
  { month: "Fév 26", ca: 10_750_000 },
  { month: "Mars 26", ca: 14_200_000 },
  { month: "Avr 26", ca: 12_600_000 },
  { month: "Mai 26", ca: 16_800_000 },
  { month: "Juin 26", ca: 19_400_000 },
  { month: "Juil 26", ca: 17_950_000 },
  { month: "Août 26", ca: 18_450_000 },
];

function formatXOF(n: number) {
  return `${n.toLocaleString("fr-FR")} FCFA`;
}

const CONTACT_LABELS: Record<ContactMethod, string> = { EMAIL: "Email", PHONE: "Téléphone", WHATSAPP: "WhatsApp" };
const VIP_LABELS: Record<VipTier, string> = { STANDARD: "Standard", SILVER: "Silver", GOLD: "Gold", PLATINUM: "Platinum" };
const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  MOBILE_MONEY_MTN: "Mobile Money MTN",
  MOBILE_MONEY_MOOV: "Mobile Money Moov",
  FEDAPAY: "FedaPay",
  STRIPE_CARD: "Carte bancaire",
  BANK_TRANSFER: "Virement bancaire",
  CASH: "Espèces",
};
const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: "En attente",
  PARTIAL: "Partiel",
  PAID: "Payé",
  FAILED: "Échoué",
  REFUNDED: "Remboursé",
};

function VisaQuickCreateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { user } = useAdminRole();
  const clientsStore = useClientsStore();
  const [clientId, setClientId] = React.useState("");
  const [country, setCountry] = React.useState(VISA_COUNTRIES[0]);
  const [feeXOF, setFeeXOF] = React.useState(45000);
  const [agent, setAgent] = React.useState(AGENTS[0]?.name ?? "");

  React.useEffect(() => {
    if (open) {
      setClientId("");
      setCountry(VISA_COUNTRIES[0]);
      setFeeXOF(45000);
      setAgent(AGENTS[0]?.name ?? "");
    }
  }, [open]);

  const valid = clientId.length > 0 && country.length > 0 && feeXOF > 0 && agent.length > 0;

  function handleSubmit() {
    const client = clientsStore.clients.find((c) => c.id === clientId);
    if (!client) return;
    const created = createVisaRequest({ client, country, feeXOF, agent }, user.name);
    onOpenChange(false);
    router.push(`/admin/visas/${created.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle demande de visa</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger>
              <SelectContent>
                {clientsStore.clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Pays</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VISA_COUNTRIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Frais (FCFA)</Label>
              <Input type="number" min={0} value={feeXOF} onChange={(e) => setFeeXOF(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Agent</Label>
            <Select value={agent} onValueChange={setAgent}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {AGENTS.map((a) => (
                  <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid} onClick={handleSubmit}>Créer la demande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EventQuickCreateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { user } = useAdminRole();
  const clientsStore = useClientsStore();
  const [clientId, setClientId] = React.useState("");
  const [type, setType] = React.useState(EVENT_TYPES[0]);
  const [guestCount, setGuestCount] = React.useState(20);
  const [budgetXOF, setBudgetXOF] = React.useState(1000000);
  const [eventDate, setEventDate] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [agent, setAgent] = React.useState(AGENTS[0]?.name ?? "");

  React.useEffect(() => {
    if (open) {
      setClientId("");
      setType(EVENT_TYPES[0]);
      setGuestCount(20);
      setBudgetXOF(1000000);
      setEventDate("");
      setLocation("");
      setAgent(AGENTS[0]?.name ?? "");
    }
  }, [open]);

  const valid = clientId.length > 0 && type.length > 0 && guestCount > 0 && budgetXOF > 0 && eventDate.length > 0 && agent.length > 0;

  function handleSubmit() {
    const client = clientsStore.clients.find((c) => c.id === clientId);
    if (!client) return;
    const created = createEventRequest(
      {
        client,
        type,
        guestCount,
        budgetXOF,
        eventDate: new Date(eventDate).toISOString(),
        location: location.trim() || undefined,
        agent,
      },
      user.name
    );
    onOpenChange(false);
    router.push(`/admin/evenementiel/${created.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle demande événementielle</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner un client" /></SelectTrigger>
              <SelectContent>
                {clientsStore.clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Type d'événement</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Nombre d'invités</Label>
              <Input type="number" min={1} value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Budget (FCFA)</Label>
              <Input type="number" min={0} value={budgetXOF} onChange={(e) => setBudgetXOF(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Date de l'événement</Label>
              <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Lieu (optionnel)</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Ex. Cotonou" />
          </div>
          <div className="space-y-1.5">
            <Label>Agent</Label>
            <Select value={agent} onValueChange={setAgent}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {AGENTS.map((a) => (
                  <SelectItem key={a.id} value={a.name}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid} onClick={handleSubmit}>Créer la demande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ClientQuickCreateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [preferredContact, setPreferredContact] = React.useState<ContactMethod>("EMAIL");
  const [vipTier, setVipTier] = React.useState<VipTier>("STANDARD");

  React.useEffect(() => {
    if (open) {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setPreferredContact("EMAIL");
      setVipTier("STANDARD");
    }
  }, [open]);

  const valid = name.trim().length > 0 && email.trim().length > 0 && phone.trim().length > 0;

  function handleSubmit() {
    const created = createClient({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim() || undefined,
      preferredContact,
      vipTier,
    });
    onOpenChange(false);
    router.push(`/admin/clients/${created.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau client</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Nom complet</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex. Awa Mensah" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nom@exemple.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Téléphone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+229 97 00 00 00" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Adresse (optionnel)</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Contact préféré</Label>
              <Select value={preferredContact} onValueChange={(v) => setPreferredContact(v as ContactMethod)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(CONTACT_LABELS) as ContactMethod[]).map((c) => (
                    <SelectItem key={c} value={c}>{CONTACT_LABELS[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Palier VIP</Label>
              <Select value={vipTier} onValueChange={(v) => setVipTier(v as VipTier)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(VIP_LABELS) as VipTier[]).map((v) => (
                    <SelectItem key={v} value={v}>{VIP_LABELS[v]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid} onClick={handleSubmit}>Créer le client</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PaymentQuickCreateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const { user } = useAdminRole();
  const bookingsStore = useBookingsStore();
  const [bookingId, setBookingId] = React.useState("");
  const [amountXOF, setAmountXOF] = React.useState(0);
  const [method, setMethod] = React.useState<PaymentMethod>("MOBILE_MONEY_MTN");
  const [status, setStatus] = React.useState<PaymentStatus>("PAID");
  const [transactionRef, setTransactionRef] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setBookingId("");
      setAmountXOF(0);
      setMethod("MOBILE_MONEY_MTN");
      setStatus("PAID");
      setTransactionRef("");
    }
  }, [open]);

  const valid = bookingId.length > 0 && amountXOF > 0;

  function handleSubmit() {
    addPayment(
      {
        bookingId,
        amountXOF,
        method,
        status,
        transactionRef: transactionRef.trim() || undefined,
        paidAt: status === "PAID" ? new Date().toISOString() : undefined,
      },
      user.name
    );
    onOpenChange(false);
    router.push(`/admin/reservations/${bookingId}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau paiement</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Réservation</Label>
            <Select value={bookingId} onValueChange={setBookingId}>
              <SelectTrigger><SelectValue placeholder="Sélectionner une réservation" /></SelectTrigger>
              <SelectContent>
                {bookingsStore.bookings.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.bookingNumber} — {b.client.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Montant (FCFA)</Label>
              <Input type="number" min={0} value={amountXOF} onChange={(e) => setAmountXOF(Number(e.target.value))} />
            </div>
            <div className="space-y-1.5">
              <Label>Méthode</Label>
              <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((m) => (
                    <SelectItem key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Statut</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as PaymentStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>{PAYMENT_STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Référence (optionnel)</Label>
              <Input value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} placeholder="Ex. TXN-8842" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button disabled={!valid} onClick={handleSubmit}>Enregistrer le paiement</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDashboardPage() {
  const store = useBookingsStore();
  const trips = useTrips();
  const [visaOpen, setVisaOpen] = React.useState(false);
  const [eventOpen, setEventOpen] = React.useState(false);
  const [clientOpen, setClientOpen] = React.useState(false);
  const [paymentOpen, setPaymentOpen] = React.useState(false);

  const totalRevenue = store.bookings.reduce((sum, b) => sum + b.paidXOF, 0);
  const totalBookings = store.bookings.length;
  const ongoingTrips = trips.filter((t) => t.status === "ONGOING").length;
  const latePayments = store.schedules.filter((s) => s.status === "LATE");
  const urgentBookings = store.bookings.filter((b) => b.urgent);
  const pendingConfirmation = store.bookings.filter((b) => b.status === "PENDING");

  const byType = Object.entries(
    store.bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.type] = (acc[b.type] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([type, count]) => ({ name: TYPE_LABELS[type] ?? type, value: count, type }));

  const recentActivity = [...store.timeline]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
    .map((t) => ({ id: t.id, label: t.label, detail: t.detail, actor: t.actor, date: t.createdAt }));

  const ongoingTripsList = trips.filter((t) => t.status === "ONGOING").slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-stone-800 dark:text-stone-100">Tableau de bord</h1>
        <p className="text-sm text-stone-500 mt-0.5 dark:text-stone-400">Vue d'ensemble de l'activité Nomad Tours.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Button variant="outline" className="h-auto flex-col items-start gap-1.5 py-3 px-4" onClick={() => setVisaOpen(true)}>
            <FileCheck2 className="h-4 w-4 text-luxe-terracotta" />
            <span className="text-sm font-semibold">Demande de visa</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col items-start gap-1.5 py-3 px-4" onClick={() => setEventOpen(true)}>
            <PartyPopper className="h-4 w-4 text-luxe-terracotta" />
            <span className="text-sm font-semibold">Demande événementielle</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col items-start gap-1.5 py-3 px-4" onClick={() => setClientOpen(true)}>
            <UserPlus className="h-4 w-4 text-luxe-terracotta" />
            <span className="text-sm font-semibold">Nouveau client</span>
          </Button>
          <Button variant="outline" className="h-auto flex-col items-start gap-1.5 py-3 px-4" onClick={() => setPaymentOpen(true)}>
            <CreditCard className="h-4 w-4 text-luxe-terracotta" />
            <span className="text-sm font-semibold">Nouveau paiement</span>
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Chiffre d'affaires encaissé" value={formatXOF(totalRevenue)} icon={Wallet} changePct={8.4} helper="vs mois dernier" />
        <KpiCard label="Réservations totales" value={String(totalBookings)} icon={CalendarCheck} changePct={4.1} helper="toutes prestations" />
        <KpiCard label="Voyages en cours" value={String(ongoingTrips)} icon={Plane} helper="actuellement sur le terrain" />
        <KpiCard label="Actions requises" value={String(latePayments.length + urgentBookings.length)} icon={AlertTriangle} helper="paiements & départs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Chiffre d'affaires — 12 derniers mois</CardTitle>
          </CardHeader>
          <CardContent className="h-72 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CA_HISTORY} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFEAE3" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#78716c" }} axisLine={{ stroke: "#E7E2DA" }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "#78716c" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}M`}
                />
                <Tooltip formatter={(v: any) => formatXOF(Number(v))} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="ca" stroke="#C4633A" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Réservations par type</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byType} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {byType.map((entry) => (
                    <Cell key={entry.type} fill={TYPE_COLORS[entry.type] ?? "#A8A29E"} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline items={recentActivity} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Actions requises</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link
              href="/admin/reservations"
              className="flex items-center justify-between rounded-lg border border-stone-200 dark:border-stone-800 px-3 py-2.5 hover:border-luxe-terracotta/40 hover:bg-luxe-terracotta/5 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                <Clock className="h-4 w-4 text-red-500" />
                Paiements en retard
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-stone-800 dark:text-stone-100">
                {latePayments.length}
                <ArrowRight className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
              </span>
            </Link>
            <Link
              href="/admin/reservations"
              className="flex items-center justify-between rounded-lg border border-stone-200 dark:border-stone-800 px-3 py-2.5 hover:border-luxe-terracotta/40 hover:bg-luxe-terracotta/5 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                <BadgeAlert className="h-4 w-4 text-amber-500" />
                Départs urgents non confirmés
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-stone-800 dark:text-stone-100">
                {urgentBookings.length}
                <ArrowRight className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
              </span>
            </Link>
            <Link
              href="/admin/reservations"
              className="flex items-center justify-between rounded-lg border border-stone-200 dark:border-stone-800 px-3 py-2.5 hover:border-luxe-terracotta/40 hover:bg-luxe-terracotta/5 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
                <CalendarCheck className="h-4 w-4 text-blue-500" />
                Réservations en attente
              </span>
              <span className="flex items-center gap-1 text-sm font-semibold text-stone-800 dark:text-stone-100">
                {pendingConfirmation.length}
                <ArrowRight className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm">Voyages en cours</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/voyages">
              Voir tout
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {ongoingTripsList.length === 0 ? (
            <p className="text-sm text-stone-400 dark:text-stone-500 py-6 text-center">Aucun voyage en cours actuellement.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {ongoingTripsList.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/admin/voyages/${trip.id}`}
                  className="rounded-lg border border-stone-200 dark:border-stone-800 p-3 hover:border-luxe-terracotta/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <StatusBadge status={trip.status} />
                    <span className="text-[11px] text-stone-400 dark:text-stone-500">{trip.bookingNumber}</span>
                  </div>
                  <p className="text-sm font-semibold text-stone-800 dark:text-stone-100 truncate">{trip.title}</p>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">{trip.clientName}</p>
                  {trip.guideName && <p className="text-[11px] text-stone-400 dark:text-stone-500 mt-1">Guide : {trip.guideName}</p>}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <VisaQuickCreateDialog open={visaOpen} onOpenChange={setVisaOpen} />
      <EventQuickCreateDialog open={eventOpen} onOpenChange={setEventOpen} />
      <ClientQuickCreateDialog open={clientOpen} onOpenChange={setClientOpen} />
      <PaymentQuickCreateDialog open={paymentOpen} onOpenChange={setPaymentOpen} />
    </div>
  );
}
