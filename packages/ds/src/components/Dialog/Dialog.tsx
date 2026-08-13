import { Button } from '@ds/components/Button/Button'
import { Heading } from '@ds/components/Heading/Heading'
import { Modal } from '@ds/components/Modal/Modal'
import { ModalSize } from '@ds/components/Modal/Modal.types'
import { Text } from '@ds/components/Text/Text'

import styles from './Dialog.module.css'

type DialogProps = {
  /** Controlled open state */
  open?: boolean
  /** Fired when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Heading of the dialog */
  title: string
  /** Body text explaining the action */
  description: string
  /** Label for the confirm button. Default: `'Confirmar'` */
  confirmLabel?: string
  /** Label for the cancel button. Default: `'Cancelar'` */
  cancelLabel?: string
  /** Fired when the confirm button is clicked */
  onConfirm: () => void
  /** Fired when the cancel button is clicked */
  onCancel: () => void
  /** Shows loading dots on the confirm button and disables cancel */
  loading?: boolean
  /** Width of the dialog. Default: `sm` */
  size?: ModalSize
}

/**
 * Confirmation dialog built on top of Modal.
 * Renders a title, description, and two action buttons (cancel + confirm).
 * The confirm button uses the tenant's primary brand color.
 *
 * ```tsx
 * <Dialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Excluir item"
 *   description="Esta ação não pode ser desfeita."
 *   onConfirm={handleDelete}
 *   onCancel={() => setOpen(false)}
 * />
 * ```
 */
export function Dialog({
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  size = 'sm',
  ...props
}: DialogProps) {
  return (
    <Modal
      size={size}
      header={
        <Heading level={2} size="md" className={styles.title}>
          {title}
        </Heading>
      }
      body={
        <Text size="sm" color="muted" className={styles.message}>
          {description}
        </Text>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} loading={loading} loadingIndicator="dots">
            {confirmLabel}
          </Button>
        </>
      }
      {...props}
    />
  )
}
