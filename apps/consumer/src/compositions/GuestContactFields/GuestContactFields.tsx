import type { FieldErrors, UseFormRegister } from 'react-hook-form'

import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import type { CheckoutFormValues } from '@custom_types/checkout/checkout-form-values'
import { isCompletePhone } from '@utils/phone'

import styles from './GuestContactFields.module.css'

type GuestContactFieldsProps = {
  register: UseFormRegister<CheckoutFormValues>
  errors: FieldErrors<CheckoutFormValues>
}

export const GuestContactFields = ({
  register,
  errors,
}: GuestContactFieldsProps) => (
  <div className={styles.block}>
    <p className={styles.blockLabel}>Quem recebe</p>

    <FormField error={errors.guestName?.message}>
      <Input
        placeholder="Seu nome"
        aria-label="Seu nome"
        autoComplete="name"
        error={!!errors.guestName}
        {...register('guestName', { required: 'Informe seu nome' })}
      />
    </FormField>

    <FormField
      error={errors.guestPhone?.message}
      helperText="A loja usa para avisar sobre o pedido"
    >
      <PhoneInput
        aria-label="Telefone"
        autoComplete="tel"
        error={!!errors.guestPhone}
        {...register('guestPhone', {
          required: 'Informe seu telefone',
          validate: (value) => isCompletePhone(value) || 'Telefone incompleto',
        })}
      />
    </FormField>
  </div>
)
