import { HomepageContent } from "@/lib/admin/types";

export const HOMEPAGE_CONTENT: HomepageContent = {
  hero: {
    eyebrow: "Agence de voyage premium — Bénin & International",
    headlineLine1: "L'Afrique et le monde,",
    headlineHighlight: "réinventés pour vous",
    subheadline:
      "Circuits sur-mesure, billetterie et assistance visa — une agence à taille humaine pour des voyages sans compromis, du Bénin aux quatre coins du monde.",
    backgroundImage:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2400&q=80",
  },
  stats: [
    { id: "stat-1", value: 500, suffix: "+", label: "Voyageurs accompagnés" },
    { id: "stat-2", value: 15, suffix: "", label: "Pays de destination" },
    { id: "stat-3", value: 98, suffix: "%", label: "Clients satisfaits" },
    { id: "stat-4", value: 10, suffix: " ans", label: "D'expérience terrain" },
  ],
  services: {
    eyebrow: "Nos expertises",
    title: "Tout votre voyage, orchestré par une seule équipe",
    items: [
      {
        id: "service-1",
        title: "Destinations & Circuits",
        description:
          "Du Bénin authentique aux plus belles routes du monde, des itinéraires pensés comme des récits de voyage.",
        icon: "COMPASS",
        image:
          "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=800&q=80",
        href: "/circuits",
      },
      {
        id: "service-2",
        title: "Billetterie Aérienne",
        description:
          "Des tarifs négociés et un accompagnement dédié pour vos vols, seul, en famille ou en groupe.",
        icon: "PLANE",
        image:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
        href: "/vols",
      },
      {
        id: "service-3",
        title: "Assistance Visa",
        description:
          "Un accompagnement administratif rigoureux pour aborder vos démarches de visa en toute sérénité.",
        icon: "FILE_CHECK",
        image:
          "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=800&q=80",
        href: "/visas",
      },
      {
        id: "service-4",
        title: "Événementiel Sur-Mesure",
        description:
          "Séminaires, mariages, réceptions — des événements orchestrés sur des lieux d'exception.",
        icon: "PARTY_POPPER",
        image:
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
        href: "/evenements",
      },
    ],
  },
  whyUs: {
    eyebrow: "Pourquoi Nomad Tours",
    title: "Une agence à taille humaine, une exigence internationale",
    intro:
      "Depuis Cotonou, nous concevons des voyages qui ressemblent à ceux qui les vivent. Chaque circuit est pensé sur-mesure, chaque démarche simplifiée, chaque détail anticipé.",
    items: [
      {
        id: "why-1",
        icon: "HEADPHONES",
        title: "Accompagnement de bout en bout",
        description:
          "Avant, pendant et après votre voyage, une équipe joignable pour anticiper chaque détail.",
      },
      {
        id: "why-2",
        icon: "COMPASS",
        title: "Circuits sur-mesure & expertise locale",
        description:
          "Des itinéraires conçus avec des partenaires locaux, loin des sentiers battus du tourisme de masse.",
      },
      {
        id: "why-3",
        icon: "FILE_CHECK",
        title: "Assistance visa simplifiée",
        description:
          "Nous gérons la complexité administrative pour que seul le voyage reste à votre esprit.",
      },
      {
        id: "why-4",
        icon: "WALLET",
        title: "Paiement flexible",
        description:
          "Mobile Money, virement ou paiement échelonné — voyagez selon votre rythme, pas le nôtre.",
      },
    ],
    image1:
      "https://images.unsplash.com/photo-1638732984528-f255c9714619?auto=format&fit=crop&w=1000&q=80",
    image2:
      "https://images.unsplash.com/photo-1783254862103-2dd9fc8c3e2b?auto=format&fit=crop&w=1000&q=80",
  },
  featuredCircuit: {
    badge: "Circuit populaire",
    title: "Grand Safari Pendjari & Pays Somba",
    subtitle: "8 jours / 7 nuits — Nord du Bénin",
    highlights: [
      "Safari en 4x4 au cœur du Parc de la Pendjari",
      "Nuit immersive dans une authentique Tata Somba",
      "Guide francophone expert du patrimoine local",
      "Hébergement en lodge de charme tout inclus",
    ],
    priceLabel: "À partir de",
    priceValue: "385 000 FCFA",
    ctaLabel: "Voir le programme complet",
    ctaHref: "/circuits",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1600&q=80",
  },
  newsletter: {
    title: "Votre prochaine aventure commence ici",
    subtitle:
      "Inspirations, itinéraires exclusifs et offres saisonnières — directement dans votre boîte mail.",
    confirmMessage: "Merci ! Vous recevrez bientôt notre prochaine inspiration voyage.",
    disclaimer: "Pas de spam, juste de l'inspiration voyage.",
  },
  sectionsOrder: [
    { key: "hero", enabled: true, order: 0 },
    { key: "trustBar", enabled: true, order: 1 },
    { key: "services", enabled: true, order: 2 },
    { key: "destinations", enabled: true, order: 3 },
    { key: "whyUs", enabled: true, order: 4 },
    { key: "featuredCircuit", enabled: true, order: 5 },
    { key: "testimonials", enabled: true, order: 6 },
    { key: "gallery", enabled: true, order: 7 },
    { key: "newsletter", enabled: true, order: 8 },
  ],
  featuredDestinations: {
    eyebrow: "Inspirations de voyage",
    title: "Destinations vedettes",
    destinationIds: ["dest-afrique-sud", "dest-grand-popo", "dest-ganvie"],
  },
  testimonialsConfig: {
    eyebrow: "Ils nous ont fait confiance",
    title: "Ce que nos voyageurs racontent",
    testimonialIds: ["test-1", "test-2", "test-3"],
  },
  footer: {
    description:
      "Voyages sur-mesure au Bénin et à l'international. Une agence à taille humaine, une exigence sans compromis.",
    address: "Cotonou, Bénin",
    phone: "+229 01 97 00 00 00",
    email: "contact@nomadtours.bj",
    columns: [
      {
        id: "footer-col-services",
        title: "Services",
        links: [
          { id: "footer-link-1", label: "Circuits sur-mesure", href: "/circuits" },
          { id: "footer-link-2", label: "Billetterie aérienne", href: "/vols" },
          { id: "footer-link-3", label: "Assistance e-Visa", href: "/visas" },
          { id: "footer-link-4", label: "Événementiel & séminaires", href: "/evenements" },
        ],
      },
    ],
    socials: [
      { id: "footer-social-1", platform: "Instagram", url: "#" },
      { id: "footer-social-2", platform: "Facebook", url: "#" },
      { id: "footer-social-3", platform: "Youtube", url: "#" },
    ],
  },
};
