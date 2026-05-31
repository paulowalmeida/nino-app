import { Button } from '@ds/components/Button'
import { Modal } from '@ds/components/Modal'

import { DialogProps } from './Dialog.types'

const headerClass = 'text-base font-semibold text-gray-900'
const bodyClass = 'text-sm text-gray-600'

/**
 * Confirmation dialog built on top of Modal.
 * Renders a title, description, and two action buttons (cancel + confirm).
 * The confirm button uses the tenant's primary brand color.
 *
 * @param title - Heading of the dialog
 *
 * @param description - Body text explaining the action
 *
 * @param confirmLabel - Label for the confirm button. Default: `'Confirmar'`
 *
 * @param cancelLabel - Label for the cancel button. Default: `'Cancelar'`
 *
 * @param onConfirm - Fired when the confirm button is clicked
 *
 * @param onCancel - Fired when the cancel button is clicked
 *
 * @param loading - Shows loading dots on the confirm button and disables cancel
 *
 * @param size - Width of the dialog. Default: `sm`
 *
 * @param open - Controlled open state
 *
 * @param onOpenChange - Fired when open state changes
 *
 * @example
 * <Dialog
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Excluir item"
 *   description="Esta ação não pode ser desfeita."
 *   onConfirm={handleDelete}
 *   onCancel={() => setOpen(false)}
 * />
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
      header={<h2 className={headerClass}>{title}</h2>}
      body={<p className={bodyClass}>{description}</p>}
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
