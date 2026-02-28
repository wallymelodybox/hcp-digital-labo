import {
  Target,
  Monitor,
  PartyPopper,
  Printer,
  GraduationCap,
} from "lucide-react"

export const poles = [
  {
    id: "strategie",
    slug: "/strategie",
    number: "01",
    title: "Strategie & Communication",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200",
    icon: Target,
    shortDescription:
      "Definir la trajectoire strategique de votre marque avec un positionnement fort et une identite coherente.",
    description:
      "Nous definissons la trajectoire strategique de votre marque avec des plans de communication sur mesure, un positionnement fort et une identite coherente. Notre approche combine analyse approfondie du marche, veille concurrentielle et expertise sectorielle pour construire une strategie qui genere des resultats mesurables.",
    services: [
      {
        name: "Audit de marque",
        detail:
          "Analyse complete de votre identite, positionnement et perception sur le marche pour identifier les leviers de croissance.",
      },
      {
        name: "Strategie marketing",
        detail:
          "Elaboration de plans marketing 360 alignes sur vos objectifs business et optimises pour le ROI.",
      },
      {
        name: "Positionnement & branding",
        detail:
          "Construction d'une identite de marque distinctive, memorable et coherente sur tous les points de contact.",
      },
      {
        name: "Plan de communication",
        detail:
          "Orchestration de campagnes multicanales avec un calendrier editorial structure et des KPIs clairs.",
      },
      {
        name: "Communication institutionnelle",
        detail:
          "Gestion de votre image corporate, relations presse et communication de crise.",
      },
    ],
    stats: [
      { value: "120+", label: "Strategies deployees" },
      { value: "95%", label: "Taux de satisfaction" },
      { value: "3x", label: "ROI moyen constate" },
    ],
  },
  {
    id: "digital",
    slug: "/digital",
    number: "02",
    title: "Digital & Technologie",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    icon: Monitor,
    shortDescription:
      "Concevoir des solutions digitales performantes : sites, applications, CRM, automatisation et IA.",
    description:
      "Nous concevons des solutions digitales performantes et sur mesure : sites web, applications mobiles, CRM, automatisation et integration IA. Notre equipe technique maitrise les derniers frameworks et technologies pour livrer des produits robustes, scalables et centres sur l'experience utilisateur.",
    services: [
      {
        name: "Developpement web & mobile",
        detail:
          "Conception et developpement de sites web responsifs et d'applications mobiles natives ou cross-platform.",
      },
      {
        name: "CRM & solutions internes",
        detail:
          "Implementation et personnalisation de CRM pour optimiser votre relation client et vos processus internes.",
      },
      {
        name: "Automatisation & IA",
        detail:
          "Automatisation des workflows, chatbots intelligents et integration d'IA pour booster votre productivite.",
      },
      {
        name: "UX/UI Design",
        detail:
          "Design d'interfaces intuitives et esthetiques, basees sur la recherche utilisateur et les best practices.",
      },
      {
        name: "Hebergement & maintenance",
        detail:
          "Infrastructure cloud securisee, monitoring 24/7 et maintenance proactive de vos solutions digitales.",
      },
    ],
    stats: [
      { value: "80+", label: "Projets livres" },
      { value: "99.9%", label: "Uptime garanti" },
      { value: "<48h", label: "Temps de reponse" },
    ],
  },
  {
    id: "evenementiel",
    slug: "/evenementiel",
    number: "03",
    title: "Evenementiel & Experiences",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
    icon: PartyPopper,
    shortDescription:
      "Creer des evenements memorables et des experiences immersives qui renforcent votre marque.",
    description:
      "Nous creons des evenements memorables et des experiences immersives qui renforcent votre marque et engagent vos audiences. De la conception a l'execution, chaque detail est pense pour maximiser l'impact et creer des souvenirs durables aupres de vos cibles.",
    services: [
      {
        name: "Organisation d'evenements corporate",
        detail:
          "Seminaires, conventions, soirees de gala et team buildings sur mesure pour vos collaborateurs et partenaires.",
      },
      {
        name: "Lancements de produits",
        detail:
          "Evenements de lancement spectaculaires qui generent du buzz et posent les bases d'un succes commercial.",
      },
      {
        name: "Experiences immersives",
        detail:
          "Installations interactives, realite augmentee et scenographies innovantes pour marquer les esprits.",
      },
      {
        name: "Branding evenementiel",
        detail:
          "Identite visuelle, signaletique et design d'espace pour une coherence parfaite avec votre marque.",
      },
    ],
    stats: [
      { value: "50+", label: "Evenements organises" },
      { value: "10K+", label: "Participants cumules" },
      { value: "100%", label: "Livraison dans les delais" },
    ],
  },
  {
    id: "production",
    slug: "/production",
    number: "04",
    title: "Production & Imprimerie",
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=1200",
    icon: Printer,
    shortDescription:
      "Produire des supports de communication premium : impression, goodies, signaletique et branding visuel.",
    description:
      "Nous produisons des supports de communication premium : impression haut de gamme, goodies, signaletique et branding visuel. Chaque livrable est concu avec une attention extreme aux details, aux materiaux et aux finitions pour refaire votre exigence de qualite.",
    services: [
      {
        name: "Impression professionnelle",
        detail:
          "Impression offset et numerique haute qualite pour brochures, catalogues, cartes de visite et supports marketing.",
      },
      {
        name: "Goodies & objets personnalises",
        detail:
          "Creation et production d'objets promotionnels uniques, alignes sur votre identite de marque.",
      },
      {
        name: "Supports corporate",
        detail:
          "Rapports annuels, presentations, papeterie et kits de bienvenue avec des finitions premium.",
      },
      {
        name: "Signaletique & branding visuel",
        detail:
          "Enseignes, habillage de vehicules, PLV et signaletique interieure/exterieure pour une visibilite maximale.",
      },
    ],
    stats: [
      { value: "200K+", label: "Supports imprimes" },
      { value: "50+", label: "Materiaux disponibles" },
      { value: "48h", label: "Delai express possible" },
    ],
  },
  {
    id: "formation",
    slug: "/formation",
    number: "05",
    title: "Formation & Transformation",
    image: "https://images.unsplash.com/photo-1524178232363-1fb28f74b0cd?auto=format&fit=crop&q=80&w=1200",
    icon: GraduationCap,
    shortDescription:
      "Accompagner votre montee en competences avec des formations digitales et du coaching strategique.",
    description:
      "Nous accompagnons votre montee en competences avec des formations digitales, du coaching strategique et un accompagnement a la transformation. Notre pedagogie s'adapte a votre contexte pour garantir une adoption rapide et des resultats concrets sur le terrain.",
    services: [
      {
        name: "Formation marketing digital",
        detail:
          "Programmes complets couvrant SEO, SEA, social media, content marketing et analytics.",
      },
      {
        name: "Formation outils numeriques",
        detail:
          "Maitrise des outils CRM, CMS, design, gestion de projet et collaboration pour vos equipes.",
      },
      {
        name: "Coaching strategique",
        detail:
          "Accompagnement personnalise des dirigeants et managers pour piloter la transformation.",
      },
      {
        name: "Accompagnement transformation digitale",
        detail:
          "Audit, roadmap et conduite du changement pour reussir votre virage numerique.",
      },
    ],
    stats: [
      { value: "500+", label: "Professionnels formes" },
      { value: "40+", label: "Programmes disponibles" },
      { value: "4.8/5", label: "Note moyenne" },
    ],
  },
] as const
