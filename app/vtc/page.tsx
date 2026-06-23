"use client"

import { poles } from "@/lib/poles-data"
import { PolePageLayout } from "@/components/pole-page-layout"

export default function VtcPage() {
  const pole = poles[6]
  const prevPole = poles[5]

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
