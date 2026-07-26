import { useState, useSyncExternalStore } from 'react'

import {
  Toast as ArkToast,
  Toaster as ArkToaster,
  ToastType,
} from '@ark-ui/react/toast'
import { mergeClasses } from '@ds/lib/mergeClasses'
import { StatusIconName, statusIconPaths } from '@ds/lib/statusIconPaths'

import {
  ToastContainerProps,
  ToastInput,
  ToastMeta,
  ToastOptions,
  ToastPlacement,
  ToastPromiseMessages,
  ToastProviderProps,
  ToastVariant,
} from './Toast.types'
import {
  configureToasts,
  getActivePlacements,
  getActiveToasters,
  getToaster,
  getToastSettings,
  subscribeToPlacements,
} from './toastRegistry'

/**
 * The card is a dark counter ticket, not a tinted panel: it never blends into
 * the warm surfaces it lands on, and it holds up on a kitchen screen read from
 * a step back. Status arrives as a luminous mark — icon, action, timer — while
 * the surface stays the same for every variant.
 */
const accentClass: Record<ToastVariant, string> = {
  default: 'text-warm-light',
  success: 'text-success-bright',
  error: 'text-danger-bright',
  warning: 'text-warning-bright',
  loading: 'text-peach',
}

const timerClass: Record<ToastVariant, string> = {
  default: 'bg-warm-light',
  success: 'bg-success-bright',
  error: 'bg-danger-bright',
  warning: 'bg-warning-bright',
  loading: 'bg-peach',
}

const iconName: Record<Exclude<ToastVariant, 'loading'>, StatusIconName> = {
  default: 'info',
  success: 'success',
  error: 'error',
  warning: 'warning',
}

const arkType: Record<ToastVariant, ToastType> = {
  default: 'info',
  success: 'success',
  error: 'error',
  warning: 'warning',
  loading: 'loading',
}

/* Width is pinned here: without it Ark shrinks the card to one word per line
 * as soon as the message carries a description. */
const rootClass =
  'toast-card relative flex w-[min(24rem,calc(100vw-2rem))] gap-3 ' +
  'rounded-[16px] border border-white/10 bg-charcoal pb-4 pl-4 pr-11 pt-3.5 ' +
  'overflow-hidden focus-visible:outline-none'
const bodyClass = 'flex min-w-0 flex-col gap-1'
const titleClass =
  'font-display text-[0.9375rem] font-semibold leading-tight ' +
  'tracking-[-0.01em] text-cream'
const descriptionClass = 'text-[0.8125rem] leading-[1.45] text-white/60'
const actionClass =
  'mt-1.5 self-start rounded-full text-[0.8125rem] font-semibold ' +
  'underline-offset-4 hover:underline focus-visible:outline-none ' +
  'focus-visible:ring-2 focus-visible:ring-warm-light'
const closeClass =
  'absolute right-2.5 top-2.5 grid size-7 place-items-center rounded-full ' +
  'text-white/40 transition-colors hover:bg-white/10 hover:text-cream ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-light'
const timerTrackClass = 'absolute inset-x-0 bottom-0 h-[2px] bg-white/10'

const toOptions = (input?: ToastInput): ToastOptions =>
  typeof input === 'string' ? { description: input } : (input ?? {})

const create = (
  variant: ToastVariant,
  title: string,
  input?: ToastInput
): string => {
  const options = toOptions(input)
  const duration =
    options.duration ??
    (variant === 'loading' ? Infinity : getToastSettings().duration)

  /* Spreading `id: undefined` into the store overwrites the generated id, so
   * optional keys are only set when they carry a value. */
  return getToaster(options.placement).create({
    title,
    duration,
    type: arkType[variant],
    meta: { variant, timed: Number.isFinite(duration) } satisfies ToastMeta,
    ...(options.description && { description: options.description }),
    ...(options.id && { id: options.id }),
    ...(options.action && { action: options.action }),
    ...(options.closable !== undefined && { closable: options.closable }),
    ...(options.priority && { priority: options.priority }),
  })
}

const resolveMessage = <T,>(
  message: string | ((value: T) => string) | undefined,
  value: T,
  fallback: string
) => {
  if (!message) return fallback
  return typeof message === 'function' ? message(value) : message
}

export const toast = {
  default: (title: string, options?: ToastInput) =>
    create('default', title, options),
  success: (title: string, options?: ToastInput) =>
    create('success', title, options),
  error: (title: string, options?: ToastInput) =>
    create('error', title, options),
  warning: (title: string, options?: ToastInput) =>
    create('warning', title, options),
  /** Stays until `toast.update` or `toast.dismiss` replaces it. */
  loading: (title: string, options?: ToastInput) =>
    create('loading', title, options),

  /** Follows a request: one card that turns into its own outcome. */
  promise: <T,>(
    promise: Promise<T> | (() => Promise<T>),
    messages: ToastPromiseMessages<T>,
    options?: ToastOptions
  ) =>
    getToaster(options?.placement).promise(
      promise,
      {
        loading: {
          title: messages.loading,
          meta: { variant: 'loading', timed: false } satisfies ToastMeta,
        },
        success: (data: T) => ({
          title: resolveMessage(messages.success, data, 'Done'),
          duration: options?.duration ?? getToastSettings().duration,
          meta: { variant: 'success', timed: true } satisfies ToastMeta,
        }),
        error: (error: unknown) => ({
          title: resolveMessage(
            messages.error,
            error,
            'That did not go through'
          ),
          duration: options?.duration ?? getToastSettings().duration,
          meta: { variant: 'error', timed: true } satisfies ToastMeta,
        }),
      },
      {
        ...(options?.description && { description: options.description }),
        ...(options?.action && { action: options.action }),
        ...(options?.closable !== undefined && { closable: options?.closable }),
        ...(options?.id && { id: options.id }),
        ...(options?.priority && { priority: options.priority }),
      }
    ),

  /** Rewrites a toast in place — keeps its slot in the stack. */
  update: (
    id: string,
    variant: ToastVariant,
    title: string,
    input?: ToastInput
  ) => {
    const options = toOptions(input)
    getActiveToasters().forEach((toaster) => {
      if (!toaster.isVisible(id)) return
      toaster.update(id, {
        title,
        description: options.description,
        duration: options.duration ?? getToastSettings().duration,
        type: arkType[variant],
        meta: { variant, timed: true } satisfies ToastMeta,
      })
    })
  },

  /** Animates out. Without an id, clears every corner. */
  dismiss: (id?: string) =>
    getActiveToasters().forEach((toaster) => toaster.dismiss(id)),

  /** Drops immediately, no exit animation. */
  remove: (id?: string) =>
    getActiveToasters().forEach((toaster) => toaster.remove(id)),

  /** Changes placement, duration and stacking for the whole app. */
  configure: configureToasts,
}

export function ToastProvider({ children }: ToastProviderProps) {
  return <>{children}</>
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const className = mergeClasses(
    'mt-px size-[18px] shrink-0',
    accentClass[variant]
  )

  if (variant === 'loading') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={mergeClasses(className, 'animate-spin')}
        aria-hidden="true"
      >
        <path d="M12 3a9 9 0 0 1 9 9" />
        <circle cx="12" cy="12" r="9" strokeOpacity="0.25" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d={statusIconPaths[iconName[variant]]} />
    </svg>
  )
}

function ToastStack({
  placement,
  className,
}: {
  placement: ToastPlacement
  className?: string
}) {
  return (
    <ArkToaster toaster={getToaster(placement)} className={className}>
      {(t) => {
        const meta = t.meta as ToastMeta | undefined
        const variant = meta?.variant ?? 'default'

        return (
          <ArkToast.Root key={t.id} className={rootClass}>
            <ToastIcon variant={variant} />
            <div className={bodyClass}>
              <ArkToast.Title className={titleClass}>{t.title}</ArkToast.Title>
              {t.description && (
                <ArkToast.Description className={descriptionClass}>
                  {t.description}
                </ArkToast.Description>
              )}
              {t.action && (
                <ArkToast.ActionTrigger
                  className={mergeClasses(actionClass, accentClass[variant])}
                >
                  {t.action.label}
                </ArkToast.ActionTrigger>
              )}
            </div>
            {t.closable !== false && (
              <ArkToast.CloseTrigger className={closeClass} aria-label="Close">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </ArkToast.CloseTrigger>
            )}
            {meta?.timed && (
              <span className={timerTrackClass} aria-hidden="true">
                <span
                  className={mergeClasses(
                    'toast-timer block h-full w-full origin-left',
                    timerClass[variant]
                  )}
                />
              </span>
            )}
          </ArkToast.Root>
        )
      }}
    </ArkToaster>
  )
}

export function ToastContainer({
  className,
  ...settings
}: ToastContainerProps) {
  /* Runs once, before the first paint: a toast fired during module init (a
   * query-client handler, say) must already read the app's settings. */
  useState(() => {
    if (Object.keys(settings).length > 0) configureToasts(settings)
  })

  const placements = useSyncExternalStore(
    subscribeToPlacements,
    getActivePlacements,
    getActivePlacements
  )

  return (
    <>
      {placements.map((placement) => (
        <ToastStack
          key={placement}
          placement={placement}
          className={className}
        />
      ))}
    </>
  )
}
