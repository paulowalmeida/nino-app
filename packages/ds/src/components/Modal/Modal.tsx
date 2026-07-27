import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { mergeClasses } from '@ds/lib/mergeClasses'

import { ModalProps, ModalSize } from './Modal.types'

const sizeClasses: Record<ModalSize, string> = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
}

const baseBackdrop = 'modal-animated-overlay fixed inset-0 z-50 bg-ink/45'

const basePositioner = 'fixed inset-0 z-50 flex items-center justify-center p-4'

const baseContent =
  'modal-animated-content relative overflow-hidden rounded-card bg-white ' +
  'shadow-overlay outline-none'

const baseClose =
  'absolute right-4 top-3.5 rounded-card p-1 text-faint transition-colors ' +
  'hover:text-ink focus-visible:outline-2 focus-visible:outline-brand ' +
  'focus-visible:outline-offset-2'

/* Cabeçalho e rodapé são faixas rebaixadas, não regiões separadas por fio:
 * a mesma superfície `surface-sunk` que marca 'aqui se opera' nos campos. */
const headerWrapper = 'bg-surface-sunk px-6 py-4 pr-12'
const bodyWrapper = 'px-6 py-5'
const footerWrapper =
  'flex items-center justify-end gap-3 bg-surface-sunk px-6 py-4'

export function Modal({
  header,
  body,
  footer,
  size = 'md',
  ariaLabel,
  open,
  onOpenChange,
}: ModalProps) {
  return (
    <ArkDialog.Root
      open={open}
      onOpenChange={({ open: o }) => onOpenChange?.(o)}
    >
      <Portal>
        <ArkDialog.Backdrop className={baseBackdrop} />
        <ArkDialog.Positioner className={basePositioner}>
          <ArkDialog.Content
            aria-label={ariaLabel}
            className={mergeClasses(baseContent, sizeClasses[size])}
          >
            <ArkDialog.CloseTrigger className={baseClose} aria-label="Close">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </ArkDialog.CloseTrigger>

            {header && <div className={headerWrapper}>{header}</div>}
            {body && <div className={bodyWrapper}>{body}</div>}
            {footer && <div className={footerWrapper}>{footer}</div>}
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}
