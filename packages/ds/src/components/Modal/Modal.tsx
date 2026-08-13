import { ReactNode, useId } from 'react'

import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { Icon } from '@ds/components/Icon/Icon'
import { mergeClasses } from '@ds/lib/mergeClasses/mergeClasses'

import styles from './Modal.module.css'
import { ModalSize } from './Modal.types'

type ModalProps = {
  header?: ReactNode
  body?: ReactNode
  footer?: ReactNode
  size?: ModalSize
  ariaLabel?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  dismissible?: boolean
  backdropClassName?: string
  contentClassName?: string
}

const sizeClasses: Record<ModalSize, string> = {
  sm: styles.sizeSmall,
  md: styles.sizeMedium,
  lg: styles.sizeLarge,
}

/**
 * Dialog that stops the screen until it is answered.
 *
 * A dialog has to announce itself by name, or a screen reader says only
 * "dialog" and the person has no idea what opened. The name comes from the
 * header when there is one, and `ariaLabel` covers the case where the header
 * is a drawing, or there is no header at all.
 *
 * It is born closed and stays mounted — see the `Modal, Drawer e Dialog
 * nascem fechados` rule: mounting one already open leaves the Ark pointer
 * lock stuck on `<body>`, and the whole page stops taking clicks.
 *
 * @param header - Title area. Names the dialog for screen readers
 *
 * @param body - The content
 *
 * @param footer - Actions, aligned to the end
 *
 * @param size - Maximum width. Default: `md`
 *
 * @param ariaLabel - Name for screen readers. Required when there is no
 * header, and wins over it when both are given
 *
 * @param dismissible - The X in the corner. Turn it off when whoever opened
 * also closes — a preview that lives while the finger holds it has nowhere
 * to put an X
 *
 * @example
 * <Modal
 *   open={isOpen}
 *   onOpenChange={setOpen}
 *   header={<Heading level={2}>Excluir item</Heading>}
 *   body={<Text>Essa ação não tem volta.</Text>}
 *   footer={<Button onClick={remove}>Excluir</Button>}
 * />
 */
export function Modal({
  header,
  body,
  footer,
  size = 'md',
  ariaLabel,
  open,
  onOpenChange,
  dismissible = true,
  backdropClassName,
  contentClassName,
}: ModalProps) {
  const headerId = useId()
  const isNamedByHeader = !ariaLabel && !!header

  return (
    <ArkDialog.Root
      open={open}
      onOpenChange={({ open: o }) => onOpenChange?.(o)}
      lazyMount
      unmountOnExit
    >
      <Portal>
        {/* `modal-animated-*` são ganchos globais: as regras de entrada e
            saída vivem em globals.css e precisam do nome sem hash. */}
        <ArkDialog.Backdrop
          className={mergeClasses(
            'modal-animated-overlay',
            styles.backdrop,
            backdropClassName
          )}
        />
        <ArkDialog.Positioner className={styles.positioner}>
          <ArkDialog.Content
            aria-label={ariaLabel}
            aria-labelledby={isNamedByHeader ? headerId : undefined}
            className={mergeClasses(
              'modal-animated-content',
              styles.panel,
              sizeClasses[size],
              contentClassName
            )}
          >
            {dismissible && (
              <ArkDialog.CloseTrigger
                className={styles.closeButton}
                aria-label="Fechar"
              >
                <Icon name="x" size="sm" />
              </ArkDialog.CloseTrigger>
            )}

            {header && (
              <div
                id={headerId}
                className={
                  dismissible ? styles.header : styles.headerFullWidth
                }
              >
                {header}
              </div>
            )}
            {body && <div className={styles.body}>{body}</div>}
            {footer && <div className={styles.footer}>{footer}</div>}
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    </ArkDialog.Root>
  )
}
