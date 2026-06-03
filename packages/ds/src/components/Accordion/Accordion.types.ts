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
}
