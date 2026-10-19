import type { FormEvent } from 'react'
import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import { Textarea } from '@nino/ds/components/Textarea'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'

import styles from './CancelTabDialog.module.css'

const CANCEL_TAB_FORM_ID = 'cancel-tab-form'

type CancelTabDialogProps = {
  open: boolean
  onClose: () => void
}

export const CancelTabDialog = ({ open, onClose }: CancelTabDialogProps) => {
  const { submitCancel, isCancelling } = useTableTabDetailFacade()
  const [reason, setReason] = useState('')
  const trimmedReason = reason.trim()

  const cancelTab = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!trimmedReason) return
    submitCancel(
      { cancelReason: trimmedReason },
      {
        onSuccess: () => {
          setReason('')
          onClose()
        },
      }
    )
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !next && onClose()}
      ariaLabel="Cancelar comanda"
      header={
        <Heading level={2} size="md">
          Cancelar comanda
        </Heading>
      }
      body={
        <form
          id={CANCEL_TAB_FORM_ID}
          onSubmit={cancelTab}
          className={styles.cancelTabDialogFields}
        >
          <Text size="sm" color="muted">
            A comanda é encerrada sem pagamento e não pode ser reaberta.
          </Text>
          <FormField label="Motivo do cancelamento">
            <Textarea
              rows={3}
              value={reason}
              maxLength={280}
              placeholder="Ex.: cliente saiu sem consumir"
              onChange={(event) => setReason(event.target.value)}
            />
          </FormField>
        </form>
      }
      footer={
        <Box direction="row" className={styles.cancelTabDialogActions}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Voltar
          </Button>
          <Button
            type="submit"
            form={CANCEL_TAB_FORM_ID}
            variant="danger"
            loading={isCancelling}
            disabled={!trimmedReason}
          >
            Cancelar comanda
          </Button>
        </Box>
      }
    />
  )
}
