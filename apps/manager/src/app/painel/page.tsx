"use client"

import { LogoutButton } from "./_components/LogoutButton"
import styles from "./page.module.css"

import { FullScreenLoader } from "@/components/FullScreenLoader"
import { NinoLogo } from "@/components/NinoLogo"
import { useAuthUser } from "@/hooks/useAuthUser"

export default function Page() {
  const { user, loading } = useAuthUser()

  if (loading || !user) return <FullScreenLoader />

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <NinoLogo size="md" />
        <LogoutButton />
      </header>

      <main className={styles.main}>
        <span className={styles.badge}>Você está autenticado 🎉</span>
        <h1 className={styles.title}>Olá, {user.name}</h1>
        <p className={styles.subtitle}>
          Em breve você vai gerir pedidos, cardápio e configurações da sua loja
          por aqui.
        </p>
      </main>
    </div>
  )
}
