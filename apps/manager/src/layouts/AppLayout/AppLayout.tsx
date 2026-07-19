import { useState } from 'react'
import { Outlet } from 'react-router'

import { NavIcon } from '@components/NavIcon'
import { NinoLogo } from '@components/NinoLogo'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'

import { Sidebar } from './Sidebar'

import styles from './AppLayout.module.css'

export const AppLayout = () => {
  const tenant = useCurrentTenant()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <NavIcon name="menu" className={styles.hamburgerIcon} />
        </button>
        <NinoLogo size="sm" tone="light" />
        <div className={styles.spacer} />
      </header>

      <Sidebar
        tenantId={tenant?.tenantId ?? null}
        isOpen={menuOpen}
        onClose={closeMenu}
      />

      {menuOpen && (
        <div className={styles.overlay} onClick={closeMenu} role="presentation" />
      )}

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
