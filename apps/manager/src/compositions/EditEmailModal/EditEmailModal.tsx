import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
import type {
  EditEmailFormValues,
  EditEmailModalProps,
} from './EditEmailModal.types'

import styles from './EditEmailModal.module.css'

export const EditEmailModal = ({
  open,
  onOpenChange,
  title,
  hint,
  currentEmail,
  onSave,
}: EditEmailModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditEmailFormValues>({
    defaultValues: { email: currentEmail ?? '' },
  })

  useEffect(() => {
    if (open) reset({ email: currentEmail ?? '' })
  }, [open, currentEmail, reset])

  const onSubmit = async ({ email }: EditEmailFormValues) => {
    try {
      await onSave(email)
      onOpenChange(false)
    } catch {
      setError('root', {
        message: 'Não foi possível salvar. Confira o e-mail e tente de novo.',
      })
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      ariaLabel={title}
      header={<h2 className={styles.title}>{title}</h2>}
      body={
        <form
          id="edit-email-form"
          onSubmit={handleSubmit(onSubmit)}
          className={styles.form}
        >
          <p className={styles.hint}>{hint}</p>

          <FormField label="E-mail" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="nome@exemplo.com"
              {...register('email', { required: 'Informe o e-mail' })}
            />
          </FormField>

          {errors.root && <p className={styles.error}>{errors.root.message}</p>}
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
            form="edit-email-form"
            loading={isSubmitting}
            disabled={!isDirty}
          >
            Salvar e-mail
          </Button>
        </>
      }
    />
  )
}
