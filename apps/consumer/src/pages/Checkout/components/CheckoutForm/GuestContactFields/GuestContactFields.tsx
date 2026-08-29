import { FormField } from '@nino/ds/components/FormField'
import { Box } from '@nino/ds/components/Box'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { isCompletePhone } from '@utils/phone'

import styles from './GuestContactFields.module.css'

export const GuestContactFields = () => {
  const { register, errors } = useCheckoutFacade()

  return (
    <Box className={styles.block}>
      <Text className={styles.blockLabel}>Quem recebe</Text>

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
            validate: (value) =>
              isCompletePhone(value) || 'Telefone incompleto',
          })}
        />
      </FormField>
    </Box>
  )
}
