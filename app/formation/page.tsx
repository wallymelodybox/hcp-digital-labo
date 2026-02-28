"use client"

import { poles } from "@/lib/poles-data"
import { PolePageLayout } from "@/components/pole-page-layout"

export default function FormationPage() {
  const pole = poles[4]
  const prevPole = poles[3]

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
      nextPole={null}
    />
  )
}
