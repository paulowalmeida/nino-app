import { Link, useParams } from 'react-router'
import { useWatch } from 'react-hook-form'

import { FormField } from '@nino/ds/components/FormField'
import { Box } from '@nino/ds/components/Box'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { isCompletePhone } from '@utils/phone'

import styles from './GuestContactFields.module.css'

export const GuestContactFields = ({
  checkout,
}: {
  checkout?: CheckoutFacade
}) => {
  const { slug } = useParams()
  const { register, errors, control } = useCheckoutFacade(checkout)
  const phone = useWatch({ control, name: 'guestPhone' }) ?? ''
  const base = slug ? `/${slug}` : ''
  const returnTo = `${base}/checkout`
  const signInHref = `${base}/entrar?returnTo=${encodeURIComponent(returnTo)}`

  return (
    <Box className={styles.block}>
      <Heading level={2} size="md" className={styles.blockLabel}>
        Seus dados
      </Heading>

      <FormField
        error={errors.guestPhone?.message}
        helperText="Também usamos para avisar sobre o pedido"
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

      {isCompletePhone(phone) && (
        <Box className={styles.returningCustomer}>
          <Box className={styles.returningCopy}>
            <Text weight="semibold">Já usou este número?</Text>
            <Text size="sm" color="muted">
              Confirme por código para recuperar seu nome e endereços.
            </Text>
          </Box>
          <Link
            to={signInHref}
            state={{ phone }}
            className={styles.returningAction}
          >
            Recuperar dados
            <Icon name="arrow-right" size="sm" />
          </Link>
        </Box>
      )}

      <FormField error={errors.guestName?.message}>
        <Input
          placeholder="Seu nome"
          aria-label="Seu nome"
          autoComplete="name"
          error={!!errors.guestName}
          {...register('guestName', { required: 'Informe seu nome' })}
        />
      </FormField>
    </Box>
  )
}
