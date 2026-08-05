import { Circuit } from "@/types";

export const CIRCUITS: Circuit[] = [
  {
    id: "circ-sud-benin",
    slug: "circuit-culturel-historique-sud-benin",
    title: "Trésors du Sud-Bénin : Histoire, Vaudou & Cité Lacustre",
    destinationId: "dest-ouidah",
    destinationName: "Ouidah, Ganvié, Abomey & Porto-Novo",
    durationDays: 5,
    priceXOF: 245000,
    priceEUR: 375,
    theme: "Culture",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "Hébergement en hôtel 3* et éco-lodge de charme avec petit-déjeuner",
      "Transport privé climatisé avec chauffeur professionnel pendant tout le séjour",
      "Tous les frais d'entrée sur les sites culturels et musées historiques",
      "Balade exclusive en pirogue privée à la cité lacustre de Ganvié",
      "Guide certifié Nomad Tours bilingue (Français/Anglais)",
      "Eau minérale à volonté durant les trajets"
    ],
    excluded: [
      "Billets d'avion internationaux",
      "Frais de visa Bénin (e-Visa)",
      "Repas de midi et du soir (sauf mention spécifique)",
      "Dépenses personnelles et pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Cotonou & Embarquement vers la Venise de l'Afrique",
        description: "Accueil personnalisé à l'aéroport international de Cotonou par votre guide Nomad Tours. Transfert immédiat vers l'embarcadère d'Abomey-Calavi pour une pirogue privée à destination de Ganvié. Installation à l'hôtel sur pilotis au bord du lac Nokoué.",
        accommodation: "Hôtel Chez M (Ganvié - Cité lacustre)",
        meals: "Dîner de bienvenue incluant poisson frais du lac"
      },
      {
        day: 2,
        title: "Marché flottant de Ganvié & Immersion à Ouidah",
        description: "Reveil féerique au fil de l'eau. Visite du marché flottant matinal et observation des techniques de pêche ancestrale. Retour sur terre et route vers Ouidah, berceau du Vaudou. Visite du Temple des Pythons et de la Forêt Sacrée de Kpassè.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 3,
        title: "La Route des Esclaves & La Porte du Non-Retour",
        description: "Parcours mémorable des 4 km de la Route des Esclaves : l'Arbre de l'Oubli, l'Arbre du Retour, la Case de la Zoungbodji et recueillement face à la Porte du Non-Retour sur la plage Atlantique. Après-midi détente au bord de mer.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner"
      },
      {
        day: 4,
        title: "Palais Royaux d'Abomey & Légende des Amazones",
        description: "Départ matinal pour Abomey. Visite guidée approfondie des Palais Royaux d'Abomey classés au patrimoine mondial UNESCO. Découverte du musée, des trônes sculptés et de la fascinante histoire des guerrières Amazones du Dahomey.",
        accommodation: "Hôtel Sun City (Abomey)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 5,
        title: "Patrimoine Afro-Brésilien de Porto-Novo & Retour",
        description: "Route vers Porto-Novo, capitale du Bénin. Découverte de l'architecture afro-brésilienne, de la Grande Mosquée baroque et du Jardin Botanique. Transfert retour vers Cotonou ou l'aéroport pour votre vol international.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-pendjari-safari",
    slug: "grand-safari-pendjari-atacora",
    title: "Grand Safari Pendjari & Châteaux du Pays Somba",
    destinationId: "dest-pendjari",
    destinationName: "Parc de la Pendjari, Natitingou & Tanougou",
    durationDays: 7,
    priceXOF: 580000,
    priceEUR: 885,
    theme: "Safari",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "Véhicule Safari 4x4 spécialisé avec toit ouvrant pour prise de vue",
      "Chauffeur-pisteur et guide faunique expérimenté du parc",
      "Hébergement en pension complète (Lodge Pendjari & Hôtel Natitingou)",
      "Droits d'entrée dans le parc national et permis de safari photo",
      "Excursion et baignade aux cascades de Tanougou",
      "Nuitée immersive dans une authentique Tata Somba"
    ],
    excluded: [
      "Transport Cotonou-Natitingou (option vol intérieur disponible)",
      "Boissons alcoolisées et extras personnels",
      "Pourboires au ranger et au chauffeur"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Natitingou au pied de l'Atacora",
        description: "Accueil à Natitingou. Installation à l'hôtel, briefing sur le déroulement du safari et dégustation du jus de néré local.",
        accommodation: "Hôtel Tata Somba (Natitingou)",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Immersion chez les Otammari & Nuit en Tata Somba",
        description: "Exploration des vallées de la Boukoumbé et découverte des 'Tata Somba'. Rencontre avec les chefs traditionnels et nuit sous les étoiles sur la terrasse de la Tata.",
        accommodation: "Nuitée en Tata Somba traditionnelle",
        meals: "Pension complète"
      },
      {
        day: 3,
        title: "Entrée dans la Réserve de Biosphère de la Pendjari",
        description: "Traversée de la porte de Batia et premier safari photo de l'après-midi. Arrivée au lodge au cœur de la savane.",
        accommodation: "Pendjari Safari Lodge",
        meals: "Pension complète"
      },
      {
        day: 4,
        title: "Safari Matinal Lions & Éléphants",
        description: "Départ à l'aube (5h30) vers la mare de Bali pour surprendre les lions de l'Afrique de l'Ouest et les grands troupeaux d'éléphants s'abreuvant.",
        accommodation: "Pendjari Safari Lodge",
        meals: "Pension complète"
      },
      {
        day: 5,
        title: "Safari Mare de Yangouali & Baignade Tanougou",
        description: "Exploration des hippopotames et antilopes aux abords des mares. En fin d'après-midi, sortie du parc et baignade magique aux cascades naturelles de Tanougou.",
        accommodation: "Hôtel de la Cascade (Tanougou)",
        meals: "Pension complète"
      },
      {
        day: 6,
        title: "Retour sur Natitingou & Artisanat local",
        description: "Retour tranquille vers Natitingou. Visite du Musée Régional de la Koutammakou et des coopératives de beurre de karité bio.",
        accommodation: "Hôtel Tata Somba (Natitingou)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 7,
        title: "Clôture du Safari & Fin des prestations",
        description: "Petit-déjeuner et transfert vers la gare routière ou l'aérodrome pour votre retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-escapade-grand-popo",
    slug: "escapade-lagunaire-ganvie-grand-popo",
    title: "Escapade Marine : Mangroves & Bouche du Roy",
    destinationId: "dest-grand-popo",
    destinationName: "Grand-Popo & Lac Ahémé",
    durationDays: 3,
    priceXOF: 135000,
    priceEUR: 205,
    theme: "Plage",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "2 nuits en bungalow vue océan avec petit-déjeuner",
      "Excursion privée en bateau sur le fleuve Mono vers l'estuaire de la Bouche du Roy",
      "Visite guidée du sanctuaire marin des tortues de mer",
      "Dégustation de crevettes grillées et coco frais"
    ],
    excluded: [
      "Dépenses à caractère personnel",
      "Transports non mentionnés"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Grand-Popo & Apéro Coucher de Soleil",
        description: "Installation dans votre éco-lodge au bord des vagues. Après-midi détente sur la plage de sable blond et cocktail aux fruits tropicaux au coucher de soleil.",
        accommodation: "Auberge de Grand-Popo",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Pirogue dans la Mangrove & Bouche du Roy",
        description: "Navigation paisible le long du fleuve Mono. Rencontre avec les femmes productrices de sel traditionnel et arrivée au lieu magique où le fleuve rejoint l'océan Atlantique.",
        accommodation: "Auberge de Grand-Popo",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 3,
        title: "Sanctuaire des Tortues & Retour",
        description: "Matinée consacrée au projet de conservation des tortues marines. Retour sur Cotonou l'esprit apaisé.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  }
];
