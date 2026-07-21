import { ReactNode } from 'react'

export interface AccordionItem {
  value: string
  trigger: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItem[]
  /** Allows multiple items to be open at the same time */
  multiple?: boolean
  defaultValue?: string[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  className?: string
  /** Classes extras por item — para superfícies com tema próprio (ex.: dark). */
  itemClassName?: string
  /** Classes extras por trigger — para superfícies com tema próprio. */
  triggerClassName?: string
  /** Classes extras por painel de conteúdo — para superfícies com tema próprio. */
  contentClassName?: string
}
