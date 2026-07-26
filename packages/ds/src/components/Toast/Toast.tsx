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
 * The whole card carries the status: the panel is read across a counter and a
 * kitchen, from a step back, where the fill lands before anyone parses the
 * words. Everything on top of it — text, close, timer — is one contrasting
 * tone, so a saturated surface never turns into a colour puzzle.
 */
const surfaceClass: Record<ToastVariant, string> = {
  default: 'bg-body border-white/12',
  success: 'bg-success border-white/15',
  error: 'bg-danger border-white/15',
  warning: 'bg-warning-bright border-black/10',
  loading: 'bg-body border-white/12',
}

type ToastTone = {
  title: string
  description: string
  icon: string
  action: string
  close: string
  track: string
  timer: string
}

const onFill: ToastTone = {
  title: 'text-cream',
  description: 'text-white/80',
  icon: 'text-white',
  action:
    'bg-white/15 text-cream hover:bg-white/25 focus-visible:ring-white/70',
  close:
    'text-white/55 hover:bg-white/15 hover:text-white ' +
    'focus-visible:ring-white/70',
  track: 'bg-black/20',
  timer: 'bg-white/90',
}

/* Mustard is the one surface light enough to need ink on top of it. */
const onMustard: ToastTone = {
  title: 'text-ink',
  description: 'text-ink/75',
  icon: 'text-ink',
  action: 'bg-black/10 text-ink hover:bg-black/20 focus-visible:ring-ink/60',
  close:
    'text-ink/50 hover:bg-black/10 hover:text-ink focus-visible:ring-ink/60',
  track: 'bg-black/15',
  timer: 'bg-ink/80',
}

const toneClass: Record<ToastVariant, ToastTone> = {
  default: onFill,
  success: onFill,
  error: onFill,
  warning: onMustard,
  loading: onFill,
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
const rootClass = 'relative flex w-[min(24rem,calc(100vw-2rem))]'

/* The visible card is a layer inside the root, never the root itself: Ark
 * hangs ghost elements off the root that stretch past its bounds to bridge the
 * gap between cards, and they keep the deck open while the pointer travels
 * from one card to the next. Clipping the root would eat them, and the stack
 * would collapse mid-hover. */
const cardClass =
  'toast-card relative flex h-full w-full gap-3 overflow-hidden ' +
  'rounded-[14px] border pb-3 pl-4 pr-11 pt-2.5'
const bodyClass = 'flex min-w-0 flex-col gap-0.5'
const titleClass =
  'font-display text-[0.9375rem] font-semibold leading-tight ' +
  'tracking-[-0.01em]'
const descriptionClass = 'text-[0.8125rem] leading-[1.45]'
const actionClass =
  'mt-1.5 self-start rounded-full px-3 py-0.5 text-[0.8125rem] font-semibold ' +
  'transition-colors focus-visible:outline-none focus-visible:ring-2'
const closeClass =
  'absolute right-2 top-2 grid size-7 place-items-center rounded-full ' +
  'transition-colors focus-visible:outline-none focus-visible:ring-2'
const timerTrackClass = 'absolute inset-x-0 bottom-0 h-[2px]'

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
    toneClass[variant].icon
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
        const tone = toneClass[variant]

        return (
          <ArkToast.Root key={t.id} className={rootClass}>
            <div className={mergeClasses(cardClass, surfaceClass[variant])}>
              <ToastIcon variant={variant} />
              <div className={bodyClass}>
                <ArkToast.Title
                  className={mergeClasses(titleClass, tone.title)}
                >
                  {t.title}
                </ArkToast.Title>
                {t.description && (
                  <ArkToast.Description
                    className={mergeClasses(descriptionClass, tone.description)}
                  >
                    {t.description}
                  </ArkToast.Description>
                )}
                {t.action && (
                  <ArkToast.ActionTrigger
                    className={mergeClasses(actionClass, tone.action)}
                  >
                    {t.action.label}
                  </ArkToast.ActionTrigger>
                )}
              </div>
              {t.closable !== false && (
                <ArkToast.CloseTrigger
                  className={mergeClasses(closeClass, tone.close)}
                  aria-label="Close"
                >
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
                <span
                  className={mergeClasses(timerTrackClass, tone.track)}
                  aria-hidden="true"
                >
                  <span
                    className={mergeClasses(
                      'toast-timer block h-full w-full origin-left',
                      tone.timer
                    )}
                  />
                </span>
              )}
            </div>
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
