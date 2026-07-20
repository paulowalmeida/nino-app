import { ReactNode } from 'react'

export interface MenuActionItem {
  value: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  /** Estilo destrutivo (vermelho) — ex.: excluir */
  destructive?: boolean
  onSelect?: () => void
}

export interface MenuSeparatorItem {
  separator: true
}

export type MenuItem = MenuActionItem | MenuSeparatorItem

export interface MenuProps {
  /** Elemento que abre o menu (ex.: um Button). Recebe os props via asChild. */
  trigger: ReactNode
  items: MenuItem[]
  /** Classes extras do painel — para o app dar o tom dele ao menu. */
  contentClassName?: string
}
