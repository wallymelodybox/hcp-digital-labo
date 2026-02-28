import { Check } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Diagnostic",
    description:
      "Analyse approfondie de votre ecosysteme, vos enjeux et vos objectifs pour definir une feuille de route claire.",
  },
  {
    number: "02",
    title: "Strategie",
    description:
      "Elaboration d'un plan d'action structure, alignant chaque pole d'expertise sur vos priorites.",
  },
  {
    number: "03",
    title: "Execution",
    description:
      "Mise en oeuvre rigoureuse par nos equipes specialisees, avec des jalons clairs et un suivi continu.",
  },
  {
    number: "04",
    title: "Mesure & Optimisation",
    description:
      "Analyse des performances, reporting transparent et optimisation continue pour maximiser l'impact.",
  },
]

export function Approach() {
  return (
    <section id="approche" className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-20">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-12 bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Notre methode
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl font-mono text-balance">
            {"Un processus structure"}
            <br />
            pour des resultats concrets
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative border border-border p-8 transition-all hover:border-accent/40 group"
            >
              {/* Connection line on desktop */}
              {idx < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden h-px w-8 bg-border lg:block" />
              )}
              <span className="font-mono text-3xl font-bold text-accent">
                {step.number}
              </span>
              <h3 className="mt-4 text-lg font-bold text-foreground font-mono">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs text-accent font-semibold uppercase tracking-wider opacity-0 transition-opacity group-hover:opacity-100">
                <Check className="h-3.5 w-3.5" />
                Delivrable inclus
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
