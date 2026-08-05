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

export interface HomepageContent {
  hero: HomepageHero;
  stats: HomepageStat[];
  services: HomepageServicesSection;
  whyUs: HomepageWhyUsSection;
  featuredCircuit: HomepagePromoBanner;
  newsletter: HomepageNewsletterBanner;
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

export type BlogPostStatus = "DRAFT" | "PUBLISHED";

export interface AdminBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  authorName: string;
  publishedAt: string;
  readTimeMinutes: number;
  status: BlogPostStatus;
}

export interface CmsSeoSettings {
  siteTitle: string;
  metaDescription: string;
  ogImage?: string;
}

export type TaskPhase = "AVANT" | "PENDANT" | "APRES";
export type TaskCategory = "LOGISTIQUE" | "FOURNISSEURS" | "DOCUMENTS_CLIENT" | "COMMUNICATION" | "FINANCE";
export type TaskStatus = "A_FAIRE" | "EN_COURS" | "FAIT" | "BLOQUE";
export type TaskPriority = "NORMALE" | "URGENTE";
export type CommChannel = "EMAIL" | "SMS" | "PUSH";
export type CommTriggerMode = "AUTO" | "VALIDATION" | "MANUEL";
export type CommStatus = "PROGRAMMEE" | "EN_ATTENTE_VALIDATION" | "ENVOYEE" | "ANNULEE";

export interface CommunicationTemplate {
  id: string;
  name: string;
  phase: TaskPhase;
  channel: CommChannel;
  subject?: string;
  body: string;
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
  supplierTag?: string;
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
  supplierTag?: string;
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
  isFeatured: boolean;
  images: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  priceTiers: PriceTier[];
  options: CircuitOption[];
  departures: CircuitDeparture[];
  guide?: CircuitGuide;
  seoTitle?: string;
  seoDescription?: string;
  bookingsCount: number;
  createdAt: string;
  updatedAt: string;
}
