import { FC, useEffect, useState } from 'react'

import {
  Action,
  Close,
  Description,
  Provider,
  Root,
  Title,
  Viewport,
} from '@radix-ui/react-toast'

import { mergeClasses } from '@ds/lib/mergeClasses'

import {
  ToastProps,
  ToastProviderProps,
  ToastVariant,
  ToastViewportProps,
} from './Toast.types'

const variantClasses: Record<ToastVariant, string> = {
  default: 'bg-white border-gray-200 text-gray-900',
  success: 'bg-white border-green-500 text-gray-900',
  error: 'bg-white border-red-500 text-gray-900',
  warning: 'bg-white border-yellow-500 text-gray-900',
}

const variantAccent: Record<ToastVariant, string> = {
  default: 'bg-gray-500',
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
}

/**
 * Provider that must wrap the app to enable Toast rendering.
 * Place it at the root layout alongside `<ToastViewport />`.
 *
 * @example
 * <ToastProvider>
 *   {children}
 *   <ToastViewport />
 * </ToastProvider>
 */
export function ToastProvider({ children }: ToastProviderProps) {
  return <Provider>{children}</Provider>
}

/**
 * Fixed viewport where toasts are rendered.
 * Place it inside `<ToastProvider>`, typically at the end of the layout.
 *
 * @param className - Overrides default positioning (useful for isolated contexts like Storybook)
 */
export const ToastViewport: FC<ToastViewportProps> = ({ className }) => {
  return (
    <Viewport
      className={mergeClasses(
        'fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 outline-none',
        className
      )}
    />
  )
}

/**
 * Individual toast notification built on Radix UI Toast.
 * Must be used inside `<ToastProvider>`.
 *
 * @param title - Message displayed in the toast
 * @param description - Optional description below the title
 * @param variant - Visual style of the toast. Default: `default`
 * @param duration - Duration in milliseconds before auto-dismiss. Default: 4000
 * @param open - Controls visibility (controlled mode)
 * @param onOpenChange - Fired when open state changes
 *
 * @example
 * <Toast title="Order confirmed!" variant="success" open={open} onOpenChange={setOpen} />
 */
export function Toast({
  title,
  description,
  variant = 'default',
  duration = 4000,
  dismissLabel = 'Dismiss',
  ...props
}: ToastProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(0))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <Root
      duration={duration}
      className={mergeClasses(
        'relative flex flex-col gap-1 rounded-lg border p-4 pr-8 shadow-md overflow-hidden',
        'data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-in-from-bottom-2',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:slide-out-to-right-4',
        variantClasses[variant]
      )}
      {...props}
    >
      <span
        className={mergeClasses(
          'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
          variantAccent[variant]
        )}
      />
      <Title className="text-sm font-semibold">{title}</Title>
      {description && (
        <Description className="text-sm text-gray-500">{description}</Description>
      )}
      <Close
        aria-label={dismissLabel}
        className="absolute right-2 top-2 rounded p-0.5 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </Close>
      <Action altText={dismissLabel} className="hidden" />
      <div
        className={mergeClasses('absolute bottom-0 right-0 h-0.5 opacity-40', variantAccent[variant])}
        style={{
          width: `${progress}%`,
          transitionProperty: 'width',
          transitionDuration: `${duration}ms`,
          transitionTimingFunction: 'linear',
        }}
      />
    </Root>
  )
}
