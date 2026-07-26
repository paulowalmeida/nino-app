import {
  createToaster,
  Toast as ArkToast,
  Toaster as ArkToaster,
} from '@ark-ui/react/toast'
import { mergeClasses } from '@ds/lib/mergeClasses'
import { StatusIconName, statusIconPaths } from '@ds/lib/statusIconPaths'

import {
  ToastContainerProps,
  ToastMeta,
  ToastProviderProps,
  ToastVariant,
} from './Toast.types'

/**
 * Tinted surface per status: the panel is used across a counter and a kitchen,
 * where people read the screen from a step back. Color carries the state at
 * that distance; an icon alone does not.
 */
const variantClasses: Record<ToastVariant, string> = {
  default: 'bg-cream border-line',
  success: 'bg-success-surface border-success/25',
  error: 'bg-danger-surface border-danger/25',
  warning: 'bg-warning-surface border-warning/25',
}

const variantAccent: Record<ToastVariant, string> = {
  default: 'bg-muted',
  success: 'bg-success',
  error: 'bg-danger',
  warning: 'bg-warning',
}

const variantIconColor: Record<ToastVariant, string> = {
  default: 'text-muted',
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
}

const iconName: Record<ToastVariant, StatusIconName> = {
  default: 'info',
  success: 'success',
  error: 'error',
  warning: 'warning',
}

/* A largura é fixa aqui: sem ela o Ark encolhe o cartão até uma palavra por
 * linha quando a mensagem tem descrição. */
const rootClass =
  'relative flex w-[min(22rem,calc(100vw-2rem))] gap-3 rounded-[14px] border py-4 pl-5 pr-9 shadow-card overflow-hidden toast-animated'
const titleClass = 'text-sm font-semibold text-ink'
const descriptionClass = 'text-sm text-muted'
const closeClass =
  'absolute right-2 top-2 rounded p-0.5 text-faint hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand'

export const toaster = createToaster({
  placement: 'bottom-end',
  gap: 8,
  offsets: '1rem',
})

export const toast = {
  default: (title: string, description?: string, duration = 4000) =>
    toaster.create({
      title,
      description,
      duration,
      type: 'info',
      meta: { variant: 'default' } as ToastMeta,
    }),
  success: (title: string, description?: string, duration = 4000) =>
    toaster.create({
      title,
      description,
      duration,
      type: 'success',
      meta: { variant: 'success' } as ToastMeta,
    }),
  error: (title: string, description?: string, duration = 4000) =>
    toaster.create({
      title,
      description,
      duration,
      type: 'error',
      meta: { variant: 'error' } as ToastMeta,
    }),
  warning: (title: string, description?: string, duration = 4000) =>
    toaster.create({
      title,
      description,
      duration,
      type: 'warning',
      meta: { variant: 'warning' } as ToastMeta,
    }),
}

export function ToastProvider({ children }: ToastProviderProps) {
  return <>{children}</>
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={mergeClasses(
        'mt-0.5 h-4 w-4 shrink-0',
        variantIconColor[variant]
      )}
      aria-hidden="true"
    >
      <path d={statusIconPaths[iconName[variant]]} />
    </svg>
  )
}

export function ToastContainer({ className }: ToastContainerProps) {
  return (
    <ArkToaster toaster={toaster} className={className}>
      {(t) => {
        const meta = t.meta as ToastMeta | undefined
        const variant = meta?.variant ?? 'default'

        return (
          <ArkToast.Root
            key={t.id}
            className={mergeClasses(rootClass, variantClasses[variant])}
          >
            <span
              className={mergeClasses(
                'absolute left-0 top-0 bottom-0 w-1',
                variantAccent[variant]
              )}
            />
            <ToastIcon variant={variant} />
            <div className="flex flex-col gap-1">
              <ArkToast.Title className={titleClass}>{t.title}</ArkToast.Title>
              {t.description && (
                <ArkToast.Description className={descriptionClass}>
                  {t.description}
                </ArkToast.Description>
              )}
            </div>
            <ArkToast.CloseTrigger className={closeClass} aria-label="Close">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </ArkToast.CloseTrigger>
          </ArkToast.Root>
        )
      }}
    </ArkToaster>
  )
}
