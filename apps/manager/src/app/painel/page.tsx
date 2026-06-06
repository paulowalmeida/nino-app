"use client"

import { StatCard } from "./_components/StatCard"
import {
  IconOrders,
  IconRevenue,
  IconStar,
  IconTicket,
} from "./_components/StatCard/_icons"
import styles from "./page.module.css"

import { usePainelUser } from "@/contexts/PainelAuth"

const WEEKDAYS = [
  'domingo', 'segunda', 'terça', 'quarta',
  'quinta', 'sexta', 'sábado',
]

const MONTHS = [
  'janeiro', 'fevereiro', 'março', 'abril',
  'maio', 'junho', 'julho', 'agosto',
  'setembro', 'outubro', 'novembro', 'dezembro',
]

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function getDateLabel(): string {
  const now = new Date()
  const weekday = WEEKDAYS[now.getDay()]
  const day = now.getDate()
  const month = MONTHS[now.getMonth()]
  return `${weekday}, ${day} de ${month}`
}

export default function Page() {
  const user = usePainelUser()
  const firstName = user.name.split(' ')[0]

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerGlow} />
        <p className={styles.greeting}>{getGreeting()}</p>
        <h1 className={styles.title}>{firstName}</h1>
        <p className={styles.date}>{getDateLabel()}</p>
      </header>

      <section className={styles.cards}>
        <StatCard
          label="Pedidos hoje"
          value="—"
          icon={<IconOrders />}
        />
        <StatCard
          label="Faturamento"
          value="—"
          icon={<IconRevenue />}
        />
        <StatCard
          label="Ticket médio"
          value="—"
          icon={<IconTicket />}
        />
        <StatCard
          label="Avaliação"
          value="—"
          icon={<IconStar />}
        />
      </section>
    </div>
  )
}
