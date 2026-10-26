import type { FormEvent } from 'react'
import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { PasswordInput } from '@nino/ds/components/PasswordInput'
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
  const { submitCancel, isCancelling, canCancelTab } = useTableTabDetailFacade()
  const [reason, setReason] = useState('')
  const [supervisorEmail, setSupervisorEmail] = useState('')
  const [supervisorPassword, setSupervisorPassword] = useState('')
  const trimmedReason = reason.trim()
  const needsSupervisor = !canCancelTab
  const isReady =
    Boolean(trimmedReason) &&
    (!needsSupervisor || Boolean(supervisorEmail.trim() && supervisorPassword))

  const cancelTab = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isReady) return
    submitCancel(
      {
        cancelReason: trimmedReason,
        ...(needsSupervisor && {
          supervisorEmail: supervisorEmail.trim(),
          supervisorPassword,
        }),
      },
      {
        onSuccess: () => {
          setReason('')
          setSupervisorEmail('')
          setSupervisorPassword('')
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
          {needsSupervisor && (
            <>
              <Text size="sm" color="muted">
                Um gestor ou dono precisa autorizar com o próprio e-mail e
                senha.
              </Text>
              <FormField label="E-mail do gestor">
                <Input
                  type="email"
                  autoComplete="off"
                  value={supervisorEmail}
                  onChange={(event) => setSupervisorEmail(event.target.value)}
                />
              </FormField>
              <FormField label="Senha do gestor">
                <PasswordInput
                  autoComplete="off"
                  value={supervisorPassword}
                  onChange={(event) =>
                    setSupervisorPassword(event.target.value)
                  }
                />
              </FormField>
            </>
          )}
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
            disabled={!isReady}
          >
            Cancelar comanda
          </Button>
        </Box>
      }
    />
  )
}
