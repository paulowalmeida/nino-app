"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { NinoLogo } from "@components/NinoLogo"
import { clearTokens, logout } from "@services/auth.service"

import {
  IconBag,
  IconClipboard,
  IconGear,
  IconGrid,
  IconLogout,
  IconUsers,
} from "./_icons"
import type { NavItemDef } from "./nav-item-def"
import styles from "./Sidebar.module.css"
import type { SidebarProps } from "./Sidebar.types"

const navItems: NavItemDef[] = [
  { href: '/painel', label: 'Visão geral', icon: IconGrid },
  { href: '/painel/pedidos', label: 'Pedidos', icon: IconBag },
  { href: '/painel/cardapio', label: 'Cardápio', icon: IconClipboard },
  {
    href: '/painel/colaboradores',
    label: 'Colaboradores',
    icon: IconUsers,
  },
  {
    href: '/painel/configuracoes',
    label: 'Configurações',
    icon: IconGear,
  },
]

function userInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()
}

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await logout()
    } catch {
      // ignora falha — encerra sessão local de qualquer forma
    }
    clearTokens()
    router.push('/entrar')
  }

  const sidebarClass = isOpen
    ? `${styles.sidebar} ${styles.open}`
    : styles.sidebar

  return (
    <aside className={sidebarClass}>
      <div className={styles.logoWrap}>
        <NinoLogo size="sm" tone="light" />
      </div>

      <nav className={styles.nav}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/painel'
              ? pathname === href
              : pathname.startsWith(href)

          const itemClass = active
            ? `${styles.navItem} ${styles.navItemActive}`
            : styles.navItem

          return (
            <Link
              key={href}
              href={href}
              className={itemClass}
              onClick={onClose}
            >
              <Icon className={styles.navIcon} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{userInitials(user.name)}</div>
          <span className={styles.userName}>
            {user.name.split(' ')[0]}
          </span>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={handleLogout}
          aria-label="Sair"
          title="Sair"
        >
          <IconLogout />
        </button>
      </div>
    </aside>
  )
}
