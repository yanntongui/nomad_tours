export interface BlogPost {
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
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    slug: "guide-complet-visiter-ganvie-venise-afrique",
    title: "Guide Complet : Tout savoir pour visiter Ganvié, la Venise de l'Afrique",
    excerpt: "Comment s'y rendre, meilleure période, prix des pirogues et respect des coutumes locales dans la plus grande cité lacustre du continent.",
    content: `
Ganvié est incontestablement l'une des merveilles culturelles majeures du Bénin et de toute l'Afrique de l'Ouest. Située sur le lac Nokoué, à quelques kilomètres seulement de Cotonou et d'Abomey-Calavi, cette cité lacustre abrite plus de 30 000 habitants vivant exclusivement sur l'eau.

### Histoire de Ganvié
Le nom "Ganvié" signifie littéralement en langue Fon "Nous avons trouvé le salut". Au XVIIIe siècle, la population Tofinu s'est réfugiée sur le lac pour échapper aux razzias des guerriers du royaume du Dahomey, car la religion du Dahomey interdisait aux soldats de combattre sur l'eau.

### Comment se déroule la visite avec Nomad Tours ?
1. **Embarquement à Abomey-Calavi** : Votre guide Nomad Tours vous accueille à l'embarcadère privé et réserve votre pirogue (motorisée ou traditionnelle).
2. **Traversée du Lac Nokoué** : Une trentaine de minutes de navigation paisible au milieu des Acadjas (parcs à poissons traditionnels).
3. **Le Marché Flottant** : Tôt le matin, les femmes commerçantes échangent poissons, ignames et fruits directement depuis leurs pirogues.
4. **Déjeuner sur Pilotis** : Profitez d'une dégustation de poisson frais au restaurant Chez M au cœur du village.
    `,
    coverImage: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
    category: "Conseils de Voyage",
    authorName: "Équipe Culture Nomad Tours",
    publishedAt: "25 Juillet 2026",
    readTimeMinutes: 5
  },
  {
    id: "post-2",
    slug: "mysteres-culture-vaudou-ouidah-benin",
    title: "À la Découverte du Vaudou à Ouidah : Mythes et Réalités",
    excerpt: "Loin des clichés hollywoodiens, découvrez la spiritualité pacifique du Vaudou, son histoire et le célèbre festival du 10 Janvier.",
    content: `
Capitale spirituelle du culte Vaudou, la ville de Ouidah attire chaque année des voyageurs du monde entier venus comprendre cette tradition ancestrale reconnue comme religion officielle au Bénin.

### Le Festival International Vaudou (10 Janvier)
Chaque 10 janvier, les plages de Ouidah accueillent des milliers de fidèles, dignitaires et touristes pour des cérémonies grandioses aux sons des tam-tams et des danses des Zangbéto (gardiens de la nuit).

### Les étapes incontournables à Ouidah :
- **Le Temple des Pythons** : Observez les pythons sacrés inoffensifs vénérés comme symboles de protection.
- **La Route des Esclaves** : Un chemin de recueillement de 4 kilomètres menant à la Porte du Non-Retour.
- **La Forêt Sacrée de Kpassè** : Une immersion parmi les arbres centenaires et les statues des divinités Vaudou.
    `,
    coverImage: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
    category: "Culture & Histoire",
    authorName: "Rodrigue Kpadonou",
    publishedAt: "12 Juin 2026",
    readTimeMinutes: 7
  },
  {
    id: "post-3",
    slug: "reussir-son-safari-parc-pendjari-benin",
    title: "Comment Réussir son Safari dans le Parc National de la Pendjari",
    excerpt: "Matériel à prévoir, meilleure saison pour observer les lions et éléphants, et choix des lodges au cœur de la savane.",
    content: `
Le Parc National de la Pendjari est la réserve de faune sauvage la plus riche d'Afrique de l'Ouest. Situé au Nord-Bénin, dans la chaîne de l'Atacora, il abrite une biodiversité exceptionnelle.

### Quand partir en safari ?
La meilleure période s'étend de **décembre à avril**, pendant la saison sèche. La végétation est basse et les points d'eau se raréfient, ce qui rassemble les animaux autour des marres de Bali et de Yangouali.

### Les animaux à observer :
- Le Lion d'Afrique de l'Ouest (espèce menacée hautement protégée)
- Les grands troupeaux d'Éléphants d'Afrique
- Hippopotames, Buffles, Léopards et plus de 300 espèces d'oiseaux.
    `,
    coverImage: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
    category: "Safari & Nature",
    authorName: "Équipe Safari Nomad Tours",
    publishedAt: "04 Mai 2026",
    readTimeMinutes: 6
  }
];
