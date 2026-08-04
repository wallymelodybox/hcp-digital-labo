"use client"

import { poles } from "@/lib/poles-data"
import { PolePageLayout } from "@/components/pole-page-layout"
import { FormationPricing } from "@/components/formation-pricing"

export default function FormationPage() {
  const pole = poles[4]
  const prevPole = poles[3]
  const nextPole = poles[5]

  return (
    <div className="public-theme">
      <PolePageLayout
        number={pole.number}
        title={pole.title}
        image={pole.image}
        icon={pole.icon}
        description={pole.description}
        services={[...pole.services]}
        stats={[...pole.stats]}
        prevPole={{ title: prevPole.title, slug: prevPole.slug }}
        nextPole={{ title: nextPole.title, slug: nextPole.slug }}
        contentAfterHero={<FormationPricing />}
      />
    </div>
  )
}
