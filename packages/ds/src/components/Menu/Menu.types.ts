import { ReactNode } from 'react'

/* As duas metades da união não saem daqui: quem monta um menu escreve
   objetos literais e o TypeScript encaixa cada um no lado certo. */
type MenuActionItem = {
  value: string
  label: string
  icon?: ReactNode
  disabled?: boolean
  /** Paints the entry as destructive — deleting, revoking, cancelling */
  destructive?: boolean
  onSelect?: () => void
}

type MenuSeparatorItem = {
  separator: true
}

export type MenuItem = MenuActionItem | MenuSeparatorItem
