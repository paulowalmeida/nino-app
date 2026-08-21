import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { Sidebar } from './Sidebar/Sidebar'
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

  useEffect(() => {
    if (!menuOpen) return

    const { body } = document
    const previous = body.style.overflow
    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = previous
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [menuOpen])

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current
      writeSidebarCollapsed(next)
      return next
    })
  }

  return (
    <Flexbox direction="row" className={styles.shell}>
      <Flexbox as="header" direction="row" className={styles.topbar}>
        <Button
          size="icon"
          variant="ghost"
          className={styles.hamburger}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <Icon name="menu" size="md" />
        </Button>
        <Text as="span" className={styles.storeName}>
          {tenant?.tenantName}
        </Text>
      </Flexbox>

      <Sidebar
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
    </Flexbox>
  )
}
