import { Toast as ArkToast, Toaster as ArkToaster, createToaster } from '@ark-ui/react/toast'
import { motion } from 'framer-motion'

import { mergeClasses } from '@ds/lib/mergeClasses'

import { ToastContainerProps, ToastMeta, ToastProviderProps, ToastVariant } from './Toast.types'

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

const titleClass = 'text-sm font-semibold'
const descriptionClass = 'text-sm text-gray-500'
const closeClass =
  'absolute right-2 top-2 rounded p-0.5 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

export const toaster = createToaster({
  placement: 'bottom-end',
  gap: 8,
})

export const toast = {
  default: (title: string, description?: string, duration = 4000) =>
    toaster.create({ title, description, duration, type: 'info', meta: { variant: 'default' } as ToastMeta }),
  success: (title: string, description?: string, duration = 4000) =>
    toaster.create({ title, description, duration, type: 'success', meta: { variant: 'success' } as ToastMeta }),
  error: (title: string, description?: string, duration = 4000) =>
    toaster.create({ title, description, duration, type: 'error', meta: { variant: 'error' } as ToastMeta }),
  warning: (title: string, description?: string, duration = 4000) =>
    toaster.create({ title, description, duration, type: 'warning', meta: { variant: 'warning' } as ToastMeta }),
}

export function ToastProvider({ children }: ToastProviderProps) {
  return <>{children}</>
}

export function ToastContainer({ className: _ }: ToastContainerProps) {
  return (
    <ArkToaster toaster={toaster}>
      {(t) => {
        const variant = ((t.meta as ToastMeta | undefined)?.variant) ?? 'default'
        const duration = t.duration ?? 4000

        return (
          <ArkToast.Root
            key={t.id}
            className={mergeClasses(
              'relative flex flex-col gap-1 rounded-lg border p-4 pr-8 shadow-md overflow-hidden toast-animated',
              variantClasses[variant]
            )}
          >
            <span
              className={mergeClasses(
                'absolute left-0 top-0 bottom-0 w-1 rounded-l-lg',
                variantAccent[variant]
              )}
            />
            <ArkToast.Title className={titleClass}>{t.title}</ArkToast.Title>
            {t.description && (
              <ArkToast.Description className={descriptionClass}>
                {t.description}
              </ArkToast.Description>
            )}
            <ArkToast.CloseTrigger className={closeClass} aria-label='Close'>
              <svg
                width='14'
                height='14'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
              >
                <path d='M18 6 6 18M6 6l12 12' />
              </svg>
            </ArkToast.CloseTrigger>
            {duration !== Infinity && (
              <motion.div
                className={mergeClasses(
                  'absolute bottom-0 left-0 h-0.5 opacity-60',
                  variantAccent[variant]
                )}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
              />
            )}
          </ArkToast.Root>
        )
      }}
    </ArkToaster>
  )
}
