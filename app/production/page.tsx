"use client"

import { poles } from "@/lib/poles-data"
import { PolePageLayout } from "@/components/pole-page-layout"

export default function ProductionPage() {
  const pole = poles[3]
  const prevPole = poles[2]
  const nextPole = poles[4]

  return (
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
    />
  )
}
