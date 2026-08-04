import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Sidebar } from '@compositions/Sidebar/Sidebar'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import {
  readSidebarCollapsed,
  writeSidebarCollapsed,
} from '@utils/sidebar-collapse'

import styles from './AppLayout.module.css'

export const AppLayout = () => {
  const tenant = useCurrentTenant()
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(readSidebarCollapsed)

  const closeMenu = () => setMenuOpen(false)

  /*
   * With the menu open on mobile, the whole page used to scroll behind the
   * veil: a finger drag on the menu would drag the content too, landing on
   * a shifted screen. `overflow` restores whatever it was before, instead
   * of a fixed `''` — height-locked screens depend on their own value.
   */
  useEffect(() => {
    if (!menuOpen) return

    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previous
    }
  }, [menuOpen])

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current
      writeSidebarCollapsed(next)
      return next
    })
  }

  return (
    <div className={styles.shell}>
      {/* the brand already lives in the menu — here it's the active store */}
      <header className={styles.topbar}>
        <Button
          size="icon"
          variant="ghost"
          className={styles.hamburger}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Icon name="menu" className={styles.hamburgerIcon} />
        </Button>
        <span className={styles.storeName}>{tenant?.tenantName}</span>
      </header>

      <Sidebar
        tenantId={tenant?.tenantId ?? null}
        isOpen={menuOpen}
        onClose={closeMenu}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
      />

      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={closeMenu}
          role="presentation"
        />
      )}

      <main
        className={
          collapsed ? `${styles.main} ${styles.mainCollapsed}` : styles.main
        }
      >
        <Outlet />
      </main>
    </div>
  )
}
