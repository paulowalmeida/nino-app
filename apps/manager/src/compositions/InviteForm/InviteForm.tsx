import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import type { CreateInviteRequest } from '@custom_types/team'
import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'

import {
  INVITE_FORM_REQUEST_OF,
  INVITE_FORM_SEATS,
} from '@constants/invite-form.constants'
import motion from '@styles/motion.module.css'
import styles from './InviteForm.module.css'

type InviteSeat = 'STAFF' | 'MANAGER' | 'COURIER'

type InviteFormValues = {
  email: string
  seat: InviteSeat
}

type InviteFormProps = {
  onInvite: (data: CreateInviteRequest) => Promise<unknown>
}

export const InviteForm = ({ onInvite }: InviteFormProps) => {
  const [sentTo, setSentTo] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteFormValues>({
    defaultValues: { email: '', seat: 'STAFF' },
  })

  const onSubmit = async ({ email, seat }: InviteFormValues) => {
    const kind = INVITE_FORM_REQUEST_OF[seat]

    try {
      await onInvite({
        email,
        kind,
        role: kind === 'STAFF' ? (seat as 'STAFF' | 'MANAGER') : undefined,
      })
      setSentTo(email)
      reset({ email: '', seat })
    } catch {
      setError('root', {
        message: 'Não foi possível enviar o convite. Confira o e-mail.',
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${motion.settle} ${styles.form}`}
    >
      <div className={styles.copy}>
        <h2 className={styles.title}>Chamar alguém para a loja</h2>
        <p className={styles.hint}>
          A pessoa recebe um convite por e-mail e entra com a própria senha.
        </p>
      </div>

      <div className={styles.fields}>
        <FormField label="E-mail" error={errors.email?.message}>
          <Input
            type="email"
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
                options={INVITE_FORM_SEATS}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </FormField>
      </div>

      {errors.root && <Alert variant="error">{errors.root.message}</Alert>}

      {sentTo && !errors.root && (
        <Alert variant="success" className={motion.unroll}>
          Convite enviado para {sentTo}.
        </Alert>
      )}

      <Button
        type="submit"
        loading={isSubmitting}
        className={`${motion.press} ${styles.submit}`}
      >
        Enviar convite
      </Button>
    </form>
  )
}
