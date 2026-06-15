"use client"

import { type ReactNode,useState } from "react"

import { FullScreenLoader } from "@components/FullScreenLoader"
import { NinoLogo } from "@components/NinoLogo"
import { PainelAuthProvider } from "@contexts/PainelAuth"
import { useAuthUser } from "@hooks/useAuthUser"

import { Sidebar } from "./_components/Sidebar"
import styles from "./layout.module.css"

function IconHamburger() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export default function PainelLayout({
  children,
}: {
  children: ReactNode
}) {
  const { user, loading } = useAuthUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading || !user) return <FullScreenLoader />

  return (
    <PainelAuthProvider user={user}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <button
            className={styles.hamburger}
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <IconHamburger />
          </button>
          <NinoLogo size="sm" />
          <div className={styles.topbarSpacer} />
        </header>

        <Sidebar
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {sidebarOpen && (
          <div
            className={styles.overlay}
            onClick={() => setSidebarOpen(false)}
            role="presentation"
          />
        )}

        <main className={styles.main}>{children}</main>
      </div>
    </PainelAuthProvider>
  )
}
