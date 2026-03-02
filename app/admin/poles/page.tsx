import { PremiumCard } from "@/components/ui/premium-card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { poles } from "@/lib/poles-data";

export default function AdminPolesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Gestion des Pôles</h2>
          <p className="mt-2 text-white/50">Gérez le contenu et les services de vos expertises.</p>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2">
          <Plus className="h-4 w-4" />
          Nouveau Pôle
        </Button>
      </div>

      <div className="grid gap-6">
        {poles.map((pole) => (
          <PremiumCard key={pole.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                  <pole.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white">{pole.title}</h3>
                    <span className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest border border-emerald-400/20 px-2 py-0.5 rounded">
                      ID: {pole.id}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/40 line-clamp-1">{pole.shortDescription}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href={pole.slug} target="_blank">
                  <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hover:bg-white/5 gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Voir
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 gap-2">
                  <Edit2 className="h-4 w-4" />
                  Modifier
                </Button>
                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 gap-2">
                  <Trash2 className="h-4 w-4" />
                  Supprimer
                </Button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/5">
              {pole.stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-xs text-white/30 uppercase tracking-widest font-semibold">{stat.label}</div>
                  <div className="text-sm font-bold text-white/80">{stat.value}</div>
                </div>
              ))}
              <div>
                <div className="text-xs text-white/30 uppercase tracking-widest font-semibold">Services</div>
                <div className="text-sm font-bold text-white/80">{pole.services.length} services</div>
              </div>
            </div>
          </PremiumCard>
        ))}
      </div>
    </div>
  );
}
