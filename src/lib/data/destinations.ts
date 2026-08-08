import { Destination } from "@/types";

export const DESTINATIONS: Destination[] = [
  {
    id: "dest-ganvie",
    slug: "ganvie-venise-afrique",
    name: "Ganvié",
    country: "Bénin",
    region: "Lac Nokoué / Sud-Bénin",
    description: "Surnommée la Venise de l'Afrique, Ganvié est la plus grande cité lacustre du continent africain, abritant plus de 30 000 habitants vivant dans des maisons en bois sur pilotis au milieu du lac Nokoué. Une immersion culturelle fascinante au fil de l'eau.",
    highlights: [
      "Balade féerique en pirogue au marché flottant",
      "Architecture ancestrale sur pilotis du peuple Tofinu",
      "Observation des pêcheurs aux éperviers et parcs à poissons (Acadjas)",
      "Dégustation du poisson frais braisé au piment vert"
    ],
    images: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Tropical humide, température moyenne 27°C",
    bestPeriod: "Novembre à Mars (Saison sèche)",
    isInternational: false,
    isFeatured: true,
    latitude: 6.4633,
    longitude: 2.4189,
    startingPriceXOF: 35000,
    rating: 4.9,
    reviewsCount: 142
  },
  {
    id: "dest-ouidah",
    slug: "ouidah-histoire-vaudou",
    name: "Ouidah",
    country: "Bénin",
    region: "Atlantique / Sud-Bénin",
    description: "Ville mémoire poignante et capitale mondiale du culte Vaudou, Ouidah vous plonge au cœur de l'histoire transatlantique à travers la Route des Esclaves, le Temple des Pythons et la majestueuse Porte du Non-Retour face à l'océan Atlantique.",
    highlights: [
      "Marche de la mémoire sur la Route des Esclaves jusqu'à la Porte du Non-Retour",
      "Visite mystique du Temple des Pythons sacrés",
      "Musée d'Histoire de Ouidah situé dans l'ancien Fort Portugais",
      "Forêt Sacrée de Kpassè et ses sculptures anthropomorphes géantes",
      "Festival international Vaudou le 10 Janvier"
    ],
    images: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Chaud et semi-humide, 26°C à 31°C",
    bestPeriod: "Novembre à Février (Grandes festivités)",
    isInternational: false,
    isFeatured: true,
    latitude: 6.3631,
    longitude: 2.0853,
    startingPriceXOF: 45000,
    rating: 4.8,
    reviewsCount: 198
  },
  {
    id: "dest-pendjari",
    slug: "parc-national-pendjari",
    name: "Parc National de la Pendjari",
    country: "Bénin",
    region: "Atacora / Nord-Bénin",
    description: "Le plus beau sanctuaire de faune sauvage d'Afrique de l'Ouest. Classé réserve de biosphère par l'UNESCO, la Pendjari est le refuge des derniers lions d'Afrique de l'Ouest, d'immenses troupeaux d'éléphants, d'hippopotames et de gazelles.",
    highlights: [
      "Safari 4x4 guidé au lever du soleil à la recherche des lions et léopards",
      "Observation rapprochée des éléphants aux marres de Bali et de Yangouali",
      "Baignade rafraîchissante aux cascades féeriques de Tanougou",
      "Nuit en lodge d'exception au cœur de la savane africaine"
    ],
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Soudano-guinéen, très sec en saison chaude (jusqu'à 35°C)",
    bestPeriod: "Décembre à Avril (Meilleure visibilité des animaux)",
    isInternational: false,
    isFeatured: true,
    latitude: 11.2333,
    longitude: 1.5500,
    startingPriceXOF: 180000,
    rating: 5.0,
    reviewsCount: 89
  },
  {
    id: "dest-abomey",
    slug: "abomey-palais-royaux",
    name: "Abomey",
    country: "Bénin",
    region: "Zou / Centre-Bénin",
    description: "Berceau du puissant Royaume du Dahomey. Abomey conserve le prestigieux complexe des Palais Royaux classés au patrimoine mondial de l'UNESCO, célèbres pour la légende de leurs impitoyables Amazones et leurs bas-reliefs historiques.",
    highlights: [
      "Visite guidée des Palais des Rois Ghezo et Glele",
      "Découverte de l'histoire héroïque des Amazones du Dahomey",
      "Ateliers d'artisans créateurs des tentures appliquées royales",
      "Dégustation des spécialités culinaires locales du Zou"
    ],
    images: [
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Tropical de savane, 25°C à 30°C",
    bestPeriod: "Novembre à Mars",
    isInternational: false,
    isFeatured: false,
    latitude: 7.1829,
    longitude: 1.9912,
    startingPriceXOF: 50000,
    rating: 4.7,
    reviewsCount: 115
  },
  {
    id: "dest-grand-popo",
    slug: "grand-popo-bouche-du-roy",
    name: "Grand-Popo",
    country: "Bénin",
    region: "Mono / Sud-Ouest Bénin",
    description: "Havre de paix coincé entre l'Océan Atlantique et le fleuve Mono. Grand-Popo séduit par ses plages sauvages bordées de cocotiers, ses villages de pêcheurs traditionnels et la réserve de biosphère de la Bouche du Roy.",
    highlights: [
      "Excursion en pirogue à moteur dans les mangroves de la Bouche du Roy",
      "Libération des bébés tortues marines dans l'océan avec l'association locale",
      "Nuit farniente en éco-lodge au bord de l'eau",
      "Spectacle des danses traditionnelles Zangbéto au crépuscule"
    ],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Brise marine agréable, 27°C",
    bestPeriod: "Toute l'année (Ponte des tortues d'Octobre à Février)",
    isInternational: false,
    isFeatured: true,
    latitude: 6.2803,
    longitude: 1.8258,
    startingPriceXOF: 40000,
    rating: 4.9,
    reviewsCount: 167
  },
  {
    id: "dest-natitingou-somba",
    slug: "natitingou-pays-somba",
    name: "Natitingou & Pays Somba",
    country: "Bénin",
    region: "Atacora / Nord-Bénin",
    description: "Au pied de la majestueuse chaîne de l'Atacora, découvrez le Pays Otammari célèbre pour ses 'Tata Somba', véritables châteaux-forts miniatures en terre cuite à deux étages bâtis pour résister aux invasions historiques.",
    highlights: [
      "Nuit immersive au sommet d'une authentique Tata Somba traditionnelle",
      "Randonnée panoramique à travers les cascades rafraîchissantes de Kota",
      "Rencontre chaleureuse avec le peuple Otammari et leurs coutumes",
      "Boutiques d'artisanat local et beurre de karité bio brut"
    ],
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Sec et chaud, brise fraîche des montagnes le soir",
    bestPeriod: "Novembre à Avril",
    isInternational: false,
    isFeatured: false,
    latitude: 10.3042,
    longitude: 1.3796,
    startingPriceXOF: 120000,
    rating: 4.9,
    reviewsCount: 94
  },
  {
    id: "dest-dassa",
    slug: "dassa-zoume-41-collines",
    name: "Dassa-Zoumè",
    country: "Bénin",
    region: "Collines / Centre-Bénin",
    description: "Entourée de 41 collines rocheuses aux formes mystérieuses, Dassa-Zoumè est un haut lieu de spiritualité et d'aventure pédestre au Bénin. Idéal pour les randonneurs, les pèlerins et les amoureux de panoramas saisissants.",
    highlights: [
      "Ascension guidée du mont Oké-Owa offrant une vue panoramique sur les collines",
      "Visite du sanctuaire marial de la Grotte Notre-Dame d'Arigbo",
      "Découverte des légendes des Rois de Dassa et du royaume d'Idatcha",
      "Randonnées nature à travers les forêts sacrées"
    ],
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Tropical modéré, 26°C",
    bestPeriod: "Novembre à Mars",
    isInternational: false,
    isFeatured: false,
    latitude: 7.7500,
    longitude: 2.1833,
    startingPriceXOF: 45000,
    rating: 4.6,
    reviewsCount: 76
  },
  {
    id: "dest-porto-novo",
    slug: "porto-novo-capitale-culturelle",
    name: "Porto-Novo",
    country: "Bénin",
    region: "Ouémé / Capitale politique",
    description: "Capitale administrative et joyau architectural du Bénin. Porto-Novo séduit par son ambiance paisible, son riche patrimoine de maisons de style afro-brésilien, le Palais Royal du Roi Toffa (Musée Honmé) et son jardin botanique.",
    highlights: [
      "Admiration de la Grande Mosquée à la devanture cathédrale baroque afro-brésilienne",
      "Visite historique du Musée Honmé (Palais du Roi Toffa)",
      "Musée Ethnographique Alexandre Adandé et ses masques Gèlèdé spectaculaires",
      "Promenade ombreuse dans le Jardin Botanique de Porto-Novo"
    ],
    images: [
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Tropical doucement régulé par le lac et la mer, 27°C",
    bestPeriod: "Toute l'année",
    isInternational: false,
    isFeatured: false,
    latitude: 6.4969,
    longitude: 2.6288,
    startingPriceXOF: 30000,
    rating: 4.7,
    reviewsCount: 108
  },
  {
    id: "dest-afrique-sud",
    slug: "le-cap-kruger-afrique-du-sud",
    name: "Le Cap & Kruger (Afrique du Sud)",
    country: "Afrique du Sud",
    region: "Afrique Australe",
    description: "Le voyage d'une vie entre cosmopolitisme vibrant et safari mythique. Du sommet de la Table Mountain aux vignobles d'altitude du Cap, jusqu'aux plaines sauvages du Parc Kruger à la rencontre des Big Five.",
    highlights: [
      "Safari Big Five dans le mythique Parc National Kruger",
      "Montée en téléphérique au sommet de Table Mountain au Cap",
      "Visite des manchots du Cap sur la plage de Boulders Beach",
      "Dégustation de vins dans la vallée de Stellenbosch"
    ],
    images: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Méditerranéen au Cap, subtropical au Kruger",
    bestPeriod: "Mai à Septembre (Safari) & Octobre à Mars (Le Cap)",
    isInternational: true,
    isFeatured: true,
    startingPriceXOF: 1450000,
    rating: 4.95,
    reviewsCount: 82
  },
  {
    id: "dest-ghana-accra",
    slug: "accra-cape-coast-ghana",
    name: "Accra & Cape Coast (Ghana)",
    country: "Ghana",
    region: "Afrique de l'Ouest",
    description: "Découvrez l'énergie électrisante d'Accra et l'histoire émouvante des châteaux de Cape Coast et d'Elmina, complétée par une marche palpitante sur les ponts suspendus du parc national de Kakum.",
    highlights: [
      "Marche suspendue au-dessus de la canopée du Parc National de Kakum",
      "Visite émouvante du Château de Cape Coast (Patrimoine mondial UNESCO)",
      "Exploration culturelle des ateliers de tisseurs de Kente à Kumasi",
      "Soirées afrobeat animées à Osu, Accra"
    ],
    images: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Tropical chaud, 28°C à 32°C",
    bestPeriod: "Novembre à Mars",
    isInternational: true,
    isFeatured: false,
    startingPriceXOF: 480000,
    rating: 4.8,
    reviewsCount: 65
  },
  {
    id: "dest-lac-aheme",
    slug: "lac-aheme-possotome",
    name: "Lac Ahémé & Possotomè",
    country: "Bénin",
    region: "Mono/Couffo / Sud-Ouest Bénin",
    description: "Deuxième plus grand lac du Bénin, entouré de villages de pêcheurs et de la source thermale sacrée de Possotomè. Un cadre paisible et verdoyant, parfait pour une parenthèse nature entre sortie en pirogue et bains reminéralisants.",
    highlights: [
      "Sortie en pirogue silencieuse au coucher du soleil sur le lac Ahémé",
      "Baignade et cure reminéralisante à la source thermale de Possotomè",
      "Rencontre avec les communautés de pêcheurs et démonstration de pêche traditionnelle",
      "Dégustation de la gastronomie lacustre locale (poisson fumé, ahouyo)"
    ],
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Tropical humide tempéré par le lac, 26°C à 29°C",
    bestPeriod: "Novembre à Mars (Saison sèche)",
    isInternational: false,
    isFeatured: true,
    latitude: 6.5500,
    longitude: 1.8833,
    startingPriceXOF: 30000,
    rating: 4.7,
    reviewsCount: 58
  },
  {
    id: "dest-cotonou",
    slug: "cotonou-capitale-economique",
    name: "Cotonou",
    country: "Bénin",
    region: "Littoral / Capitale économique",
    description: "Capitale économique trépidante du Bénin, Cotonou séduit par l'effervescence de son grand marché de Dantokpa, sa scène artistique contemporaine et son ambiance afrobeat qui anime les soirées jusqu'au bout de la nuit.",
    highlights: [
      "Immersion dans le tourbillon du marché de Dantokpa, l'un des plus grands d'Afrique de l'Ouest",
      "Visite de la Fondation Zinsou et de sa collection d'art contemporain africain",
      "Découverte de l'artisanat local au Centre de Promotion de l'Artisanat",
      "Soirées animées et musique afrobeat dans les quartiers de Fidjrossè et Haie Vive"
    ],
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Littoral tropical humide, 26°C à 31°C",
    bestPeriod: "Toute l'année",
    isInternational: false,
    isFeatured: false,
    latitude: 6.3703,
    longitude: 2.3912,
    startingPriceXOF: 15000,
    rating: 4.5,
    reviewsCount: 203
  },
  {
    id: "dest-nikki",
    slug: "nikki-fete-gaani",
    name: "Nikki",
    country: "Bénin",
    region: "Borgou / Nord-Est Bénin",
    description: "Cité royale du peuple Baatonu, Nikki est le cœur battant de l'identité du Nord-Bénin. Chaque année, la ville s'embrase pour le Gaani, grande fête traditionnelle rythmée par les parades équestres et les cérémonies de la Cour impériale.",
    highlights: [
      "Assister aux impressionnantes parades équestres de la fête du Gaani",
      "Rencontre protocolaire avec les dignitaires de la Cour impériale de Nikki",
      "Découverte de l'artisanat du cuir et des tissages Baatonu",
      "Immersion dans les rythmes des tambours royaux et danses traditionnelles"
    ],
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Soudanien sec, jusqu'à 34°C en journée",
    bestPeriod: "Fin Août (Fête traditionnelle du Gaani)",
    isInternational: false,
    isFeatured: false,
    latitude: 9.9401,
    longitude: 3.2108,
    startingPriceXOF: 90000,
    rating: 4.8,
    reviewsCount: 41
  },
  {
    id: "dest-togo-kpalime",
    slug: "kpalime-mont-agou-togo",
    name: "Kpalimè & Mont Agou (Togo)",
    country: "Togo",
    region: "Région des Plateaux",
    description: "À deux pas du Bénin, Kpalimè séduit par ses collines verdoyantes, ses plantations de café et de cacao, et l'ascension accessible du Mont Agou, point culminant du Togo. Une extension nature idéale depuis Lomé.",
    highlights: [
      "Randonnée jusqu'au sommet du Mont Agou (986m), plus haut sommet du Togo",
      "Visite d'une plantation de café et cacao artisanale avec dégustation",
      "Baignade aux cascades rafraîchissantes de Kpimè",
      "Shopping animé au grand marché des Nana-Benz à Lomé"
    ],
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Tempéré d'altitude, plus frais que la côte, 22°C à 28°C",
    bestPeriod: "Novembre à Avril",
    isInternational: true,
    isFeatured: true,
    startingPriceXOF: 200000,
    rating: 4.7,
    reviewsCount: 39
  },
  {
    id: "dest-cote-ivoire",
    slug: "abidjan-grand-bassam-cote-ivoire",
    name: "Abidjan & Grand-Bassam (Côte d'Ivoire)",
    country: "Côte d'Ivoire",
    region: "Afrique de l'Ouest",
    description: "Entre le dynamisme de la 'Perle des Lagunes' Abidjan et le charme colonial classé UNESCO de Grand-Bassam, découvrez une Côte d'Ivoire contrastée : gratte-ciels, basilique monumentale et plages bordées de cocotiers.",
    highlights: [
      "Panorama sur les gratte-ciels du Plateau depuis la lagune Ébrié",
      "Visite de la spectaculaire Basilique Notre-Dame de la Paix à Yamoussoukro",
      "Balade dans la ville coloniale classée UNESCO de Grand-Bassam",
      "Détente sur les plages de Grand-Bassam et découverte de l'art local"
    ],
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Équatorial humide, 25°C à 31°C",
    bestPeriod: "Novembre à Avril",
    isInternational: true,
    isFeatured: false,
    startingPriceXOF: 600000,
    rating: 4.6,
    reviewsCount: 33
  },
  {
    id: "dest-kenya-maasai-mara",
    slug: "maasai-mara-kenya",
    name: "Maasai Mara (Kenya)",
    country: "Kenya",
    region: "Afrique de l'Est",
    description: "Théâtre de la grande migration des gnous, la réserve du Maasai Mara offre l'une des expériences safari les plus spectaculaires au monde, prolongée par la rencontre authentique des communautés Maasaï.",
    highlights: [
      "Safari en 4x4 à la rencontre des Big Five dans la savane du Maasai Mara",
      "Observation de la Grande Migration des gnous (juillet à octobre)",
      "Visite culturelle d'un village Maasaï et de ses traditions ancestrales",
      "Survol optionnel en montgolfière au lever du soleil sur la réserve"
    ],
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Tropical de savane tempéré par l'altitude, 20°C à 27°C",
    bestPeriod: "Juillet à Octobre (Grande Migration)",
    isInternational: true,
    isFeatured: true,
    startingPriceXOF: 1250000,
    rating: 4.9,
    reviewsCount: 57
  },
  {
    id: "dest-maroc-marrakech",
    slug: "marrakech-desert-maroc",
    name: "Marrakech & Désert (Maroc)",
    country: "Maroc",
    region: "Afrique du Nord",
    description: "La ville rouge et ses souks envoûtants, la traversée de la vallée de l'Atlas et une nuit magique sous les étoiles du désert : le Maroc offre un dépaysement total entre culture impériale et immensités sahariennes.",
    highlights: [
      "Immersion dans les souks animés et les jardins secrets de la médina de Marrakech",
      "Traversée panoramique de la vallée de l'Atlas et ses cols vertigineux",
      "Nuit sous tente berbère dans le désert d'Agafay ou de Merzouga",
      "Balade à dos de dromadaire au coucher du soleil sur les dunes"
    ],
    images: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80"
    ],
    climate: "Semi-aride, chaud et sec, 20°C à 35°C selon saison",
    bestPeriod: "Mars à Mai et Septembre à Novembre",
    isInternational: true,
    isFeatured: true,
    startingPriceXOF: 980000,
    rating: 4.8,
    reviewsCount: 71
  }
];
