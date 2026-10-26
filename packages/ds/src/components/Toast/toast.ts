import { ToastType } from '@ark-ui/react/toast'

import {
  ToastInput,
  ToastMeta,
  ToastOptions,
  ToastPromiseMessages,
  ToastVariant,
} from './Toast.types'
import {
  configureToasts,
  getActiveToasters,
  getToaster,
  getToastSettings,
} from './toastRegistry'

const arkType: Record<ToastVariant, ToastType> = {
  default: 'info',
  success: 'success',
  error: 'error',
  warning: 'warning',
  loading: 'loading',
}

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

const resolveMessage = <T>(
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
  promise: <T>(
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
