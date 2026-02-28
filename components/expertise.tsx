import { Layers, Zap, Shield, TrendingUp } from "lucide-react"

const values = [
  {
    icon: Layers,
    title: "Structure",
    description:
      "Une methodologie rigoureuse et des processus eprouves pour des resultats previsibles et mesurables.",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Chaque action est orientee ROI. Nous mesurons, optimisons et maximisons l'impact de chaque projet.",
  },
  {
    icon: Shield,
    title: "Premium",
    description:
      "Des standards d'excellence dans chaque livrable. Qualite, finition et attention au detail.",
  },
  {
    icon: TrendingUp,
    title: "Impact",
    description:
      "Des solutions qui transforment. Nous visons des resultats tangibles et un changement durable.",
  },
]

export function Expertise() {
  return (
    <section
      id="expertise"
      className="bg-[var(--section-dark)] py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Left column */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-12 bg-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Notre ADN
              </span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--section-dark-foreground)] sm:text-4xl lg:text-5xl font-mono text-balance">
              Une approche globale
              <br />
              pour un impact reel
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[var(--hero-muted)]">
              {"HCP Digital Labo n'est pas une simple agence. C'est un ecosysteme complet de competences complementaires, structure pour generer de la performance a chaque etape de votre transformation."}
            </p>
            <div className="mt-10 flex items-center gap-6 border-t border-[oklch(0.2_0_0)] pt-10">
              <div>
                <div className="text-4xl font-bold text-accent font-mono">
                  360
                </div>
                <div className="mt-1 text-sm text-[var(--hero-muted)]">
                  {"Degres de couverture"}
                </div>
              </div>
              <div className="h-12 w-px bg-[oklch(0.2_0_0)]" />
              <div>
                <div className="text-4xl font-bold text-accent font-mono">
                  5
                </div>
                <div className="mt-1 text-sm text-[var(--hero-muted)]">
                  {"Poles d'excellence"}
                </div>
              </div>
              <div className="h-12 w-px bg-[oklch(0.2_0_0)]" />
              <div>
                <div className="text-4xl font-bold text-accent font-mono">
                  1
                </div>
                <div className="mt-1 text-sm text-[var(--hero-muted)]">
                  Vision unifiee
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Values grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {values.map((v) => {
              const Icon = v.icon
              return (
                <div
                  key={v.title}
                  className="group border border-[oklch(0.2_0_0)] p-6 transition-all hover:border-accent/40"
                >
                  <Icon className="mb-4 h-6 w-6 text-accent" />
                  <h3 className="text-lg font-bold text-[var(--section-dark-foreground)] font-mono">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--hero-muted)]">
                    {v.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
