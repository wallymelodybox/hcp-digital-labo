export type FormationLevel = "basique" | "intermediaire" | "complete";

export type FormationOffer = {
  id: string;
  level: FormationLevel;
  title: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  duration: string;
  badge?: string;
  features: string[];
  ctaLabel: string;
};

export const defaultFormationOffers: FormationOffer[] = [
  {
    id: "basique",
    level: "basique",
    title: "Formation Basique",
    tagline: "Pour découvrir et bien utiliser les outils d'intelligence artificielle.",
    price: 20000,
    duration: "4 à 6 heures",
    features: [
      "Comprendre le fonctionnement de l'IA",
      "Découvrir les principaux outils",
      "Bien rédiger ses prompts",
      "Utiliser ChatGPT efficacement",
      "Créer des textes professionnels",
      "Créer des visuels avec l'IA",
      "Initiation à la création de vidéos",
      "Bibliothèque de prompts",
      "Support de formation",
    ],
    ctaLabel: "Choisir la formule Basique",
  },
  {
    id: "intermediaire",
    level: "intermediaire",
    title: "Formation Intermédiaire",
    tagline: "Pour créer des contenus et des solutions digitales avec l'IA.",
    price: 35000,
    duration: "1 à 2 jours",
    badge: "Formule recommandée",
    features: [
      "Tout le contenu de la formule Basique",
      "Création avancée de visuels",
      "Création et montage de vidéos avec l'IA",
      "Création d'une identité visuelle",
      "Création d'un site web avec l'IA",
      "Initiation aux outils no-code",
      "Automatisation de tâches simples",
      "Projet pratique accompagné",
      "Groupe privé d'accompagnement",
    ],
    ctaLabel: "Choisir la formule Intermédiaire",
  },
  {
    id: "complete",
    level: "complete",
    title: "Formation Complète",
    tagline: "Pour lancer un site, une application ou un projet SaaS avec l'IA.",
    price: 50000,
    originalPrice: 100000,
    duration: "2 à 4 jours",
    badge: "Vente flash",
    features: [
      "Tout le contenu des formules précédentes",
      "Création de sites web avancés",
      "Création de prototypes d'applications",
      "Initiation à la création de SaaS",
      "Connexion à une base de données",
      "Automatisation de processus",
      "Création de formulaires et tableaux de bord",
      "Mise en ligne d'un projet",
      "Méthodes de monétisation",
      "Suivi personnalisé",
      "Projet final pratique",
      "Attestation ou certificat",
    ],
    ctaLabel: "Réserver ma place à 50 000 FCFA",
  },
];
