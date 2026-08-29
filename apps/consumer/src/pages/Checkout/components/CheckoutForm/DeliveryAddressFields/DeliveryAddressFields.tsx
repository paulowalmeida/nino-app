import { Controller } from 'react-hook-form'

import { Collapsible } from '@nino/ds/components/Collapsible'
import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { Text } from '@nino/ds/components/Text'
import { maskZipCode } from '@nino/ds/masks'
import { DisclosureTrigger } from '../DisclosureTrigger/DisclosureTrigger'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { brl } from '@utils/money'

import styles from './DeliveryAddressFields.module.css'

/** Zona de entrega + endereço — a metade do formulário que só existe quando
    o pedido sai da loja. */
export const DeliveryAddressFields = () => {
  const {
    control,
    register,
    errors,
    zone: quote,
    isQuoting,
  } = useCheckoutFacade()

  return (
    <Box className={styles.block}>
      <Text className={styles.blockLabel}>Onde entregar</Text>

      <FormField error={errors.deliveryZoneId?.message}>
        <Controller
          name="deliveryZoneId"
          control={control}
          rules={{ required: 'Informe um CEP atendido pela loja' }}
          render={() => (
            <Text color={quote ? 'default' : 'subtle'} aria-live="polite">
              {isQuoting
                ? 'Calculando a taxa de entrega…'
                : quote
                  ? `${quote.name} · ${brl(quote.fee)}`
                  : 'Informe o CEP para calcular a taxa de entrega.'}
            </Text>
          )}
        />
      </FormField>

      <Box className={styles.row}>
        <FormField error={errors.guestStreet?.message}>
          <Input
            placeholder="Rua"
            aria-label="Rua"
            autoComplete="address-line1"
            error={!!errors.guestStreet}
            {...register('guestStreet', { required: 'Informe a rua' })}
          />
        </FormField>
        <FormField error={errors.guestNumber?.message}>
          <Input
            placeholder="Nº"
            aria-label="Número"
            inputMode="numeric"
            error={!!errors.guestNumber}
            {...register('guestNumber', { required: 'Informe o nº' })}
          />
        </FormField>
      </Box>

      <FormField error={errors.guestNeighborhood?.message}>
        <Input
          placeholder="Bairro"
          aria-label="Bairro"
          autoComplete="address-level3"
          error={!!errors.guestNeighborhood}
          {...register('guestNeighborhood', {
            required: 'Informe o bairro',
          })}
        />
      </FormField>

      <Collapsible
        className={styles.disclosure}
        trigger={
          <DisclosureTrigger>Complemento, referência ou CEP</DisclosureTrigger>
        }
      >
        <Box className={styles.disclosureFields}>
          <Input
            placeholder="Apto, bloco ou ponto de referência"
            aria-label="Complemento ou ponto de referência"
            autoComplete="address-line2"
            {...register('guestComplement')}
          />
          <MaskedInput
            mask={maskZipCode}
            placeholder="CEP"
            aria-label="CEP"
            autoComplete="postal-code"
            {...register('guestZipCode')}
          />
        </Box>
      </Collapsible>
    </Box>
  )
}
