# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Next.js 14 App Router)
npm run build    # production build
npm run start    # run a production build
npm run lint     # next lint
npx tsc --noEmit # type-check the whole project (no separate typecheck script)
```

There is no test suite or test framework configured in this repo (no `test` script, no Jest/Vitest/Playwright dependency). Do not invent a test command — after changes, verify with `npx tsc --noEmit`, `npm run lint`, and by driving the affected pages in a browser.

Path alias: `@/*` → `./src/*` (see `tsconfig.json`).

## Architecture

This is a Next.js 14 App Router + TypeScript app for **Nomad Tours**, a Benin tourism agency. It has two largely independent halves that share one Next.js app:

1. **Public marketing site** — routes at the root (`src/app/page.tsx`, `circuits/`, `destinations/`, `blog/`, `visas/`, `vols/`, `evenements/`, `contact/`, `voyages/[id]/`, `dashboard/`). Data comes from `src/lib/data/*.ts` typed via `src/types/index.ts`.
2. **Internal admin back-office** at `/admin/**` (`src/app/admin/`) — a full operational dashboard covering Réservations, Voyages en cours, Destinations, Circuits, Visas, Événementiel, Clients CRM, Paiements, Contenu (CMS), Utilisateurs & Rôles, Paramètres. This is the actively developed part of the app.

### No backend yet — everything is in-memory mock data

`@prisma/client`/`prisma` are dependencies and `prisma/schema.prisma` exists (defines the target Postgres schema — enums like `BookingStatus`, `PaymentMethod`, etc.), but **nothing in the app imports `PrismaClient`**. There is no `DATABASE_URL`, no auth (no NextAuth, no middleware, no sessions/login). All admin data lives in typed in-memory arrays under `src/lib/admin/mock/*.ts`, mutated through client-side stores under `src/lib/admin/store/*.ts`. Types in `src/lib/admin/types.ts` are deliberately written to mirror the eventual Prisma models 1:1 (flat interfaces + foreign-key-style string fields, no nested relations) so that swapping mock data for real Prisma queries later is a drop-in replacement rather than a rewrite.

There are two parallel type/data trees — don't confuse them:
- **Public site**: `src/types/index.ts` + `src/lib/data/*.ts`
- **Admin**: `src/lib/admin/types.ts` + `src/lib/admin/mock/*.ts` + `src/lib/admin/store/*.ts`

Admin types are often supersets/mirrors of public ones (e.g. admin `Client` extends public `ClientRef`; `AdminTestimonial`/`AdminBlogPost` mirror the public `Testimonial`/`BlogPost` shapes plus a `status` field for moderation/drafts).

### Admin store patterns

Every admin domain has a matching `store/<domain>-store.ts` + `mock/<domain>.ts` pair. All stores are `"use client"` modules using `useSyncExternalStore` with a module-level mutable variable, a `Set<() => void>` of listeners, and `emit()`/`subscribe()`. There are two flavors — match whichever an existing file in the same domain already uses rather than inventing a third:

- **Single-upsert** (`circuits-store.ts`, `destinations-store.ts`, `blog-store.ts`, `task-templates-store.ts`, `communication-templates-store.ts`): one entity array + `nextId(prefix)` (Date.now()-based) + `useX()` / `getX(id)` / `createEmptyX()` / `upsertX(entity)` / `duplicateX(id)` / `deleteX(id)`. Used for entities edited as a single form with nested arrays (itinerary days, images, etc.).
- **Narrow-mutator / multi-array `State`** (`bookings-store.ts`, `trips-store.ts`): one `State` object holding several related arrays (e.g. bookings/payments/schedules/timeline/messages/notes/documents), a shared `emit()`/`subscribe()`/`nextId()`, a `logTimeline()` audit helper, and many small exported mutators that each take an `actor: string` param for the audit trail. Used for aggregate domains where multiple sub-entities (payments, notes, tasks, communications) are scoped by a parent id (`bookingId`, `tripId`).

When adding a new admin domain, pick the pattern that matches the shape of the data (flat form-edited entity → single-upsert; parent with several child collections and an activity log → narrow-mutator).

### Admin routing/UI conventions

- List pages: search + `Select` filter toolbar, `DataTable` (TanStack Table wrapper in `src/components/admin/DataTable.tsx`) with `ColumnDef[]`, row actions via `DropdownMenu`, `onRowClick` → detail page.
- Detail/edit pages follow one of two shapes:
  - Tabbed form over local `useState` (`CircuitForm.tsx`, `DestinationForm.tsx`, `BlogForm.tsx`, `TaskTemplateForm.tsx`) — Save calls the store's `upsertX()` then `router.push`s away. Used when the entity has nested arrays that need a real editing surface (drag-reorder, etc.).
  - Quick-action bar + `Tabs` over live store state (reservation/trip detail pages) — mutations go straight through store functions and re-render via `useSyncExternalStore`, no local form state or explicit save step.
  - Flat entities with no nested arrays (users, communication templates) use a `Dialog` CRUD form instead of a dedicated route.
- Drag-reorder (itinerary days, template items, image lists) uses `DragDropList.tsx` (`@dnd-kit/*`), which only supports reordering within one flat list — it is not used for cross-column/Kanban dragging. Where the spec called for Kanban-style boards (trip tasks, trip status), the app deliberately uses status columns with an explicit "change status" action instead of drag-and-drop between columns.
- Linear multi-step workflows (Visa requests, Événementiel requests) use `StatusWorkflowBar.tsx`, a generic step indicator (`steps`, `current`, `onAdvance`).
- There is no `Switch`/`@radix-ui/react-switch` primitive installed. Toggle rows reuse `Checkbox` styled as a labeled toggle (see Paramètres notifications, Participants checklist).
- "Send" actions (email/SMS reminders, communication templates, invoice generation) are UI-complete stubs — no real provider is wired up. They mutate a `status` field (e.g. `CommStatus`) and set a timestamp; `window.print()` is used as the stub for "generate invoice/quote".

### RBAC (dev-only, not real auth)

`src/context/AdminRoleContext.tsx` provides `useAdminRole()` returning `{ role, user, setRole }`. It's a role-switcher, not authentication: `role: AdminRole` (`"SUPER_ADMIN" | "AGENT" | "GUIDE"`) defaults to `"SUPER_ADMIN"` on first render and hydrates a persisted value from `localStorage` (`"nomad-admin-role"`) in a `useEffect`, so SSR and first client render always agree (avoids hydration mismatch) before the stored role is applied. `user` is resolved by matching `ADMIN_USERS` (`src/lib/admin/mock/users.ts`) to the current role.

`src/components/admin/Sidebar.tsx` filters `NAV_ITEMS` by `roles: AdminRole[]` per item — this is the single source of truth for which modules each role can navigate to (e.g. Paiements/Contenu/Utilisateurs/Paramètres are `SUPER_ADMIN`-only). Sidebar filtering alone doesn't stop direct navigation, so pages under those `SUPER_ADMIN`-only sections additionally guard their content with `src/components/admin/RequireSuperAdmin.tsx`.

### Root layout chrome

`src/app/layout.tsx` is itself `"use client"` and uses `usePathname()` to conditionally render the public `Header`/`Footer`/`ChatbotWidget`: they're suppressed on `/` (landing) and on all `/admin/**` routes. The admin section provides its own chrome via `src/app/admin/layout.tsx` (`AdminRoleProvider` + `Sidebar` + `Topbar`, background `bg-admin-bg`).

### Styling

Tailwind with custom tokens in `tailwind.config.js`: `nomad.*` (legacy landing palette), `luxe.*` (current site accent — `luxe.terracotta` is the shared admin accent color too), `admin.bg` (admin shell background). Fonts are wired through `next/font/google` as CSS variables (`--font-serif` = Fraunces, `--font-sans` = Inter) and mapped in Tailwind's `fontFamily`. Class merging uses the standard `cn()` helper (`src/lib/utils.ts`, `clsx` + `tailwind-merge`). UI primitives under `src/components/ui/` are hand-written shadcn-style components (Radix primitive + `cva` variants + Tailwind) — there is no shadcn CLI config, add new primitives by hand following the existing ones.
