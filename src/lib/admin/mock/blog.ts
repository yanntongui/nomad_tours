import { BLOG_POSTS } from "@/lib/data/blog-posts";
import { AdminBlogPost } from "@/lib/admin/types";

export const ADMIN_BLOG_POSTS: AdminBlogPost[] = [
  ...BLOG_POSTS.map((p) => ({ ...p, status: "PUBLISHED" as const })),
  {
    id: "post-4",
    slug: "meilleures-plages-benin-grand-popo",
    title: "Les Meilleures Plages du Bénin : Grand-Popo et au-delà",
    excerpt: "Du sable doré de Grand-Popo aux criques secrètes de Ouidah, notre sélection des plus belles plages du littoral béninois.",
    content: `
Le littoral béninois regorge de plages encore préservées du tourisme de masse, idéales pour un séjour balnéaire authentique en marge des circuits classiques.

### Grand-Popo, la favorite des voyageurs
À la frontière avec le Togo, Grand-Popo offre de longues étendues de sable bordées de cocotiers et l'embouchure du fleuve Mono.

### À compléter avant publication
Cette section nécessite encore une relecture et l'ajout de photos supplémentaires côté hébergements.
    `,
    coverImage: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    category: "Conseils de Voyage",
    authorName: "Équipe Culture Nomad Tours",
    publishedAt: "02 Août 2026",
    readTimeMinutes: 4,
    status: "DRAFT",
  },
];
