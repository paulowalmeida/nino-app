import { ReactNode } from 'react'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  header?: ReactNode
  body?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  ariaLabel?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Botão de fechar no canto. Desligue quando quem abriu também fecha — um
   * preview que vive enquanto o dedo segura não tem onde encaixar um X.
   */
  dismissible?: boolean
  /** Extra para o fundo — desfoque, opacidade, cor. */
  backdropClassName?: string
  /** Extra para a superfície, para casos que não cabem nos tamanhos. */
  contentClassName?: string
}
