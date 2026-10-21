import { useEffect, useState } from 'react'

import { shortcutLabel } from '@layouts/AppLayout/utils/shortcut-label/shortcut-label'
import {
  readSidebarCollapsed,
  writeSidebarCollapsed,
} from '@layouts/AppLayout/utils/sidebar-collapse/sidebar-collapse'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Tooltip } from '@nino/ds/components/Tooltip'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { useSessionStore } from '@shared/states/session/session.state'

import { AppLayoutContent } from './components/AppLayoutContent/AppLayoutContent'
import { AppLayoutHeader } from './components/AppLayoutHeader/AppLayoutHeader'
import { CommandPalette } from './components/CommandPalette/CommandPalette'
import { Sidebar } from './components/Sidebar/Sidebar'

import styles from './AppLayout.module.css'

const COLLAPSE_SHORTCUT = 'b'

const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

export const AppLayout = () => {
  const unit = useCurrentUnit()
  const user = useSessionStore(({ user }) => user)
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(readSidebarCollapsed)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

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

  useEffect(() => {
    const toggleOnShortcut = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return
      if (event.key.toLowerCase() !== COLLAPSE_SHORTCUT) return
      if (isTyping(event.target)) return

      event.preventDefault()
      toggleCollapsed()
    }

    document.addEventListener('keydown', toggleOnShortcut)
    return () => document.removeEventListener('keydown', toggleOnShortcut)
  }, [])

  const collapseLabel = collapsed ? 'Expandir menu' : 'Recolher menu'

  return (
    <Box direction="column" className={styles.appLayoutShell}>
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />

      <AppLayoutHeader
        unitId={unit?.unitId ?? null}
        unitName={unit?.unitName}
        positionName={unit?.positionName}
        userName={user?.name ?? ''}
        userEmail={
          user?.credentials?.find(({ email }) => email)?.email ?? undefined
        }
        onOpenMenu={() => setMenuOpen(true)}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      <Box direction="row" className={styles.appLayoutBody}>
        <Sidebar isOpen={menuOpen} onClose={closeMenu} collapsed={collapsed} />

        {/* WHY: a aba fica fora da sidebar porque ela corta o que vaza
            (overflow-hidden), e a aba sai para além da borda. */}
        <Tooltip
          content={`${collapseLabel} (${shortcutLabel(COLLAPSE_SHORTCUT.toUpperCase())})`}
          side="right"
        >
          <Button
            variant="ghost"
            className={styles.collapseTab}
            data-collapsed={collapsed || undefined}
            onClick={toggleCollapsed}
            aria-label={collapseLabel}
            aria-expanded={!collapsed}
          >
            <Icon
              name={collapsed ? 'chevron-right' : 'chevron-left'}
              className={styles.collapseIcon}
            />
          </Button>
        </Tooltip>

        {menuOpen && (
          <Button
            type="button"
            className={styles.appLayoutOverlay}
            onClick={closeMenu}
            aria-label="Fechar menu"
          />
        )}

        <AppLayoutContent />
      </Box>
    </Box>
  )
}
