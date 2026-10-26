import { useEffect } from 'react'

import { Controller, useForm } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { Select } from '@nino/ds/components/Select'
import {
  COURIER_SEAT,
  type InviteSeat,
} from '@pages/Employees/adapters/invite-seats.adapter/invite-seats.adapter'
import type { CreateInviteRequest } from '@shared/types/team/create-invite-request'

import styles from './InviteModal.module.css'

const INVITE_FORM_ID = 'invite-member-form'

type InviteFormValues = {
  email: string
  seat: string
}

type InviteModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  seats: InviteSeat[]
  onInvite: (data: CreateInviteRequest) => Promise<unknown>
}

export const InviteModal = ({
  open,
  onOpenChange,
  seats,
  onInvite,
}: InviteModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    defaultValues: { email: '', seat: seats[0].value },
  })

  useEffect(() => {
    if (open) reset({ email: '', seat: seats[0].value })
  }, [open, reset, seats])

  const onSubmit = async ({ email, seat }: InviteFormValues) => {
    const isCourier = seat === COURIER_SEAT

    try {
      await onInvite(
        isCourier
          ? { email, kind: 'COURIER' }
          : { email, kind: 'STAFF', positionId: seat }
      )
      onOpenChange(false)
    } catch {
      setError('root', {
        message: 'Não foi possível enviar o convite. Confira o e-mail.',
      })
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      ariaLabel="Chamar alguém para a loja"
      header={<h2 className={styles.title}>Chamar alguém para a loja</h2>}
      body={
        <form
          id={INVITE_FORM_ID}
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <Box className={styles.fields}>
            <FormField
              label={
                <FieldHint
                  label="E-mail"
                  hint={
                    'A pessoa recebe um convite por e-mail e ' +
                    'entra com a própria senha.'
                  }
                />
              }
              error={errors.email?.message}
            >
              <Input
                type="email"
                autoComplete="email"
                placeholder="nome@exemplo.com"
                {...register('email', {
                  required: 'Informe o e-mail de quem você quer chamar',
                })}
              />
            </FormField>

            <FormField label="Entra como">
              <Controller
                name="seat"
                control={control}
                render={({ field }) => (
                  <Select
                    options={seats}
                    value={field.value}
                    onValueChange={field.onChange}
                  />
                )}
              />
            </FormField>
          </Box>

          {errors.root && <Alert variant="error">{errors.root.message}</Alert>}
        </form>
      }
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form={INVITE_FORM_ID} loading={isSubmitting}>
            Enviar convite
          </Button>
        </>
      }
    />
  )
}
