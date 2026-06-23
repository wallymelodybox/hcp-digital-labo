import { FileText, LineChart, PenTool, Target } from "lucide-react";

export type StrategyOfferIcon = "target" | "pen" | "chart" | "file";

export type StrategyOffer = {
  id: string;
  icon: StrategyOfferIcon;
  title: string;
  desc: string;
  bullets: string[];
};

export const strategyOfferIcons = {
  target: Target,
  pen: PenTool,
  chart: LineChart,
  file: FileText,
};

export const defaultStrategyOffers: StrategyOffer[] = [
  {
    id: "positionnement",
    icon: "target",
    title: "Positionnement & Messages",
    desc: "Clarifier votre proposition de valeur, vos cibles et vos messages clés. Aligner l’équipe sur une direction unique.",
    bullets: ["Proposition de valeur", "Personas", "Message house"],
  },
  {
    id: "branding",
    icon: "pen",
    title: "Branding & Identité",
    desc: "Consolider une identité premium : ton, codes, charte et système visuel cohérent sur tous les supports.",
    bullets: ["Audit marque", "Charte", "Système visuel"],
  },
  {
    id: "marketing",
    icon: "chart",
    title: "Plan Marketing & Go-to-market",
    desc: "Construire un plan exécutable avec priorités, calendrier, budget, canaux, et KPIs suivis.",
    bullets: ["Roadmap", "Canaux", "KPI"],
  },
  {
    id: "corporate",
    icon: "file",
    title: "Communication Corporate",
    desc: "Structurer vos contenus et prises de parole : institutionnel, partenaires, RH, communication interne.",
    bullets: ["Narratif", "Contenus", "Templates"],
  },
];
