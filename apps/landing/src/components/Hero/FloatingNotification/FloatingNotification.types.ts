import type { ReactNode } from 'react'

export type FloatingNotificationProps = {
  icon: ReactNode
  iconVariant: 'whatsapp' | 'delivery'
  placement: 'top' | 'bottom'
  title: string
  subtitle: string
}
