import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Button, FormField, Input, Select } from '@nino/ds'

import type { CreateInviteRequest } from '@custom_types/team'

import type { InviteFormProps, InviteFormValues } from './InviteForm.types'

import styles from './InviteForm.module.css'
import motion from '@styles/motion.module.css'

const SEATS = [
  { value: 'STAFF', label: 'Atendente — vê e move pedidos' },
  { value: 'MANAGER', label: 'Gerente — também mexe no cardápio' },
  { value: 'COURIER', label: 'Entregador — recebe as entregas' },
]

const REQUEST_OF: Record<string, CreateInviteRequest['kind']> = {
  STAFF: 'STAFF',
  MANAGER: 'STAFF',
  COURIER: 'COURIER',
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
    const kind = REQUEST_OF[seat]

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
                options={SEATS}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </FormField>
      </div>

      {errors.root && <p className={styles.error}>{errors.root.message}</p>}

      {sentTo && !errors.root && (
        <p className={`${motion.unroll} ${styles.sent}`}>
          Convite enviado para {sentTo}.
        </p>
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
