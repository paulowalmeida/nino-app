export type ToastVariant = 'default' | 'success' | 'error' | 'warning'

export interface ToastProps {
  /** Message displayed in the toast */
  title: string
  /** Optional description below the title */
  description?: string
  /** Visual style of the toast. Default: `default` */
  variant?: ToastVariant
  /** Duration in milliseconds before auto-dismiss. Default: 4000 */
  duration?: number
  /** Accessible label for the dismiss button. Default: 'Dismiss' */
  dismissLabel?: string
  /** Controls visibility (controlled mode) */
  open?: boolean
  /** Initial open state (uncontrolled mode) */
  defaultOpen?: boolean
  /** Fired when open state changes */
  onOpenChange?: (open: boolean) => void
}

export interface ToastProviderProps {
  children: React.ReactNode
}

export interface ToastViewportProps {
  className?: string
}
