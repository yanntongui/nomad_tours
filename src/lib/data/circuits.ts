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
  },
  {
    id: "circ-escapade-ganvie-ouidah",
    slug: "escapade-ganvie-ouidah",
    title: "Escapade Ganvié-Ouidah",
    destinationId: "dest-ganvie",
    destinationName: "Ganvié & Ouidah",
    durationDays: 2,
    priceXOF: 45000,
    priceEUR: 70,
    theme: "Culture",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "Transport climatisé aller-retour depuis Cotonou",
      "Balade en pirogue au marché flottant de Ganvié",
      "Entrées sur les sites de la Route des Esclaves et de la Porte du Non-Retour",
      "Guide local francophone",
      "1 nuit en hôtel confort à Ouidah avec petit-déjeuner"
    ],
    excluded: [
      "Repas de midi et du soir",
      "Dépenses personnelles",
      "Pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Réveil sur l'eau à Ganvié",
        description: "Départ matinal de Cotonou vers l'embarcadère d'Abomey-Calavi. Embarquement en pirogue pour Ganvié, découverte du marché flottant et des maisons sur pilotis du peuple Tofinu. Retour sur terre en fin de matinée et transfert vers Ouidah.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner"
      },
      {
        day: 2,
        title: "Mémoire de Ouidah & Retour",
        description: "Marche sur la Route des Esclaves jusqu'à la Porte du Non-Retour, visite du Temple des Pythons sacrés et de la Forêt Sacrée de Kpassè. Déjeuner libre en bord de plage puis retour vers Cotonou en fin d'après-midi.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-lac-aheme-possotome",
    slug: "lac-aheme-sources-possotome",
    title: "Lac Ahémé & Sources de Possotomè",
    destinationId: "dest-lac-aheme",
    destinationName: "Lac Ahémé & Possotomè",
    durationDays: 3,
    priceXOF: 75000,
    priceEUR: 115,
    theme: "Plage",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "2 nuits en éco-lodge au bord du lac avec petit-déjeuner",
      "Sortie en pirogue sur le lac Ahémé au coucher du soleil",
      "Accès et bain à la source thermale sacrée de Possotomè",
      "Un déjeuner de spécialités lacustres",
      "Transport climatisé depuis Cotonou"
    ],
    excluded: [
      "Repas non mentionnés",
      "Dépenses personnelles et pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée au bord du lac Ahémé",
        description: "Départ de Cotonou en fin de matinée, route vers le lac Ahémé. Installation en éco-lodge et première sortie en pirogue pour observer les techniques de pêche traditionnelle au coucher du soleil.",
        accommodation: "Éco-lodge du Lac Ahémé",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Source thermale de Possotomè & villages de pêcheurs",
        description: "Matinée consacrée à la source thermale sacrée de Possotomè : bain reminéralisant et rencontre avec les gardiens du site. Après-midi de visite des villages de pêcheurs riverains et dégustation de poisson fumé.",
        accommodation: "Éco-lodge du Lac Ahémé",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 3,
        title: "Matinée libre & retour",
        description: "Matinée détente au bord de l'eau ou baignade optionnelle. Départ en début d'après-midi pour Cotonou.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-immersion-atacora-somba",
    slug: "immersion-atacora-pays-somba",
    title: "Immersion Atacora & Pays Somba",
    destinationId: "dest-natitingou-somba",
    destinationName: "Natitingou & Pays Somba",
    durationDays: 4,
    priceXOF: 120000,
    priceEUR: 185,
    theme: "Aventure",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "Transport climatisé Cotonou-Natitingou aller-retour",
      "3 nuits en hôtel et nuitée en Tata Somba",
      "Randonnée guidée aux cascades de Kota",
      "Visite des villages Tata Somba avec guide local",
      "Mini-safari optionnel au Parc de la Pendjari (supplément)"
    ],
    excluded: [
      "Entrée et safari Pendjari (en option)",
      "Boissons et dépenses personnelles",
      "Pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Route vers l'Atacora",
        description: "Départ matinal de Cotonou vers Natitingou. Installation à l'hôtel, briefing sur le séjour et découverte du centre-ville en fin de journée.",
        accommodation: "Hôtel Tata Somba (Natitingou)",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Cascades de Kota & artisanat local",
        description: "Randonnée matinale aux cascades de Kota, baignade rafraîchissante. Après-midi de visite des ateliers d'artisans et coopératives de karité.",
        accommodation: "Hôtel Tata Somba (Natitingou)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 3,
        title: "Nuit chez les Otammari",
        description: "Départ pour les vallées de Boukoumbé, visite approfondie des Tata Somba et rencontre avec les familles Otammari. Nuit insolite sur la terrasse d'une Tata traditionnelle (mini-safari Pendjari en option ce jour pour les groupes intéressés).",
        accommodation: "Nuitée en Tata Somba traditionnelle",
        meals: "Pension complète"
      },
      {
        day: 4,
        title: "Retour vers Cotonou",
        description: "Petit-déjeuner puis départ en matinée pour le retour vers Cotonou, arrivée en fin d'après-midi.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-cotonou-decouverte",
    slug: "cotonou-decouverte",
    title: "Cotonou Découverte",
    destinationId: "dest-cotonou",
    destinationName: "Cotonou",
    durationDays: 1,
    priceXOF: 20000,
    priceEUR: 30,
    theme: "Culture",
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "Transport climatisé toute la journée",
      "Guide local francophone",
      "Entrées à la Fondation Zinsou et au Centre de Promotion de l'Artisanat",
      "Bouteille d'eau"
    ],
    excluded: [
      "Repas",
      "Achats personnels au marché de Dantokpa",
      "Pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Tourbillon de Cotonou",
        description: "Prise en charge le matin, visite du grand marché de Dantokpa et de son ambiance électrique. Passage à la Fondation Zinsou pour un aperçu de l'art contemporain africain, puis au Centre de Promotion de l'Artisanat pour du shopping éthique. Fin de journée libre en bord de plage.",
        accommodation: "Sans hébergement (excursion à la journée)",
        meals: "Non inclus"
      }
    ]
  },
  {
    id: "circ-couleurs-sud-benin",
    slug: "couleurs-du-sud-benin",
    title: "Couleurs du Sud Bénin",
    destinationId: "dest-ouidah",
    destinationName: "Cotonou, Ganvié, Abomey, Possotomè, Grand-Popo & Ouidah",
    durationDays: 8,
    priceXOF: 950000,
    priceEUR: 1450,
    theme: "Culture",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "7 nuits en hôtels 3* et éco-lodges de charme avec petit-déjeuner",
      "Transport privé climatisé avec chauffeur pendant tout le circuit",
      "Toutes les entrées sur les sites visités",
      "Balade en pirogue privée à Ganvié et sur le lac Ahémé",
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
        title: "Arrivée à Cotonou",
        description: "Accueil à l'aéroport de Cotonou, transfert à l'hôtel et briefing sur le circuit. Dîner de bienvenue et présentation de l'équipe Nomad Tours.",
        accommodation: "Hôtel à Cotonou",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Cotonou & embarquement pour Ganvié",
        description: "Matinée de découverte du marché de Dantokpa et de la Fondation Zinsou. Départ en début d'après-midi vers l'embarcadère d'Abomey-Calavi et pirogue privée vers Ganvié.",
        accommodation: "Hôtel Chez M (Ganvié)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 3,
        title: "Marché flottant & route pour Abomey",
        description: "Réveil au fil de l'eau et visite du marché flottant de Ganvié. Retour sur terre et route vers Abomey, berceau du Royaume du Dahomey.",
        accommodation: "Hôtel Sun City (Abomey)",
        meals: "Petit-déjeuner"
      },
      {
        day: 4,
        title: "Palais Royaux d'Abomey",
        description: "Visite guidée approfondie des Palais Royaux classés UNESCO, découverte de l'histoire des Amazones du Dahomey et des ateliers de tentures appliquées.",
        accommodation: "Hôtel Sun City (Abomey)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 5,
        title: "Source de Possotomè & lac Ahémé",
        description: "Route vers Possotomè pour une baignade à la source thermale sacrée, puis sortie en pirogue sur le lac Ahémé au coucher du soleil.",
        accommodation: "Éco-lodge du Lac Ahémé",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 6,
        title: "Escapade à Grand-Popo",
        description: "Départ vers Grand-Popo, installation en éco-lodge en bord d'océan et après-midi détente sur la plage.",
        accommodation: "Auberge de Grand-Popo",
        meals: "Petit-déjeuner"
      },
      {
        day: 7,
        title: "Ouidah, Route des Esclaves & Porte du Non-Retour",
        description: "Route vers Ouidah, visite du Temple des Pythons et marche sur la Route des Esclaves jusqu'à la Porte du Non-Retour, moment de recueillement face à l'océan.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 8,
        title: "Forêt Sacrée de Kpassè & retour",
        description: "Visite matinale de la Forêt Sacrée de Kpassè, puis transfert vers l'aéroport de Cotonou pour le vol retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-safari-traditions-nord",
    slug: "safari-traditions-du-nord",
    title: "Safari & Traditions du Nord",
    destinationId: "dest-pendjari",
    destinationName: "Natitingou, Parc de la Pendjari & Koussoukoingou",
    durationDays: 10,
    priceXOF: 1100000,
    priceEUR: 1680,
    theme: "Safari",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "9 nuits en hôtels, lodge de safari et nuitée en Tata Somba",
      "Véhicule 4x4 spécialisé avec chauffeur-pisteur pour le safari",
      "Droits d'entrée et permis de safari photo dans le Parc de la Pendjari",
      "Excursions aux cascades de Tanongou et à Koussoukoingou",
      "Guide certifié Nomad Tours bilingue (Français/Anglais)",
      "Pension complète durant le séjour au lodge"
    ],
    excluded: [
      "Transport Cotonou-Natitingou (vol intérieur en option)",
      "Boissons alcoolisées et extras personnels",
      "Pourboires au ranger et au chauffeur"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Natitingou",
        description: "Accueil à Natitingou, installation à l'hôtel et briefing sur les dix jours de circuit. Dîner de bienvenue.",
        accommodation: "Hôtel Tata Somba (Natitingou)",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Cascades de Tanongou",
        description: "Route vers Tanongou pour une randonnée et baignade aux chutes d'eau naturelles nichées dans la falaise de l'Atacora.",
        accommodation: "Hôtel de la Cascade (Tanongou)",
        meals: "Pension complète"
      },
      {
        day: 3,
        title: "Koussoukoingou & Pays Somba",
        description: "Découverte du village emblématique de Koussoukoingou et de ses Tata Somba perchées, rencontre avec les chefs traditionnels Otammari.",
        accommodation: "Hôtel Tata Somba (Natitingou)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 4,
        title: "Entrée dans la réserve de la Pendjari",
        description: "Traversée de la porte de Batia et premier safari photo de l'après-midi jusqu'au lodge au cœur de la savane.",
        accommodation: "Pendjari Safari Lodge",
        meals: "Pension complète"
      },
      {
        day: 5,
        title: "Safari matinal — Lions & Éléphants",
        description: "Départ à l'aube vers la mare de Bali pour observer les lions de l'Afrique de l'Ouest et les grands troupeaux d'éléphants.",
        accommodation: "Pendjari Safari Lodge",
        meals: "Pension complète"
      },
      {
        day: 6,
        title: "Safari — Mare de Yangouali",
        description: "Journée complète de safari autour des mares de Yangouali, observation des hippopotames, antilopes et buffles.",
        accommodation: "Pendjari Safari Lodge",
        meals: "Pension complète"
      },
      {
        day: 7,
        title: "Dernier safari & piste des félins",
        description: "Safari matinal axé sur la recherche des léopards et guépards, puis départ progressif du parc en fin de journée.",
        accommodation: "Pendjari Safari Lodge",
        meals: "Pension complète"
      },
      {
        day: 8,
        title: "Retour vers Natitingou & artisanat",
        description: "Sortie du parc, visite du Musée Régional de la Koutammakou et des coopératives de beurre de karité.",
        accommodation: "Hôtel Tata Somba (Natitingou)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 9,
        title: "Journée libre & marché local",
        description: "Journée libre pour flâner au marché de Natitingou ou profiter d'une activité optionnelle (VTT, randonnée courte).",
        accommodation: "Hôtel Tata Somba (Natitingou)",
        meals: "Petit-déjeuner"
      },
      {
        day: 10,
        title: "Clôture du safari",
        description: "Petit-déjeuner et transfert vers la gare routière ou l'aérodrome pour votre retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-racines-memoire",
    slug: "racines-et-memoire",
    title: "Racines & Mémoire",
    destinationId: "dest-ouidah",
    destinationName: "Ouidah & Sud-Bénin",
    durationDays: 8,
    priceXOF: 1000000,
    priceEUR: 1525,
    theme: "Culture",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "7 nuits en hôtels de charme avec petit-déjeuner",
      "Transport privé climatisé avec chauffeur pendant tout le séjour",
      "Cérémonie vaudou d'accueil et rencontre avec des chefs traditionnels",
      "Marche guidée complète de la Route des Esclaves",
      "Guide spécialisé mémoire et diaspora, bilingue Français/Anglais",
      "Cérémonie de recueillement à la Porte du Non-Retour"
    ],
    excluded: [
      "Billets d'avion internationaux",
      "Frais de visa Bénin (e-Visa)",
      "Repas de midi et du soir (sauf mention spécifique)",
      "Offrandes personnelles lors des cérémonies (en option)"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée & accueil cérémoniel",
        description: "Accueil à l'aéroport de Cotonou, transfert à Ouidah. Cérémonie d'accueil traditionnelle en soirée pour ouvrir symboliquement le voyage.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Temple des Pythons & Forêt Sacrée",
        description: "Visite du Temple des Pythons sacrés et de la Forêt Sacrée de Kpassè, initiation aux fondements de la spiritualité vaudou avec un guide initié.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner"
      },
      {
        day: 3,
        title: "La Route des Esclaves",
        description: "Marche mémorielle complète des 4 km de la Route des Esclaves : Arbre de l'Oubli, Case de Zoungbodji, jusqu'à la Porte du Non-Retour. Temps de recueillement libre face à l'Atlantique.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 4,
        title: "Rencontre avec les chefs traditionnels",
        description: "Audience avec des chefs coutumiers et prêtres vaudou de la région pour échanger sur l'histoire, la spiritualité et les liens avec la diaspora afro-descendante.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner"
      },
      {
        day: 5,
        title: "Musée d'Histoire de Ouidah",
        description: "Visite approfondie du Musée d'Histoire de Ouidah installé dans l'ancien Fort Portugais, retraçant les routes de la traite transatlantique.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 6,
        title: "Abomey & légende des Amazones",
        description: "Route vers Abomey, visite des Palais Royaux classés UNESCO et découverte de l'histoire des Amazones du Dahomey.",
        accommodation: "Hôtel Sun City (Abomey)",
        meals: "Petit-déjeuner"
      },
      {
        day: 7,
        title: "Porto-Novo & patrimoine afro-brésilien",
        description: "Découverte de Porto-Novo, de son architecture afro-brésilienne et du Musée Honmé, témoin des allers-retours historiques entre le Bénin et le Brésil.",
        accommodation: "Hôtel à Cotonou",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 8,
        title: "Cérémonie de clôture & retour",
        description: "Cérémonie symbolique de clôture du voyage en petit comité, puis transfert vers l'aéroport pour le vol retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-vodun-days",
    slug: "vodun-days-experience",
    title: "Vodun Days Experience",
    destinationId: "dest-ouidah",
    destinationName: "Ouidah",
    durationDays: 4,
    priceXOF: 165000,
    priceEUR: 250,
    theme: "Événement",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "3 nuits en hôtel à Ouidah (réservation anticipée garantie)",
      "Accès aux cérémonies et à l'arène officielle du festival Vodun Days",
      "Guide culturel spécialisé vaudou pendant tout le séjour",
      "Transport climatisé Cotonou-Ouidah aller-retour",
      "Petit-déjeuner quotidien"
    ],
    excluded: [
      "Billets d'avion internationaux",
      "Repas de midi et du soir",
      "Offrandes et dépenses lors des cérémonies"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Ouidah",
        description: "Transfert depuis Cotonou vers Ouidah, installation à l'hôtel. Découverte du programme des festivités et première soirée de concerts en centre-ville.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Jour officiel du Vodun Days — 8 janvier",
        description: "Journée complète dédiée aux cérémonies officielles du festival : défilés, offrandes rituelles et rassemblement sur la plage de Ouidah.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner"
      },
      {
        day: 3,
        title: "Arène & concerts",
        description: "Accès à l'arène des festivités pour assister aux danses rituelles et percussions sacrées, suivi des concerts en soirée dans le centre culturel de Ouidah.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner"
      },
      {
        day: 4,
        title: "Clôture & retour",
        description: "Matinée libre pour profiter de la plage ou du marché artisanal, puis retour vers Cotonou en début d'après-midi.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-finab-cotonou",
    slug: "finab-semaine-des-arts-cotonou",
    title: "FInAB — Semaine des Arts de Cotonou",
    destinationId: "dest-cotonou",
    destinationName: "Cotonou, Ouidah & Porto-Novo",
    durationDays: 5,
    priceXOF: 195000,
    priceEUR: 300,
    theme: "Événement",
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "4 nuits en hôtel à Cotonou avec petit-déjeuner",
      "Accès aux spectacles et expositions du Festival International des Arts de Cotonou",
      "Excursions d'une journée à Ouidah et Porto-Novo",
      "Transport climatisé pendant tout le séjour",
      "Guide culturel francophone"
    ],
    excluded: [
      "Billets d'avion internationaux",
      "Repas de midi et du soir",
      "Billetterie de certains spectacles premium (en option)"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée & ouverture du festival",
        description: "Accueil à Cotonou, installation à l'hôtel et soirée d'ouverture du festival avec spectacles de musique et de danse.",
        accommodation: "Hôtel à Cotonou",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Arts visuels & mode",
        description: "Journée consacrée aux expositions d'arts visuels et aux défilés de mode contemporaine africaine dans les espaces culturels de Cotonou.",
        accommodation: "Hôtel à Cotonou",
        meals: "Petit-déjeuner"
      },
      {
        day: 3,
        title: "Excursion à Ouidah",
        description: "Journée d'excursion à Ouidah : Route des Esclaves, Temple des Pythons, retour à Cotonou en soirée pour un spectacle de théâtre.",
        accommodation: "Hôtel à Cotonou",
        meals: "Petit-déjeuner"
      },
      {
        day: 4,
        title: "Excursion à Porto-Novo",
        description: "Découverte du patrimoine afro-brésilien de Porto-Novo, puis retour à Cotonou pour la soirée de clôture du festival.",
        accommodation: "Hôtel à Cotonou",
        meals: "Petit-déjeuner"
      },
      {
        day: 5,
        title: "Retour",
        description: "Matinée libre, transfert vers l'aéroport de Cotonou pour le vol retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-gaani-nikki",
    slug: "gaani-nikki-experience",
    title: "Gaani Nikki Experience",
    destinationId: "dest-nikki",
    destinationName: "Nikki",
    durationDays: 4,
    priceXOF: 140000,
    priceEUR: 215,
    theme: "Événement",
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "3 nuits en hôtel à Nikki ou Parakou",
      "Accès privilégié aux parades équestres et cérémonies royales du Gaani",
      "Transport climatisé Cotonou-Nikki aller-retour",
      "Guide culturel spécialisé traditions Baatonu",
      "Petit-déjeuner quotidien"
    ],
    excluded: [
      "Repas de midi et du soir",
      "Extension optionnelle au Parc de la Pendjari",
      "Dépenses personnelles et pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Route vers Nikki",
        description: "Long transfert depuis Cotonou vers Nikki avec pause déjeuner à Parakou. Installation à l'hôtel et présentation du déroulé de la fête du Gaani.",
        accommodation: "Hôtel à Nikki",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Ouverture des festivités",
        description: "Journée d'ouverture du Gaani : premières parades équestres et cérémonies protocolaires à la Cour impériale.",
        accommodation: "Hôtel à Nikki",
        meals: "Petit-déjeuner"
      },
      {
        day: 3,
        title: "Jour fort du Gaani",
        description: "Journée principale des festivités avec les grandes parades équestres, danses traditionnelles et rassemblement de la Cour impériale de Nikki.",
        accommodation: "Hôtel à Nikki",
        meals: "Petit-déjeuner"
      },
      {
        day: 4,
        title: "Retour vers Cotonou",
        description: "Départ matinal de Nikki, retour vers Cotonou avec arrivée en fin de journée (combinable avec une extension Parc de la Pendjari).",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-noel-lac-nokoue",
    slug: "nuit-de-noel-lac-nokoue",
    title: "Nuit de Noël sur le Lac Nokoué",
    destinationId: "dest-ganvie",
    destinationName: "Ganvié & Lac Nokoué",
    durationDays: 2,
    priceXOF: 65000,
    priceEUR: 100,
    theme: "Événement",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "1 nuit en hôtel sur pilotis à Ganvié avec petit-déjeuner",
      "Croisière en pirogues illuminées le soir du réveillon",
      "Dîner de réveillon avec chants traditionnels",
      "Transport climatisé Cotonou-Ganvié aller-retour",
      "Guide local francophone"
    ],
    excluded: [
      "Boissons non incluses au dîner",
      "Dépenses personnelles",
      "Pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Réveillon en pirogues illuminées",
        description: "Départ de Cotonou en fin d'après-midi le 24 décembre, embarquement vers Ganvié à la tombée de la nuit pour une croisière féerique en pirogues illuminées sur le lac Nokoué, rythmée par les chants traditionnels. Dîner de réveillon au bord de l'eau.",
        accommodation: "Hôtel Chez M (Ganvié)",
        meals: "Dîner de réveillon"
      },
      {
        day: 2,
        title: "Jour de Noël au fil de l'eau",
        description: "Réveil paisible sur le lac, visite du marché flottant matinal et brunch de Noël avant le retour vers Cotonou en début d'après-midi.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-togo-express",
    slug: "togo-express-kpalime-mont-agou",
    title: "Togo Express — Kpalimè & Mont Agou",
    destinationId: "dest-togo-kpalime",
    destinationName: "Kpalimè & Mont Agou (Togo)",
    durationDays: 4,
    priceXOF: 280000,
    priceEUR: 430,
    theme: "Aventure",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "3 nuits en hôtel de charme (Lomé et Kpalimè) avec petit-déjeuner",
      "Transport climatisé Cotonou-Togo aller-retour",
      "Randonnée guidée au Mont Agou",
      "Visite d'une plantation de café/cacao avec dégustation",
      "Formalités de passage frontalier facilitées"
    ],
    excluded: [
      "Frais de visa Togo (si applicable selon nationalité)",
      "Repas de midi et du soir",
      "Dépenses personnelles et pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Cotonou → Lomé",
        description: "Départ matinal de Cotonou, passage de la frontière et arrivée à Lomé. Découverte du grand marché des Nana-Benz et de l'ambiance de la capitale togolaise.",
        accommodation: "Hôtel à Lomé",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Route pour Kpalimè & cascades de Kpimè",
        description: "Départ pour Kpalimè à travers les collines verdoyantes de la région des Plateaux. Baignade aux cascades de Kpimè en fin de matinée.",
        accommodation: "Hôtel à Kpalimè",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 3,
        title: "Ascension du Mont Agou",
        description: "Randonnée guidée jusqu'au sommet du Mont Agou (986m), point culminant du Togo, vue panoramique sur la frontière ghanéenne. Visite d'une plantation de café et cacao en après-midi.",
        accommodation: "Hôtel à Kpalimè",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 4,
        title: "Retour vers Cotonou",
        description: "Départ matinal de Kpalimè, retour vers Lomé puis passage de la frontière vers Cotonou.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-benin-togo-sans-frontiere",
    slug: "benin-togo-sans-frontiere",
    title: "Bénin-Togo Sans Frontière",
    destinationId: "dest-togo-kpalime",
    destinationName: "Sud-Bénin & Togo",
    durationDays: 10,
    priceXOF: 1150000,
    priceEUR: 1755,
    theme: "Culture",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "9 nuits en hôtels et éco-lodges de charme avec petit-déjeuner",
      "Transport privé climatisé avec chauffeur pour tout le circuit",
      "Toutes les entrées sur les sites visités dans les deux pays",
      "Randonnée guidée au Mont Agou",
      "Guide certifié Nomad Tours bilingue (Français/Anglais)",
      "Passage de frontière facilité"
    ],
    excluded: [
      "Billets d'avion internationaux",
      "Frais de visa Bénin et Togo (si applicable)",
      "Repas de midi et du soir (sauf mention spécifique)",
      "Dépenses personnelles et pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Cotonou & Ganvié",
        description: "Accueil à l'aéroport de Cotonou, transfert et embarquement en pirogue vers Ganvié.",
        accommodation: "Hôtel Chez M (Ganvié)",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Marché flottant & Ouidah",
        description: "Visite du marché flottant de Ganvié puis route vers Ouidah, découverte du Temple des Pythons.",
        accommodation: "Hôtel Le Jardin Brésilien (Ouidah)",
        meals: "Petit-déjeuner"
      },
      {
        day: 3,
        title: "Route des Esclaves & Grand-Popo",
        description: "Marche mémorielle sur la Route des Esclaves jusqu'à la Porte du Non-Retour, puis départ pour Grand-Popo en fin de journée.",
        accommodation: "Auberge de Grand-Popo",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 4,
        title: "Détente à Grand-Popo & passage au Togo",
        description: "Matinée détente sur la plage de Grand-Popo, puis passage de la frontière togolaise et arrivée à Lomé.",
        accommodation: "Hôtel à Lomé",
        meals: "Petit-déjeuner"
      },
      {
        day: 5,
        title: "Lomé & marché des Nana-Benz",
        description: "Découverte de Lomé, de son marché des Nana-Benz et de son front de mer animé.",
        accommodation: "Hôtel à Lomé",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 6,
        title: "Route pour Kpalimè",
        description: "Départ pour Kpalimè à travers les collines de la région des Plateaux, visite d'une plantation de café et cacao.",
        accommodation: "Hôtel à Kpalimè",
        meals: "Petit-déjeuner"
      },
      {
        day: 7,
        title: "Ascension du Mont Agou",
        description: "Randonnée guidée jusqu'au sommet du Mont Agou et baignade aux cascades de Kpimè.",
        accommodation: "Hôtel à Kpalimè",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 8,
        title: "Retour au Bénin & Abomey",
        description: "Passage de la frontière retour vers le Bénin, route vers Abomey pour la visite des Palais Royaux UNESCO.",
        accommodation: "Hôtel Sun City (Abomey)",
        meals: "Petit-déjeuner"
      },
      {
        day: 9,
        title: "Porto-Novo & retour à Cotonou",
        description: "Découverte du patrimoine afro-brésilien de Porto-Novo, puis retour à Cotonou.",
        accommodation: "Hôtel à Cotonou",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 10,
        title: "Départ",
        description: "Matinée libre, transfert vers l'aéroport de Cotonou pour le vol retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-ghana-memoire",
    slug: "ghana-sur-les-traces-de-la-memoire",
    title: "Ghana — Sur les traces de la mémoire",
    destinationId: "dest-ghana-accra",
    destinationName: "Accra & Cape Coast (Ghana)",
    durationDays: 7,
    priceXOF: 900000,
    priceEUR: 1375,
    theme: "Culture",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "6 nuits en hôtels de charme (Accra, Cape Coast) avec petit-déjeuner",
      "Transport privé climatisé avec chauffeur pendant tout le circuit",
      "Entrées au Château de Cape Coast, à Elmina et au Parc de Kakum",
      "Marche suspendue sur les ponts de la canopée de Kakum",
      "Guide certifié bilingue (Français/Anglais)"
    ],
    excluded: [
      "Billets d'avion internationaux",
      "Frais de visa Ghana",
      "Repas de midi et du soir (sauf mention spécifique)",
      "Dépenses personnelles et pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Accra",
        description: "Accueil à l'aéroport d'Accra, transfert à l'hôtel et découverte du quartier animé d'Osu en soirée.",
        accommodation: "Hôtel à Accra",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Accra, mémoire et modernité",
        description: "Visite du Mausolée Kwame Nkrumah et des marchés artisanaux d'Accra, aperçu de l'effervescence culturelle de la capitale ghanéenne.",
        accommodation: "Hôtel à Accra",
        meals: "Petit-déjeuner"
      },
      {
        day: 3,
        title: "Route pour Cape Coast",
        description: "Départ vers Cape Coast le long de la côte, installation à l'hôtel en bord de mer.",
        accommodation: "Hôtel à Cape Coast",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 4,
        title: "Château de Cape Coast — Mémoire de la traite",
        description: "Visite guidée et émouvante du Château de Cape Coast, classé au patrimoine mondial UNESCO, ancien comptoir de la traite négrière.",
        accommodation: "Hôtel à Cape Coast",
        meals: "Petit-déjeuner"
      },
      {
        day: 5,
        title: "Château d'Elmina & canopée de Kakum",
        description: "Matinée au Château d'Elmina, plus ancien édifice colonial d'Afrique subsaharienne. Après-midi de marche suspendue au-dessus de la canopée du Parc National de Kakum.",
        accommodation: "Hôtel à Cape Coast",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 6,
        title: "Retour à Accra",
        description: "Route retour vers Accra avec arrêt dans un village de pêcheurs traditionnel, soirée libre.",
        accommodation: "Hôtel à Accra",
        meals: "Petit-déjeuner"
      },
      {
        day: 7,
        title: "Départ",
        description: "Matinée libre, transfert vers l'aéroport d'Accra pour le vol retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-cote-ivoire-abidjan-bassam",
    slug: "cote-ivoire-abidjan-grand-bassam",
    title: "Côte d'Ivoire — Abidjan & Grand-Bassam",
    destinationId: "dest-cote-ivoire",
    destinationName: "Abidjan & Grand-Bassam (Côte d'Ivoire)",
    durationDays: 6,
    priceXOF: 850000,
    priceEUR: 1300,
    theme: "Culture",
    isFeatured: false,
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "5 nuits en hôtels de charme (Abidjan, Yamoussoukro, Grand-Bassam) avec petit-déjeuner",
      "Transport privé climatisé avec chauffeur pendant tout le circuit",
      "Entrée à la Basilique Notre-Dame de la Paix de Yamoussoukro",
      "Visite guidée de la ville historique de Grand-Bassam classée UNESCO",
      "Guide certifié bilingue (Français/Anglais)"
    ],
    excluded: [
      "Billets d'avion internationaux",
      "Frais de visa Côte d'Ivoire",
      "Repas de midi et du soir (sauf mention spécifique)",
      "Dépenses personnelles et pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Abidjan",
        description: "Accueil à l'aéroport d'Abidjan, transfert à l'hôtel et balade en soirée sur les rives de la lagune Ébrié.",
        accommodation: "Hôtel à Abidjan",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Abidjan, la Perle des Lagunes",
        description: "Découverte du Plateau et de ses gratte-ciels, du marché de Cocody et de la cathédrale Saint-Paul.",
        accommodation: "Hôtel à Abidjan",
        meals: "Petit-déjeuner"
      },
      {
        day: 3,
        title: "Route pour Yamoussoukro",
        description: "Départ pour Yamoussoukro, visite de la spectaculaire Basilique Notre-Dame de la Paix, l'une des plus grandes églises au monde.",
        accommodation: "Hôtel à Yamoussoukro",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 4,
        title: "Retour à Abidjan & route pour Grand-Bassam",
        description: "Retour vers Abidjan puis départ pour Grand-Bassam, ancienne capitale coloniale au charme préservé.",
        accommodation: "Hôtel à Grand-Bassam",
        meals: "Petit-déjeuner"
      },
      {
        day: 5,
        title: "Grand-Bassam, patrimoine UNESCO & plage",
        description: "Visite guidée du quartier colonial classé UNESCO, des ateliers d'artisans, puis après-midi détente sur la plage.",
        accommodation: "Hôtel à Grand-Bassam",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 6,
        title: "Retour & départ",
        description: "Matinée libre, transfert vers l'aéroport d'Abidjan pour le vol retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-safari-afrique-sud",
    slug: "safari-afrique-du-sud",
    title: "Safari Afrique du Sud",
    destinationId: "dest-afrique-sud",
    destinationName: "Le Cap & Kruger (Afrique du Sud)",
    durationDays: 10,
    priceXOF: 1800000,
    priceEUR: 2750,
    theme: "Safari",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "9 nuits en hôtels de charme et lodge de safari",
      "Vol intérieur Johannesburg-Le Cap",
      "Safari 4x4 guidé dans un parc type Kruger (2 sorties par jour)",
      "Téléphérique jusqu'au sommet de Table Mountain",
      "Dégustation de vins dans la vallée de Stellenbosch",
      "Guide francophone pendant tout le circuit"
    ],
    excluded: [
      "Billets d'avion internationaux",
      "Frais de visa (si applicable selon nationalité)",
      "Repas de midi et du soir (sauf mention spécifique)",
      "Dépenses personnelles et pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Johannesburg",
        description: "Accueil à l'aéroport de Johannesburg, transfert à l'hôtel et briefing sur le circuit.",
        accommodation: "Hôtel à Johannesburg",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Route vers le Parc Kruger",
        description: "Transfert vers la région du Parc Kruger, installation au lodge de safari en fin de journée.",
        accommodation: "Lodge de safari (Kruger)",
        meals: "Pension complète"
      },
      {
        day: 3,
        title: "Safari matinal & vespéral",
        description: "Deux sorties de safari 4x4 dans la journée à la recherche des Big Five, entre savane et points d'eau.",
        accommodation: "Lodge de safari (Kruger)",
        meals: "Pension complète"
      },
      {
        day: 4,
        title: "Safari — cœur de la réserve",
        description: "Journée complète de safari au cœur de la réserve, observation des lions, éléphants et rhinocéros.",
        accommodation: "Lodge de safari (Kruger)",
        meals: "Pension complète"
      },
      {
        day: 5,
        title: "Dernier safari & vol vers Le Cap",
        description: "Sortie de safari matinale puis transfert à l'aéroport et vol intérieur vers Le Cap.",
        accommodation: "Hôtel au Cap",
        meals: "Petit-déjeuner"
      },
      {
        day: 6,
        title: "Table Mountain & centre-ville du Cap",
        description: "Ascension en téléphérique au sommet de Table Mountain, puis découverte du centre historique du Cap et du V&A Waterfront.",
        accommodation: "Hôtel au Cap",
        meals: "Petit-déjeuner"
      },
      {
        day: 7,
        title: "Cap de Bonne-Espérance & manchots",
        description: "Excursion à la journée vers le Cap de Bonne-Espérance, avec halte à Boulders Beach pour observer les colonies de manchots.",
        accommodation: "Hôtel au Cap",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 8,
        title: "Route des vins de Stellenbosch",
        description: "Journée dans la vallée viticole de Stellenbosch, dégustation dans plusieurs domaines et déjeuner gastronomique.",
        accommodation: "Hôtel au Cap",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 9,
        title: "Journée libre au Cap",
        description: "Journée libre pour profiter des plages, boutiques ou activités optionnelles (kayak, plongée avec requins en cage).",
        accommodation: "Hôtel au Cap",
        meals: "Petit-déjeuner"
      },
      {
        day: 10,
        title: "Départ",
        description: "Transfert vers l'aéroport du Cap pour le vol retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-kenya-maasai-mara",
    slug: "kenya-safari-maasai-mara",
    title: "Kenya — Safari Maasai Mara",
    destinationId: "dest-kenya-maasai-mara",
    destinationName: "Maasai Mara (Kenya)",
    durationDays: 8,
    priceXOF: 1600000,
    priceEUR: 2440,
    theme: "Safari",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "7 nuits en camps et lodges de safari avec pension complète",
      "Véhicule 4x4 safari avec chauffeur-guide expérimenté",
      "Droits d'entrée dans la réserve du Maasai Mara",
      "Visite culturelle d'un village Maasaï",
      "Survol optionnel en montgolfière au lever du soleil",
      "Guide francophone pendant tout le circuit"
    ],
    excluded: [
      "Billets d'avion internationaux",
      "Frais de visa Kenya (e-Visa)",
      "Survol en montgolfière (en supplément)",
      "Dépenses personnelles et pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Nairobi",
        description: "Accueil à l'aéroport de Nairobi, transfert à l'hôtel et briefing sur le safari à venir.",
        accommodation: "Hôtel à Nairobi",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Route vers le Maasai Mara",
        description: "Départ matinal en 4x4 vers la réserve du Maasai Mara à travers la vallée du Rift, premier safari en fin d'après-midi.",
        accommodation: "Camp de safari (Maasai Mara)",
        meals: "Pension complète"
      },
      {
        day: 3,
        title: "Safari matinal & vespéral",
        description: "Deux sorties de safari dans la journée à la recherche des Big Five et, selon la saison, des grands troupeaux de la migration.",
        accommodation: "Camp de safari (Maasai Mara)",
        meals: "Pension complète"
      },
      {
        day: 4,
        title: "Grande Migration & rivière Mara",
        description: "Journée complète de safari le long de la rivière Mara, célèbre pour ses scènes de traversée des gnous (juillet à octobre).",
        accommodation: "Camp de safari (Maasai Mara)",
        meals: "Pension complète"
      },
      {
        day: 5,
        title: "Village Maasaï",
        description: "Visite culturelle d'un village Maasaï : rencontre avec la communauté, danses traditionnelles et démonstration de mode de vie ancestral.",
        accommodation: "Camp de safari (Maasai Mara)",
        meals: "Pension complète"
      },
      {
        day: 6,
        title: "Montgolfière au lever du soleil (en option)",
        description: "Survol optionnel en montgolfière au-dessus de la savane au lever du jour, suivi d'un petit-déjeuner brousse. Dernier safari en après-midi.",
        accommodation: "Camp de safari (Maasai Mara)",
        meals: "Pension complète"
      },
      {
        day: 7,
        title: "Retour vers Nairobi",
        description: "Départ matinal du Maasai Mara, retour vers Nairobi et visite du Centre des Girafes ou du Musée National en après-midi.",
        accommodation: "Hôtel à Nairobi",
        meals: "Petit-déjeuner"
      },
      {
        day: 8,
        title: "Départ",
        description: "Matinée libre, transfert vers l'aéroport de Nairobi pour le vol retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  },
  {
    id: "circ-maroc-marrakech-desert",
    slug: "maroc-marrakech-et-desert",
    title: "Maroc — Marrakech & Désert",
    destinationId: "dest-maroc-marrakech",
    destinationName: "Marrakech & Désert (Maroc)",
    durationDays: 8,
    priceXOF: 1300000,
    priceEUR: 1985,
    theme: "Aventure",
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80"
    ],
    included: [
      "7 nuits en riads de charme, hôtel et bivouac sous tente berbère",
      "Transport privé climatisé avec chauffeur pendant tout le circuit",
      "Traversée guidée de la vallée de l'Atlas",
      "Nuit sous tente dans le désert avec dîner traditionnel et musique berbère",
      "Balade à dos de dromadaire au coucher du soleil",
      "Guide francophone pendant tout le séjour"
    ],
    excluded: [
      "Billets d'avion internationaux",
      "Excursion optionnelle à Essaouira",
      "Repas de midi et du soir en ville (sauf mention spécifique)",
      "Dépenses personnelles et pourboires"
    ],
    itinerary: [
      {
        day: 1,
        title: "Arrivée à Marrakech",
        description: "Accueil à l'aéroport de Marrakech, installation dans un riad de charme au cœur de la médina.",
        accommodation: "Riad à Marrakech",
        meals: "Dîner"
      },
      {
        day: 2,
        title: "Médina & souks de Marrakech",
        description: "Découverte de la place Jemaa el-Fna, des souks animés et des jardins secrets de la médina classée UNESCO.",
        accommodation: "Riad à Marrakech",
        meals: "Petit-déjeuner"
      },
      {
        day: 3,
        title: "Jardins & palais de la ville rouge",
        description: "Visite du Jardin Majorelle, du Palais de la Bahia et des tombeaux saadiens.",
        accommodation: "Riad à Marrakech",
        meals: "Petit-déjeuner"
      },
      {
        day: 4,
        title: "Traversée de la vallée de l'Atlas",
        description: "Départ vers le désert à travers les cols vertigineux de la vallée de l'Atlas, halte dans les vallées de l'Ourika ou du Dadès selon l'itinéraire.",
        accommodation: "Hôtel de montagne (Atlas)",
        meals: "Petit-déjeuner & Déjeuner"
      },
      {
        day: 5,
        title: "Entrée dans le désert",
        description: "Route vers les dunes du désert d'Agafay ou de Merzouga, balade à dos de dromadaire au coucher du soleil et installation au bivouac.",
        accommodation: "Camp sous tente berbère (Désert)",
        meals: "Pension complète"
      },
      {
        day: 6,
        title: "Nuit étoilée dans le désert",
        description: "Lever de soleil sur les dunes, journée de détente au bivouac avec activités optionnelles (surf sur sable, balade en quad), soirée musique berbère autour du feu.",
        accommodation: "Camp sous tente berbère (Désert)",
        meals: "Pension complète"
      },
      {
        day: 7,
        title: "Retour vers Marrakech",
        description: "Départ matinal du désert, retour vers Marrakech via la vallée de l'Atlas, soirée libre ou excursion optionnelle à Essaouira.",
        accommodation: "Riad à Marrakech",
        meals: "Petit-déjeuner"
      },
      {
        day: 8,
        title: "Départ",
        description: "Matinée libre pour un dernier tour des souks, transfert vers l'aéroport de Marrakech pour le vol retour.",
        accommodation: "Fin du circuit",
        meals: "Petit-déjeuner"
      }
    ]
  }
];
