import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[var(--hero-bg)] overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.98 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.98 0 0) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Accent line */}
      <div className="absolute left-0 top-0 h-full w-1 bg-accent" />

      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20 lg:px-8 lg:pt-40 lg:pb-32">
        <div className="max-w-4xl">
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-12 bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Agence de transformation digitale
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-[var(--hero-foreground)] sm:text-5xl lg:text-7xl font-mono text-balance">
            Construisons ensemble
            <br />
            <span className="text-accent">{"l'impact"}</span> de votre marque
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--hero-muted)]">
            {"Cinq poles d'excellence au service de votre performance. Strategie, digital, evenementiel, production et formation : une approche structurante pour transformer votre vision en resultats concrets."}
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/strategie"
              className="group inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 text-sm font-semibold tracking-wide uppercase transition-all hover:opacity-90"
            >
              Decouvrir nos expertises
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-[oklch(0.3_0_0)] px-8 py-4 text-sm font-semibold tracking-wide uppercase text-[var(--hero-foreground)] transition-all hover:bg-[oklch(0.15_0_0)]"
            >
              Nous contacter
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-20 grid grid-cols-2 gap-8 border-t border-[oklch(0.2_0_0)] pt-10 sm:grid-cols-4">
            {[
              { value: "5", label: "Poles d'expertise" },
              { value: "150+", label: "Projets livres" },
              { value: "98%", label: "Clients satisfaits" },
              { value: "10+", label: "Annees d'experience" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-accent font-mono lg:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-[var(--hero-muted)]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
