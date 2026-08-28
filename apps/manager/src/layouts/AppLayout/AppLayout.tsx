import { useEffect, useState } from 'react'

import {
  readSidebarCollapsed,
  writeSidebarCollapsed,
} from '@layouts/AppLayout/utils/sidebar-collapse'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import {
  useCurrentTenant,
} from '@shared/hooks/session/useCurrentTenant/useCurrentTenant'

import { AppLayoutContent } from './components/AppLayoutContent/AppLayoutContent'
import { AppLayoutHeader } from './components/AppLayoutHeader/AppLayoutHeader'
import { Sidebar } from './components/Sidebar/Sidebar'

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
    <Box direction="row" className={styles.shell}>
      <AppLayoutHeader
        tenantName={tenant?.tenantName}
        onOpenMenu={() => setMenuOpen(true)}
      />

      <Sidebar
        isOpen={menuOpen}
        onClose={closeMenu}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapsed}
      />

      {menuOpen && (
        <Button
          type="button"
          className={styles.overlay}
          onClick={closeMenu}
          aria-label="Fechar menu"
        />
      )}

      <AppLayoutContent />
    </Box>
  )
}
