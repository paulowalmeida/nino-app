import { useState, useSyncExternalStore } from 'react'

import { Toast as ArkToast, Toaster as ArkToaster } from '@ark-ui/react/toast'
import { Icon } from '@ds/components/Icon/Icon'
import { IconName } from '@ds/components/Icon/Icon.types'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import { Spinner } from '../Spinner/Spinner'
import styles from './Toast.module.css'
import {
  ToastContainerProps,
  ToastMeta,
  ToastPlacement,
  ToastProviderProps,
  ToastVariant,
} from './Toast.types'
import {
  configureToasts,
  getActivePlacements,
  getToaster,
  subscribeToPlacements,
} from './toastRegistry'

/*
 * Não existe um componente `Toast` aqui, e não é esquecimento: o cartão não
 * é montado no JSX como os outros: ele é disparado por chamada
 * (`toast.success('Salvo')`) e vive num store de módulo, de onde o `Toaster`
 * do Ark os desenha. O que se monta é o `ToastContainer`, uma vez por app.
 *
 * O arquivo se chama `Toast.tsx` porque o `exports` do pacote resolve
 * `@nino/ds/components/Toast` para `Toast/Toast.tsx` — o nome é o caminho
 * público, não a promessa de um componente com esse nome.
 */
export { toast } from './toast'

const statusIcon: Record<Exclude<ToastVariant, 'loading'>, IconName> = {
  default: 'status-info',
  success: 'status-success',
  error: 'status-error',
  warning: 'status-warning',
}

const surfaceClass: Record<ToastVariant, string> = {
  default: styles.surfaceDefault,
  success: styles.surfaceSuccess,
  error: styles.surfaceError,
  warning: styles.surfaceWarning,
  loading: styles.surfaceLoading,
}

/* A marca à esquerda do cartão: um spinner enquanto espera, o símbolo do
 * estado quando há desfecho. */
const ToastIcon = ({ variant }: { variant: ToastVariant }) =>
  variant === 'loading' ? (
    <span className={styles.statusIcon}>
      <Spinner visible size={18} />
    </span>
  ) : (
    <Icon name={statusIcon[variant]} className={styles.statusIcon} />
  )

/* A pilha de cartões de uma quina da tela. Existe uma por quina em uso — o
 * container monta cada uma. */
const ToastStack = ({
  placement,
  className,
}: {
  placement: ToastPlacement
  /**
   * Extra classes on each deck, for an app that needs to dodge fixed chrome
   * of its own
   */
  className?: string
}) => (
  <ArkToaster toaster={getToaster(placement)} className={className}>
    {(t) => {
      const meta = t.meta as ToastMeta | undefined
      const variant = meta?.variant ?? 'default'

      return (
        <ArkToast.Root key={t.id} className={styles.toast}>
          <div className={mergeClasses(styles.card, surfaceClass[variant])}>
            <ToastIcon variant={variant} />
            <div className={styles.textStack}>
              <ArkToast.Title className={styles.title}>
                {t.title}
              </ArkToast.Title>
              {t.description && (
                <ArkToast.Description className={styles.description}>
                  {t.description}
                </ArkToast.Description>
              )}
              {t.action && (
                <ArkToast.ActionTrigger className={styles.actionButton}>
                  {t.action.label}
                </ArkToast.ActionTrigger>
              )}
            </div>
            {t.closable !== false && (
              <ArkToast.CloseTrigger
                className={styles.closeButton}
                aria-label="Fechar"
              >
                <Icon name="x" size="sm" />
              </ArkToast.CloseTrigger>
            )}
            {meta?.timed && (
              <span className={styles.timerTrack} aria-hidden="true">
                <span
                  className={mergeClasses('toast-timer', styles.timerBar)}
                />
              </span>
            )}
          </div>
        </ArkToast.Root>
      )
    }}
  </ArkToaster>
)

/**
 * Kept for symmetry with other providers — the toasts live in a module-level
 * store, so nothing has to wrap the app for them to work.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  return <>{children}</>
}

/**
 * Mounts the decks of toasts. One per app, near the root — the settings
 * given here (placement, duration, how many stack) apply to every toast
 * fired from anywhere.
 *
 * @example
 * <ToastContainer placement="bottom-end" duration={4000} />
 */
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
