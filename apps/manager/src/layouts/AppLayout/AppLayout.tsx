import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import {
  readSidebarCollapsed,
  writeSidebarCollapsed,
} from '@utils/sidebar-collapse'

import { Sidebar } from './Sidebar'

import styles from './AppLayout.module.css'

export const AppLayout = () => {
  const tenant = useCurrentTenant()
  const [menuOpen, setMenuOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(readSidebarCollapsed)

  const closeMenu = () => setMenuOpen(false)

  /*
   * Com o menu aberto no celular, o que rolava por trás do véu era a página
   * inteira: o dedo passava do menu para o conteúdo e a pessoa voltava para
   * uma tela deslocada. O `overflow` volta ao que era ao fechar, em vez de
   * ficar `''` fixo — telas de altura travada dependem do valor delas.
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
      {/* a marca já está no menu — aqui vale o nome da loja em que se opera */}
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
