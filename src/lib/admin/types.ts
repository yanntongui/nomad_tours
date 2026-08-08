// Types mirroring the eventual Prisma models (see prisma/schema.prisma for the enums this
// borrows from) so that swapping mock data for real Prisma queries later needs no type changes.

export type AdminRole = "SUPER_ADMIN" | "AGENT" | "GUIDE";

export type BookingType = "CIRCUIT" | "FLIGHT" | "EVENT";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type PaymentStatus = "PENDING" | "PARTIAL" | "PAID" | "FAILED" | "REFUNDED";
export type PaymentMethod = "MOBILE_MONEY_MTN" | "MOBILE_MONEY_MOOV" | "FEDAPAY" | "STRIPE_CARD" | "BANK_TRANSFER" | "CASH";
export type TripType = "INDIVIDUAL" | "GROUP";
export type TripStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";
export type ScheduleStatus = "PENDING" | "PAID" | "LATE";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: AdminRole;
  avatarColor: string;
  active: boolean;
}

export interface ClientRef {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export type ContactMethod = "EMAIL" | "PHONE" | "WHATSAPP";

export type VipTier = "STANDARD" | "SILVER" | "GOLD" | "PLATINUM";

export interface Client extends ClientRef {
  address?: string;
  tags: string[];
  preferredContact: ContactMethod;
  loyaltyNote?: string;
  vipTier: VipTier;
  createdAt: string;
}

export interface ClientNote {
  id: string;
  clientId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  amountXOF: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionRef?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentSchedule {
  id: string;
  bookingId: string;
  dueDate: string;
  amountXOF: number;
  status: ScheduleStatus;
  paidAt?: string;
}

export interface TimelineEntry {
  id: string;
  bookingId: string;
  label: string;
  detail?: string;
  actor: string;
  createdAt: string;
}

export interface Message {
  id: string;
  bookingId: string;
  author: string;
  fromClient: boolean;
  content: string;
  createdAt: string;
}

export interface InternalNote {
  id: string;
  bookingId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface BookingDocument {
  id: string;
  bookingId: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  client: ClientRef;
  type: BookingType;
  referenceId: string;
  referenceLabel: string;
  destinationName: string;
  totalPriceXOF: number;
  paidXOF: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  agent: string;
  passengers: number;
  departDate: string;
  createdAt: string;
  updatedAt: string;
  urgent?: boolean;
}

export interface TripParticipant {
  id: string;
  tripId: string;
  name: string;
  emergencyContact?: string;
  checklist: { label: string; done: boolean }[];
}

export interface TripUpdate {
  id: string;
  tripId: string;
  author: string;
  message: string;
  mediaUrls: string[];
  createdAt: string;
}

export interface TripFeedback {
  id: string;
  tripId: string;
  author: string;
  rating: number;
  comment: string;
  submittedAt: string;
}

export interface TripPhoto {
  id: string;
  tripId: string;
  url: string;
  caption?: string;
  uploadedBy: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  bookingId: string;
  bookingNumber: string;
  title: string;
  clientName: string;
  type: TripType;
  startDate: string;
  endDate: string;
  guideId?: string;
  guideName?: string;
  status: TripStatus;
  participants: TripParticipant[];
  updates: TripUpdate[];
  feedbacks: TripFeedback[];
}

export type TripReportStatus = "DRAFT" | "FINALIZED";

export type TripReportSectionKey =
  | "INFOS_GENERALES"
  | "CAMPAGNE_COMMUNICATION"
  | "INSCRIPTIONS_PARTICIPANTS"
  | "PREPARATIFS_DOCUMENTS"
  | "BILLETTERIE_AERIENNE"
  | "ARRIVEE_DESTINATION"
  | "HEBERGEMENT"
  | "RESTAURATION"
  | "DEPLACEMENTS"
  | "PROGRAMME_ACTIVITES"
  | "ENCADREMENT"
  | "RETOUR_SOUVENIRS"
  | "SATISFACTION_AVIS"
  | "BILAN_FINANCIER"
  | "RECOMMANDATIONS";

// Uniquement les champs sans source de données existante dans ce dépôt.
// Tout le reste est calculé en direct depuis trips/bookings/tasks/suppliers/
// feedbacks à chaque rendu (voir les fonctions getXxx dans trips-store.ts) —
// jamais persisté ici, donc jamais désynchronisé.
export interface TripReportManualFields {
  redacteur?: string;
  dateRedaction?: string;
  canauxCommunication?: string;
  budgetCommunication?: string;
  resultatsCampagne?: string;
  desistements?: string;
  raisonsDesistement?: string;
  appreciationPreparatifs?: string;
  statutVisa?: string;
  compagnieAerienne?: string;
  referenceBillet?: string;
  notesBilletterie?: string;
  dateHeureArrivee?: string;
  accueilPar?: string;
  incidentsArrivee?: string;
  qualitePerçueHebergement?: number;
  notesHebergement?: string;
  notesRestauration?: string;
  fiabiliteTransport?: number;
  incidentsTransport?: string;
  ecartsProgramme?: string;
  appreciationEncadrement?: string;
  commentaireSouvenirs?: string;
  syntheseSatisfaction?: string;
  reclamations?: string;
  analyseEcartsFinanciers?: string;
  recommandations?: string;
}

export interface TripReportActionItem {
  id: string;
  reportId: string;
  label: string;
  done: boolean;
  createdAt: string;
}

export interface TripReport {
  id: string;
  tripId: string;
  status: TripReportStatus;
  manual: TripReportManualFields;
  generatedAt: string;
  generatedBy: string;
  finalizedAt?: string;
  finalizedBy?: string;
  updatedAt: string;
}

export interface PointOfInterest {
  id: string;
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  region?: string;
  description: string;
  highlights: string[];
  images: string[];
  climate: string;
  bestPeriod: string;
  isInternational: boolean;
  isFeatured: boolean;
  latitude?: number;
  longitude?: number;
  pointsOfInterest: PointOfInterest[];
  seoTitle?: string;
  seoDescription?: string;
  circuitsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryDay {
  id: string;
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
}

export interface PriceTier {
  id: string;
  label: string;
  minPax: number;
  maxPax?: number;
  priceXOF: number;
}

export interface CircuitOption {
  id: string;
  label: string;
  priceXOF: number;
}

export interface CircuitDeparture {
  id: string;
  date: string;
  seatsTotal: number;
  seatsBooked: number;
  status: "OPEN" | "COMPLET" | "ANNULE";
}

export interface CircuitGuide {
  guideId: string;
  guideName: string;
}

export type VisaStatus = "SUBMITTED" | "PROCESSING" | "APPROVED" | "REJECTED";

export interface VisaDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface VisaTimelineEntry {
  id: string;
  visaRequestId: string;
  label: string;
  detail?: string;
  actor: string;
  createdAt: string;
}

export interface VisaRequest {
  id: string;
  client: ClientRef;
  country: string;
  documents: VisaDocument[];
  status: VisaStatus;
  adminNotes?: string;
  feeXOF: number;
  agent: string;
  submittedAt: string;
  updatedAt: string;
}

export type EventStatus = "DRAFT" | "REQUESTED" | "QUOTED" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface EventTimelineEntry {
  id: string;
  eventRequestId: string;
  label: string;
  detail?: string;
  actor: string;
  createdAt: string;
}

export interface EventRequest {
  id: string;
  client: ClientRef;
  type: string;
  guestCount: number;
  budgetXOF: number;
  quoteAmountXOF?: number;
  services: string[];
  eventDate: string;
  location?: string;
  status: EventStatus;
  quoteFile?: string;
  agent: string;
  createdAt: string;
  updatedAt: string;
}

export type TicketType = "SUPPORT" | "RECLAMATION";
export type TicketChannel = "CHAT" | "EMAIL" | "TELEPHONE";
export type TicketStatus = "OUVERT" | "EN_COURS" | "RESOLU" | "FERME" | "REJETE";
export type TicketPriority = "NORMALE" | "URGENTE";

export interface TicketMessage {
  id: string;
  ticketId: string;
  author: string;
  fromClient: boolean;
  channel: TicketChannel;
  content: string;
  createdAt: string;
}

export interface TicketTimelineEntry {
  id: string;
  ticketId: string;
  label: string;
  detail?: string;
  actor?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  client: ClientRef;
  type: TicketType;
  channel: TicketChannel;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  bookingId?: string;
  tripId?: string;
  agent: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoyaltyOffer {
  id: string;
  title: string;
  description: string;
  tierRequired: VipTier;
  discountPercent?: number;
  validUntil?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgencySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  whatsapp?: string;
  notifyNewBooking: boolean;
  notifyNewVisa: boolean;
  notifyNewEvent: boolean;
  notifyPaymentLate: boolean;
  darkMode: boolean;
}

export interface PaymentSettings {
  fedapayEnabled: boolean;
  fedapayPublicKey: string;
  fedapaySecretKey: string;
  stripeEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  mobileMoneyMtnEnabled: boolean;
  mobileMoneyMtnNumber: string;
  mobileMoneyMoovEnabled: boolean;
  mobileMoneyMoovNumber: string;
  bankTransferEnabled: boolean;
  bankName: string;
  bankIban: string;
  bankBic: string;
}

export interface CurrencyRate {
  id: string;
  code: string;
  label: string;
  rateToXOF: number;
}

export type HomepageIconKey = "COMPASS" | "PLANE" | "FILE_CHECK" | "PARTY_POPPER" | "HEADPHONES" | "WALLET";

export interface HomepageHero {
  eyebrow: string;
  headlineLine1: string;
  headlineHighlight: string;
  subheadline: string;
  backgroundImage: string;
}

export interface HomepageStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export interface HomepageServiceItem {
  id: string;
  title: string;
  description: string;
  icon: HomepageIconKey;
  image: string;
  href: string;
}

export interface HomepageServicesSection {
  eyebrow: string;
  title: string;
  items: HomepageServiceItem[];
}

export interface HomepageWhyUsItem {
  id: string;
  icon: HomepageIconKey;
  title: string;
  description: string;
}

export interface HomepageWhyUsSection {
  eyebrow: string;
  title: string;
  intro: string;
  items: HomepageWhyUsItem[];
  image1: string;
  image2: string;
}

export interface HomepagePromoBanner {
  badge: string;
  title: string;
  subtitle: string;
  highlights: string[];
  priceLabel: string;
  priceValue: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
}

export interface HomepageNewsletterBanner {
  title: string;
  subtitle: string;
  confirmMessage: string;
  disclaimer: string;
}

export type HomepageSectionKey =
  | "hero"
  | "trustBar"
  | "services"
  | "destinations"
  | "whyUs"
  | "featuredCircuit"
  | "testimonials"
  | "gallery"
  | "newsletter";

export interface HomepageSectionMeta {
  key: HomepageSectionKey;
  enabled: boolean;
  order: number;
}

export interface HomepageFeaturedDestinationsSection {
  eyebrow: string;
  title: string;
  destinationIds: string[];
}

export interface HomepageTestimonialsConfig {
  eyebrow: string;
  title: string;
  testimonialIds: string[];
}

export interface HomepageFooterLink {
  id: string;
  label: string;
  href: string;
}

export interface HomepageFooterColumn {
  id: string;
  title: string;
  links: HomepageFooterLink[];
}

export interface HomepageFooterSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface HomepageFooterConfig {
  description: string;
  address: string;
  phone: string;
  email: string;
  columns: HomepageFooterColumn[];
  socials: HomepageFooterSocialLink[];
}

export interface HomepageContent {
  hero: HomepageHero;
  stats: HomepageStat[];
  services: HomepageServicesSection;
  whyUs: HomepageWhyUsSection;
  featuredCircuit: HomepagePromoBanner;
  newsletter: HomepageNewsletterBanner;
  sectionsOrder: HomepageSectionMeta[];
  featuredDestinations: HomepageFeaturedDestinationsSection;
  testimonialsConfig: HomepageTestimonialsConfig;
  footer: HomepageFooterConfig;
}

export type HomepageVersionStatus = "DRAFT" | "PUBLISHED";

export interface HomepageContentVersion {
  id: string;
  content: HomepageContent;
  status: HomepageVersionStatus;
  publishedAt: string | null;
  actor: string;
  createdAt: string;
}

export type TestimonialStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminTestimonial {
  id: string;
  userName: string;
  userAvatar?: string;
  tripTitle: string;
  rating: number;
  content: string;
  date: string;
  status: TestimonialStatus;
}

export interface CmsSeoSettings {
  siteTitle: string;
  metaDescription: string;
  ogImage?: string;
}

export type BannerPlacement = "HOMEPAGE_TOP" | "HOMEPAGE_INLINE" | "CIRCUITS" | "DESTINATIONS" | "SITE_WIDE";

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  placement: BannerPlacement;
  startDate: string | null;
  endDate: string | null;
  active: boolean;
  createdAt: string;
}

export type NewsletterSubscriberStatus = "ACTIVE" | "DISABLED";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  source: string;
  subscribedAt: string;
  status: NewsletterSubscriberStatus;
}

export interface AdminNotification {
  id: string;
  title: string;
  description?: string;
  href?: string;
  read: boolean;
  createdAt: string;
}

export type TaskPhase = "AVANT" | "PENDANT" | "APRES";
export type TaskCategory = "LOGISTIQUE" | "FOURNISSEURS" | "DOCUMENTS_CLIENT" | "COMMUNICATION" | "FINANCE";
export type TaskStatus = "A_FAIRE" | "EN_COURS" | "FAIT" | "BLOQUE";
export type TaskPriority = "NORMALE" | "URGENTE";
export type CommChannel = "EMAIL" | "SMS" | "PUSH";
export type CommTriggerMode = "AUTO" | "VALIDATION" | "MANUEL";
export type CommStatus = "PROGRAMMEE" | "EN_ATTENTE_VALIDATION" | "ENVOYEE" | "ANNULEE";

export type CommTemplateScope = "TRIP" | "SYSTEM";

export interface CommunicationTemplate {
  id: string;
  name: string;
  scope: CommTemplateScope;
  phase?: TaskPhase;
  channel: CommChannel;
  subject?: string;
  body: string;
}

export type SupplierType = "HEBERGEMENT" | "TRANSPORT" | "GUIDE_LOCAL" | "RESTAURATION" | "AUTRE";

export interface Supplier {
  id: string;
  name: string;
  type: SupplierType;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
}

export interface TaskTemplateItem {
  id: string;
  title: string;
  phase: TaskPhase;
  category: TaskCategory;
  dueOffsetDays: number;
  assigneeRole: string;
  priority: TaskPriority;
  subItems: string[];
  supplierId?: string;
  communicationTemplateId?: string;
  communicationTrigger?: CommTriggerMode;
}

export interface TaskTemplate {
  id: string;
  name: string;
  circuitTheme?: Circuit["theme"];
  items: TaskTemplateItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TripTaskSubItem {
  id: string;
  label: string;
  done: boolean;
}

export interface TripTaskAttachment {
  id: string;
  name: string;
  url: string;
  isImage: boolean;
}

export interface TripTask {
  id: string;
  tripId: string;
  templateItemId?: string;
  title: string;
  phase: TaskPhase;
  category: TaskCategory;
  dueDate: string;
  assigneeId?: string;
  assigneeName?: string;
  status: TaskStatus;
  priority: TaskPriority;
  subItems: TripTaskSubItem[];
  supplierId?: string;
  attachments: TripTaskAttachment[];
  communicationTemplateId?: string;
  communicationTrigger?: CommTriggerMode;
  createdAt: string;
  updatedAt: string;
}

export interface TripCommunication {
  id: string;
  tripId: string;
  taskId?: string;
  templateId?: string;
  channel: CommChannel;
  subject?: string;
  body: string;
  status: CommStatus;
  scheduledAt?: string;
  sentAt?: string;
  recipientParticipantIds: string[];
  createdBy: string;
}

export interface TripCheckin {
  tripId: string;
  participantId: string;
  day: number;
  done: boolean;
}

export interface TripTimelineEntry {
  id: string;
  tripId: string;
  label: string;
  detail?: string;
  actor?: string;
  date: string;
}

export type CircuitCategory =
  | "ESCAPADE_LOCALE"
  | "GRAND_CIRCUIT_BENIN"
  | "REGIONAL"
  | "INTERNATIONAL"
  | "EVENEMENTIEL";

export interface Circuit {
  id: string;
  slug: string;
  title: string;
  destinationId: string;
  destinationName: string;
  durationDays: number;
  priceXOF: number;
  priceEUR?: number;
  theme: "Culture" | "Safari" | "Plage" | "Aventure" | "Événement";
  category: CircuitCategory;
  isFeatured: boolean;
  images: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  priceTiers: PriceTier[];
  options: CircuitOption[];
  departures: CircuitDeparture[];
  guides?: CircuitGuide[];
  seoTitle?: string;
  seoDescription?: string;
  bookingsCount: number;
  createdAt: string;
  updatedAt: string;
}
