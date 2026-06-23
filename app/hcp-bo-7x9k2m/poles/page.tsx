import { PremiumCard } from "@/components/ui/premium-card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { poles } from "@/lib/poles-data";

function getCompleteness(pole: (typeof poles)[number]) {
  const checks = [
    Boolean(pole.title),
    Boolean(pole.shortDescription),
    Boolean(pole.description),
    Boolean(pole.image),
    pole.services.length >= 3,
    pole.stats.length >= 3,
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

export default function AdminPolesPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Gestion des pôles</h2>
          <p className="mt-2 text-white/50">Contrôlez les contenus publiés sur l'accueil et les pages d'expertise.</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
          <LockKeyhole className="h-4 w-4 text-emerald-300" />
          Edition connectée au code
        </div>
      </div>

      <div className="grid gap-6">
        {poles.map((pole) => {
          const completeness = getCompleteness(pole);
          const Icon = pole.icon;

          return (
            <PremiumCard key={pole.id} className="p-6">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-white">{pole.title}</h3>
                      <span className="rounded border border-emerald-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400/70">
                        ID: {pole.id}
                      </span>
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/50">{pole.shortDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link href={pole.slug} target="_blank">
                    <Button variant="ghost" size="sm" className="gap-2 text-white/60 hover:bg-white/5 hover:text-white">
                      <ExternalLink className="h-4 w-4" />
                      Voir
                    </Button>
                  </Link>
                  <Link href={`/hcp-bo-7x9k2m/poles#${pole.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2 text-emerald-400 hover:bg-emerald-400/10 hover:text-emerald-300">
                      <FileText className="h-4 w-4" />
                      Détails
                    </Button>
                  </Link>
                </div>
              </div>

              <div id={pole.id} className="mt-6 grid gap-4 border-t border-white/5 pt-6 md:grid-cols-5">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-white/30">Complétude</div>
                  <div className="mt-1 text-sm font-bold text-white/80">{completeness}%</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-white/30">Services</div>
                  <div className="mt-1 text-sm font-bold text-white/80">{pole.services.length}</div>
                </div>
                {pole.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-xs font-semibold uppercase tracking-widest text-white/30">{stat.label}</div>
                    <div className="mt-1 text-sm font-bold text-white/80">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-white/30">Résumé long</div>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{pole.description}</p>
              </div>
            </PremiumCard>
          );
        })}
      </div>
    </div>
  );
}
