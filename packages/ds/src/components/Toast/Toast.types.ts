import { ReactNode } from 'react'

import { ToastPlacement as ArkToastPlacement } from '@ark-ui/react/toast'

export type ToastVariant =
  | 'default'
  | 'success'
  | 'error'
  | 'warning'
  | 'loading'

/** Where the stack docks on the viewport. */
export type ToastPlacement = ArkToastPlacement

export type ToastAction = {
  label: string
  onClick: () => void
}

export type ToastOptions = {
  description?: string
  /** Milliseconds on screen. `Infinity` keeps it until dismissed. */
  duration?: number
  /** Overrides the default corner for this toast only. */
  placement?: ToastPlacement
  /** Single next step, labelled with the verb it performs. */
  action?: ToastAction
  /** Set to false to hide the close button. */
  closable?: boolean
  /** Reuse an id to replace a toast instead of stacking a new one. */
  id?: string
  /** 1 shows first, 8 last. Defaults to 4. */
  priority?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
}

/** Description-only shorthand: `toast.success('Saved', 'Menu is live')`. */
export type ToastInput = string | ToastOptions

export type ToastPromiseMessages<T> = {
  loading: string
  success?: string | ((data: T) => string)
  error?: string | ((error: unknown) => string)
}

export type ToastSettings = {
  placement?: ToastPlacement
  /** Default milliseconds on screen. */
  duration?: number
  /** Visible at once; the rest queue. */
  max?: number
  /** Pixels between cards when the deck is expanded. */
  gap?: number
  /** Distance from the viewport edge, any CSS length. */
  offset?: string
  /** Collapse the stack into a deck that fans open on hover. */
  overlap?: boolean
  /** Hold the timers while the browser tab is in the background. */
  pauseOnPageIdle?: boolean
}

export type ToastMeta = {
  variant: ToastVariant
  timed: boolean
}

export type ToastProviderProps = {
  children: ReactNode
}

export type ToastContainerProps = ToastSettings & {
  className?: string
}
