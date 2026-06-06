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

function getLocalHour(timezone: string | null): number {
  const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  const raw = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    hour12: false,
    timeZone: tz,
  })
  const h = parseInt(raw, 10)
  return h === 24 ? 0 : h
}

function getGreeting(timezone: string | null): string {
  const h = getLocalHour(timezone)
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

function getDateLabel(timezone: string | null): string {
  const tz = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: tz,
  }).format(new Date())
}

export default function Page() {
  const user = usePainelUser()
  const firstName = user.name.split(' ')[0]

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerGlow} />
        <p className={styles.greeting}>
          {getGreeting(user.timezone)}
        </p>
        <h1 className={styles.title}>{firstName}</h1>
        <p className={styles.date}>{getDateLabel(user.timezone)}</p>
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
