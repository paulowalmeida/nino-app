import { ReactNode } from 'react'

export interface TabItem {
  value: string
  label: string
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}
