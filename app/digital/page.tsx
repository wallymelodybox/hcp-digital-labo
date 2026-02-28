"use client"

import { poles } from "@/lib/poles-data"
import { PolePageLayout } from "@/components/pole-page-layout"

export default function DigitalPage() {
  const pole = poles[1]
  const prevPole = poles[0]
  const nextPole = poles[2]

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
