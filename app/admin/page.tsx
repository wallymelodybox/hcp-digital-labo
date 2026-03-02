import { PremiumCard } from "@/components/ui/premium-card";
import { BarChart3, Users, FileText, Settings } from "lucide-react";

export default function AdminPage() {
  const stats = [
    { label: "Visiteurs (30j)", value: "2,450", icon: Users, trend: "+12%" },
    { label: "Demandes Contact", value: "14", icon: FileText, trend: "+3" },
    { label: "Projets Actifs", value: "6", icon: BarChart3, trend: "Stable" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Vue d'ensemble</h2>
        <p className="mt-2 text-white/50">Bienvenue dans l'espace de gestion HCP Digital Labo.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <PremiumCard key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                <stat.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-400">{stat.trend}</span>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium text-white/60 uppercase tracking-widest">{stat.label}</div>
              <div className="mt-1 text-2xl font-bold text-white">{stat.value}</div>
            </div>
          </PremiumCard>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PremiumCard className="p-6">
          <h3 className="text-lg font-semibold text-white">Dernières demandes</h3>
          <div className="mt-4 space-y-4">
            <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
              <div className="text-sm font-medium">Jean Dupont - Stratégie</div>
              <div className="text-xs text-white/40 italic mt-1">"Besoin d'un audit de marque premium..."</div>
            </div>
            <div className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
              <div className="text-sm font-medium">Marie Kouassi - Digital</div>
              <div className="text-xs text-white/40 italic mt-1">"Refonte plateforme e-commerce luxe..."</div>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="p-6 flex flex-col justify-center items-center text-center">
          <Settings className="h-10 w-10 text-white/10" />
          <h3 className="mt-4 text-sm font-semibold uppercase tracking-widest text-white/40">Configuration</h3>
          <p className="mt-2 text-xs text-white/30">Accédez aux réglages globaux du site.</p>
        </PremiumCard>
      </div>
    </div>
  );
}
