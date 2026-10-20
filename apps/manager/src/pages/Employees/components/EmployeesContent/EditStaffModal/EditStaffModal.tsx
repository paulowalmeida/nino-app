import { useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import type { RosterEntry } from '@shared/types/team/roster-entry'

import styles from './EditStaffModal.module.css'

type EditStaffFormValues = {
  name: string
  email: string
}

type EditStaffModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff: RosterEntry | null
  onSave: (values: EditStaffFormValues) => Promise<unknown>
}

export const EditStaffModal = ({
  open,
  onOpenChange,
  staff,
  onSave,
}: EditStaffModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditStaffFormValues>({
    defaultValues: { name: staff?.name ?? '', email: staff?.email ?? '' },
  })

  useEffect(() => {
    if (open) reset({ name: staff?.name ?? '', email: staff?.email ?? '' })
  }, [open, reset, staff])

  const onSubmit = async (values: EditStaffFormValues) => {
    try {
      await onSave(values)
      onOpenChange(false)
    } catch {
      setError('root', {
        message: 'Não foi possível salvar. Confira os dados e tente de novo.',
      })
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      ariaLabel="Editar colaborador"
      header={<h2 className={styles.title}>Editar colaborador</h2>}
      body={
        <form
          id="edit-staff-form"
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <Text as="p" className={styles.hint}>
            Atualize os dados usados por esta pessoa para entrar no painel.
          </Text>

          <FormField label="Nome" error={errors.name?.message}>
            <Input
              autoComplete="name"
              {...register('name', {
                required: 'Informe o nome',
                minLength: {
                  value: 2,
                  message: 'Informe ao menos 2 caracteres',
                },
              })}
            />
          </FormField>

          <FormField label="E-mail" error={errors.email?.message}>
            <Input
              type="email"
              autoComplete="email"
              placeholder="nome@exemplo.com"
              {...register('email', { required: 'Informe o e-mail' })}
            />
          </FormField>

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
          <Button
            type="submit"
            form="edit-staff-form"
            loading={isSubmitting}
            disabled={!isDirty}
          >
            Salvar alterações
          </Button>
        </>
      }
    />
  )
}
