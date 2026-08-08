# Backend — guide d'intégration

Ce document décrit le backend Supabase de Nomad Tours : schéma, authentification,
RLS, et la couche d'accès aux données (`src/lib/server/*.ts`) qui expose ce
backend au reste de l'app Next.js. Il sert de référence quand on branchera le
front (public + admin) sur de vraies données à la place des mocks en mémoire
(`src/lib/data/*.ts`, `src/lib/admin/mock/*.ts`, `src/lib/admin/store/*.ts`).

Le backend est **utilisable dès maintenant en lecture/écriture** mais **rien
dans l'UI ne l'appelle encore** : `CircuitForm.tsx`, `bookings-store.ts`, etc.
continuent de lire/écrire les tableaux en mémoire. Le travail de branchement
(remplacer les stores/mocks par des appels à `src/lib/server/*.ts`, éventuellement
via des Server Actions ou des Route Handlers) reste à faire.

## 1. Project Supabase

- Projet : `nomadtours` (ref `sgtedwtbjlhildsrymra`)
- URL : `https://sgtedwtbjlhildsrymra.supabase.co`
- Schéma applicatif : `public` (44 tables, cf. §3) + `private` (fonctions
  utilitaires RLS, non exposées à l'API)

## 2. Variables d'environnement

Voir `.env.example` à la racine. Trois variables, toutes dans `.env.local`
(gitignored) :

| Variable | Exposée au navigateur ? | Usage |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | oui | URL du projet, utilisée par tous les clients |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | oui | Clé publique (`anon`/publishable), soumise à la RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | **non** | Clé service-role, bypass la RLS — jamais côté client, jamais `NEXT_PUBLIC_*` |

`SUPABASE_SERVICE_ROLE_KEY` doit être copiée manuellement depuis le Dashboard
Supabase (Project Settings → API) dans `.env.local` ; elle n'est utilisée que
par `src/lib/supabase/admin.ts`, réservé aux besoins d'administration hors RLS
(scripts, jobs serveur) — **pas** pour les requêtes admin back-office
classiques, qui doivent passer par un utilisateur `authenticated` et la RLS.

## 3. Schéma

44 tables dans `public`. Vue d'ensemble par domaine (voir
`src/lib/supabase/database.types.ts` pour le détail des colonnes/enums, généré
depuis Supabase — ne pas éditer à la main, régénérer via
`generate_typescript_types` après toute migration) :

- **Site public / contenu** : `destinations`, `destination_points_of_interest`,
  `circuits`, `circuit_itinerary_days`, `circuit_price_tiers`,
  `circuit_options`, `circuit_departures`, `blog_posts`, `testimonials`,
  `homepage_content`, `cms_seo_settings`, `agency_settings`
- **CRM** : `clients`, `client_notes`
- **Réservations** : `bookings`, `booking_timeline`, `booking_messages`,
  `booking_notes`, `booking_documents`, `payments`, `payment_schedules`
- **Voyages en cours** : `trips`, `trip_participants`, `trip_checkins`,
  `trip_tasks`, `trip_timeline`, `trip_updates`, `trip_feedbacks`,
  `trip_media`, `trip_communications`
- **Visas** : `visa_requests`, `visa_documents`, `visa_timeline`
- **Événementiel** : `event_requests`, `event_timeline`
- **Vols** : `flight_bookings`
- **Support** : `support_tickets`, `ticket_messages`, `ticket_timeline`
- **Fidélité** : `loyalty_offers`
- **Back-office** : `admin_profiles`, `communication_templates`,
  `task_templates`, `task_template_items`

`prisma/schema.prisma` documente ce même schéma sous forme de modèles Prisma —
c'est une référence de design, pas une source active (aucun import de
`PrismaClient` dans le code ; toutes les requêtes passent par
`@supabase/supabase-js`/`@supabase/ssr`).

## 4. Authentification & rôles

Auth réelle via **Supabase Auth** (email/password), remplaçant à terme le
role-switcher dev-only `AdminRoleContext` (`localStorage`, aucune vérification
serveur).

- `public.admin_profiles` : une ligne par compte staff (`id` = `auth.users.id`,
  `name`, `email`, `phone`, `role` (`admin_role` enum : `SUPER_ADMIN` |
  `AGENT` | `GUIDE`), `avatar_color`, `active`).
- Trigger `handle_new_admin_user()` sur `auth.users` (`AFTER INSERT`) crée
  automatiquement la ligne `admin_profiles` correspondante à la création du
  compte Auth (`name` = `raw_user_meta_data->>'name'` ou email, `on conflict
  do nothing`).
- Deux fonctions `private` (schéma non exposé à l'API REST, donc non
  appelables directement par les clients) utilisées dans les policies RLS :
  - `private.is_active_staff()` → `true` si `auth.uid()` correspond à un
    `admin_profiles.active = true`
  - `private.staff_role()` → renvoie le `role` du profil actif de
    `auth.uid()`, ou `null`

Aucune page de login n'existe encore côté front. `src/lib/server/users.ts`
expose déjà `getCurrentAdminProfile()` (lit `auth.getUser()` côté serveur puis
va chercher le profil correspondant) — c'est la fonction à appeler pour
remplacer `useAdminRole()` une fois un flow de connexion réel en place.

**Désactiver un compte** ne le supprime pas (`deactivateAdminProfile` met
juste `active = false`) afin de préserver l'historique (bookings/trips/etc.
référencent des `admin_profiles.id`).

## 5. RLS — modèle d'autorisation

La RLS est **la seule** couche d'autorisation : `src/lib/server/*.ts` ne fait
aucune vérification de rôle manuelle, il laisse Postgres refuser les requêtes
non autorisées. Concrètement, trois patterns de policies sont utilisés selon
la table (cf. requête `pg_policies` pour le détail exhaustif) :

1. **Contenu public en lecture, staff en écriture** (`destinations`,
   `circuits` + tables enfants, `homepage_content`, `cms_seo_settings`) :
   `SELECT` ouvert à `anon`/`authenticated` (`qual: true`), `INSERT`/`UPDATE`/
   `DELETE` réservés à `private.is_active_staff()`.
2. **Modération** (`blog_posts`, `testimonials`) : le public ne voit que les
   lignes `status = 'PUBLISHED'`/`'APPROVED'` ; le staff authentifié voit tout
   en lecture ; seul `SUPER_ADMIN` peut insérer/modifier/supprimer.
3. **Opérationnel, réservé au staff actif** (bookings, trips, clients, visas,
   events, support, templates, etc.) : policy `FOR ALL` avec `USING`/`WITH
   CHECK` = `private.is_active_staff()`. Pas d'accès `anon`.
4. **Réservé `SUPER_ADMIN`** (`payments`, `payment_schedules`,
   `agency_settings`, `admin_profiles` en écriture) : `private.staff_role() =
   'SUPER_ADMIN'`. Reflète le gating déjà fait côté UI par
   `RequireSuperAdmin.tsx`/`Sidebar.tsx`, mais appliqué en base — donc même un
   appel direct à l'API Supabase depuis un compte `AGENT`/`GUIDE` sera rejeté.

Implication pour le front à venir : un `AGENT`/`GUIDE` connecté qui tente de
lire `payments` ou d'écrire dans `admin_profiles` recevra une erreur Postgres
(RLS), pas un tableau vide silencieux — prévoir la gestion d'erreur en
conséquence plutôt que de compter uniquement sur le masquage de nav
(`Sidebar.tsx`).

## 6. Clients Supabase (`src/lib/supabase/`)

| Fichier | À utiliser dans | Détails |
|---|---|---|
| `client.ts` | Client Components (`"use client"`) | `createBrowserClient`, soumis à la RLS |
| `server.ts` | Server Components, Server Actions, Route Handlers | `createServerClient`, cookie-aware (lit/écrit les cookies de session), soumis à la RLS |
| `admin.ts` | Scripts serveur/jobs uniquement | `createAdminClient`, clé service-role, **bypass la RLS** — importe `server-only` pour empêcher toute inclusion dans un bundle client |
| `middleware.ts` + `src/middleware.ts` (racine) | — | `updateSession()` rafraîchit le cookie de session Supabase sur chaque requête. **Ne protège pas `/admin/**`** : aucune redirection n'est faite faute de page de login — à ajouter quand le flow d'auth front existera |
| `database.types.ts` | — | Types générés, régénérer après toute migration de schéma |

`src/lib/server/*.ts` utilise systématiquement `server.ts` (jamais `admin.ts`)
— c'est la couche destinée à être appelée depuis des Server
Components/Actions, donc toujours dans le contexte d'un utilisateur
authentifié dont la session détermine ce que la RLS autorise.

## 7. Couche d'accès aux données (`src/lib/server/*.ts`)

Un fichier par domaine, calqué sur les deux patterns déjà documentés dans
`CLAUDE.md` pour les stores mock :

- **CRUD plat** (`list`/`get`/`create`/`update`/`delete`, + `replaceX` pour
  les listes enfants type itinéraire/tiers de prix) : `destinations.ts`,
  `circuits.ts`, `blog.ts`, `testimonials.ts`, `clients.ts`, `loyalty.ts`,
  `settings.ts`, `homepage.ts`, `cms-settings.ts`,
  `communication-templates.ts`, `task-templates.ts`, `users.ts`, `flights.ts`
- **Narrow-mutator + timeline** (agrégats avec sous-collections et journal
  d'audit) : `bookings.ts`, `trips.ts`, `visas.ts`, `events.ts`, `support.ts`
  — chacun a une fonction `log<Domaine>Timeline(id, actor, label, detail?)`
  et des fonctions `update<X>Status(...)` qui loguent automatiquement le
  changement.

Toutes les fonctions sont `async`, appellent `await createClient()` (client
`server.ts`), et font `if (error) throw error` — aucun try/catch ni valeur de
repli : une erreur Supabase (RLS refusée, contrainte violée, etc.) remonte
telle quelle à l'appelant, à charge pour lui (Server Action, Route Handler) de
la gérer.

### Référence par fichier

| Fichier | Fonctions exportées |
|---|---|
| `destinations.ts` | `listDestinations`, `getDestinationBySlug`, `getDestination`, `createDestination`, `updateDestination`, `deleteDestination`, `replacePointsOfInterest` |
| `circuits.ts` | `listCircuits`, `listCircuitsByDestination`, `getCircuitBySlug`, `getCircuit`, `createCircuit`, `updateCircuit`, `deleteCircuit`, `replaceItineraryDays`, `replacePriceTiers`, `replaceOptions`, `replaceDepartures` |
| `blog.ts` | `listPublishedBlogPosts`, `listAllBlogPosts`, `getBlogPostBySlug`, `getBlogPost`, `createBlogPost`, `updateBlogPost`, `deleteBlogPost` |
| `testimonials.ts` | `listApprovedTestimonials`, `listApprovedTestimonialsForDestination`, `listAllTestimonials`, `createTestimonial`, `updateTestimonial`, `moderateTestimonial`, `deleteTestimonial` |
| `flights.ts` | `listFlightBookingsForClient`, `getFlightBooking`, `createFlightBooking`, `updateFlightBooking` |
| `clients.ts` | `listClients`, `getClient`, `createClientRecord`, `updateClient`, `deleteClient`, `addClientNote` |
| `loyalty.ts` | `listActiveLoyaltyOffers`, `listAllLoyaltyOffers`, `createLoyaltyOffer`, `updateLoyaltyOffer`, `deleteLoyaltyOffer` |
| `settings.ts` | `getAgencySettings`, `updateAgencySettings` |
| `homepage.ts` | `getHomepageContent`, `updateHomepageContent` |
| `cms-settings.ts` | `getCmsSeoSettings`, `updateCmsSeoSettings` |
| `communication-templates.ts` | `listCommunicationTemplates`, `getCommunicationTemplate`, `createCommunicationTemplate`, `updateCommunicationTemplate`, `deleteCommunicationTemplate` |
| `task-templates.ts` | `listTaskTemplates`, `getTaskTemplate`, `createTaskTemplate`, `updateTaskTemplate`, `deleteTaskTemplate`, `replaceTaskTemplateItems` |
| `users.ts` | `getCurrentAdminProfile`, `listAdminProfiles`, `getAdminProfile`, `updateAdminProfile`, `deactivateAdminProfile` |
| `bookings.ts` | `listBookings`, `listBookingsForClient`, `getBooking`, `createBooking`, `updateBookingStatus`, `updateBooking`, `logBookingTimeline`, `addBookingMessage`, `addBookingNote`, `addBookingDocument`, `addPayment`, `updatePaymentStatus`, `addPaymentSchedule`, `markScheduleAsPaid` |
| `trips.ts` | `listTrips`, `listTripsByStatus`, `getTrip`, `createTrip`, `updateTrip`, `updateTripStatus`, `logTripTimeline`, `addParticipant`, `addTripUpdate`, `addTripFeedback`, `addTripMedia`, `createTripTask`, `updateTripTaskStatus`, `updateTripTask`, `scheduleTripCommunication`, `setCheckin` |
| `visas.ts` | `listVisaRequests`, `listVisaRequestsForClient`, `getVisaRequest`, `createVisaRequest`, `updateVisaRequest`, `advanceVisaStatus`, `logVisaTimeline`, `addVisaDocument` |
| `events.ts` | `listEventRequests`, `listEventRequestsForClient`, `getEventRequest`, `createEventRequest`, `updateEventRequest`, `advanceEventStatus`, `logEventTimeline` |
| `support.ts` | `listSupportTickets`, `listSupportTicketsForClient`, `getSupportTicket`, `createSupportTicket`, `updateSupportTicket`, `updateTicketStatus`, `logTicketTimeline`, `addTicketMessage` |
| `types.ts` | `Tables<T>`, `TablesInsert<T>`, `TablesUpdate<T>`, `Enums<T>` — helpers génériques réexportant `Database["public"]["Tables"][T]["Row"/"Insert"/"Update"]` et `Database["public"]["Enums"][T]` |

Les fonctions `get*`/`list*` qui embarquent des relations (ex.
`getCircuit`/`listCircuits` avec jours d'itinéraire, tiers de prix, options,
départs ; `getBooking` avec paiements/échéances/timeline/messages/notes/
documents ; `getTrip` avec participants/tâches/timeline/etc.) exposent un
type `XRow` exporté (`CircuitRow`, `BookingRow`, `TripRow`, `VisaRequestRow`,
`EventRequestRow`, `SupportTicketRow`, `TaskTemplateRow`,
`DestinationRow`/`PointOfInterestRow`, `ClientRow`) qui étend le type de table
généré avec les tableaux enfants — à utiliser côté front à la place des
interfaces mock équivalentes (`src/lib/admin/types.ts`) une fois le
branchement fait.

### Couverture volontairement partielle

Cette couche couvre les opérations CRUD/mutateurs de base par domaine, pas
une portée 1:1 exhaustive de chaque méthode des stores mock actuels
(`src/lib/admin/store/*.ts`). En branchant le front, si une action UI
spécifique (ex. un filtre combiné, une agrégation) n'a pas d'équivalent ici,
ajouter la fonction manquante dans le fichier du domaine concerné en suivant
le même style (client `server.ts`, `if (error) throw error`, pas de logique
d'autorisation).

## 8. Prochaines étapes (front)

1. Créer une page de connexion admin (`supabase.auth.signInWithPassword`),
   stocker la session via le client `client.ts`/cookies gérés par
   `@supabase/ssr`.
2. Étendre `src/middleware.ts` pour rediriger vers cette page les requêtes
   `/admin/**` sans session valide (actuellement le middleware ne fait que
   rafraîchir le cookie, il ne bloque rien).
3. Remplacer `AdminRoleContext` (`role` en `localStorage`) par
   `getCurrentAdminProfile()` (`src/lib/server/users.ts`) pour dériver le
   rôle réel depuis `admin_profiles`, tout en gardant `Sidebar.tsx`/
   `RequireSuperAdmin.tsx` comme UX de garde (la vraie autorisation reste la
   RLS, cf. §5).
4. Remplacer progressivement chaque store mock
   (`src/lib/admin/store/*-store.ts`) par des appels aux fonctions
   correspondantes de `src/lib/server/*.ts`, typiquement via des Server
   Actions (`"use server"`) appelées depuis les formulaires/boutons
   existants, en gardant la même signature de haut niveau pour limiter les
   changements dans les composants.
5. Pour le site public (`src/lib/data/*.ts`), remplacer les imports de
   données statiques par les fonctions `list*`/`get*` correspondantes
   (`destinations.ts`, `circuits.ts`, `blog.ts`, `testimonials.ts`,
   `homepage.ts`, `cms-settings.ts`) appelées depuis les Server Components de
   page.
