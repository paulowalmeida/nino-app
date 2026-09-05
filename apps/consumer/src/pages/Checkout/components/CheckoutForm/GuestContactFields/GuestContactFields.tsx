import { FormField } from '@nino/ds/components/FormField'
import { Box } from '@nino/ds/components/Box'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Heading } from '@nino/ds/components/Heading'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { isCompletePhone } from '@utils/phone'

import styles from './GuestContactFields.module.css'

export const GuestContactFields = ({
  checkout,
}: {
  checkout?: CheckoutFacade
}) => {
  const { register, errors } = useCheckoutFacade(checkout)

  return (
    <Box className={styles.block}>
      <Heading level={2} size="md" className={styles.blockLabel}>
        Seus dados
      </Heading>

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
