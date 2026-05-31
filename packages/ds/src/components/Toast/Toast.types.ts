import { ReactNode } from 'react'

export type ToastVariant = 'default' | 'success' | 'error' | 'warning'

export interface ToastMeta {
  variant: ToastVariant
}

export interface ToastProviderProps {
  children: ReactNode
}

export interface ToastContainerProps {
  className?: string
}
