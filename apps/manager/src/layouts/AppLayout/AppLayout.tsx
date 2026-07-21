import { useState } from 'react'
import { Outlet } from 'react-router'

import { Button } from '@nino/ds'

import { NavIcon } from '@components/NavIcon'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'

import { Sidebar } from './Sidebar'

import styles from './AppLayout.module.css'

export const AppLayout = () => {
  const tenant = useCurrentTenant()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={styles.shell}>
      {/* a marca já está no menu — aqui vale o nome da loja em que se opera */}
      <header className={styles.topbar}>
        <Button
          size="icon"
          variant="ghost"
          className={styles.hamburger}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <NavIcon name="menu" className={styles.hamburgerIcon} />
        </Button>
        <span className={styles.storeName}>{tenant?.tenantName}</span>
      </header>

      <Sidebar
        tenantId={tenant?.tenantId ?? null}
        isOpen={menuOpen}
        onClose={closeMenu}
      />

      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={closeMenu}
          role="presentation"
        />
      )}

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
