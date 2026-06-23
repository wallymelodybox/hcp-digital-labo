import { PremiumCard } from "@/components/ui/premium-card";
import { BarChart3, FileText, Layers, ShieldCheck, Users } from "lucide-react";
import { poles } from "@/lib/poles-data";
import { adminOperationalItems, siteMetrics } from "@/lib/site-data";

export default function AdminPage() {
  const totalServices = poles.reduce((total, pole) => total + pole.services.length, 0);
  const totalStats = poles.reduce((total, pole) => total + pole.stats.length, 0);

  const stats = [
    { label: "Pôles publiés", value: String(poles.length), icon: Layers, trend: "Source unique" },
    { label: "Services listés", value: String(totalServices), icon: FileText, trend: "Public" },
    { label: "Indicateurs", value: String(totalStats + siteMetrics.length), icon: BarChart3, trend: "À vérifier" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-white">Vue d'ensemble</h2>
        <p className="mt-2 text-white/50">Etat opérationnel du contenu public et des modules back-office.</p>
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
              <div className="text-sm font-medium uppercase tracking-widest text-white/60">{stat.label}</div>
              <div className="mt-1 text-2xl font-bold text-white">{stat.value}</div>
            </div>
          </PremiumCard>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <PremiumCard className="p-6">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-emerald-300" />
            <h3 className="text-lg font-semibold text-white">Demandes contact</h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/55">
            Les formulaires publics enregistrent maintenant les messages côté serveur et les demandes apparaissent dans la page dédiée du BO.
          </p>
          <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
            Action suivante : brancher un envoi email ou migrer le stockage vers Supabase si besoin.
          </div>
        </PremiumCard>

        <PremiumCard className="p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <h3 className="text-lg font-semibold text-white">Suivi BO</h3>
          </div>
          <div className="mt-5 space-y-4">
            {adminOperationalItems.map((item) => (
              <div key={item.title} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-white">{item.title}</div>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                    {item.status}
                  </span>
                </div>
                <div className="mt-1 text-xs leading-relaxed text-white/40">{item.detail}</div>
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

