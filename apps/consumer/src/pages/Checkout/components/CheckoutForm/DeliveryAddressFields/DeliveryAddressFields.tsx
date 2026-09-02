import { Controller } from 'react-hook-form'

import { Collapsible } from '@nino/ds/components/Collapsible'
import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { Text } from '@nino/ds/components/Text'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { maskZipCode } from '@nino/ds/masks'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { brl } from '@utils/money'

import { DisclosureTrigger } from '../DisclosureTrigger/DisclosureTrigger'

import styles from './DeliveryAddressFields.module.css'

/** WHY: apresenta a zona e o endereço adequado ao tipo de cliente. */
export const DeliveryAddressFields = ({
  checkout,
}: {
  checkout?: CheckoutFacade
}) => {
  const {
    control,
    register,
    errors,
    zone: quote,
    isQuoting,
    isAuthenticated,
    addresses,
  } = useCheckoutFacade(checkout)

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

      {isAuthenticated ? (
        <FormField error={errors.deliveryAddressId?.message}>
          <Controller
            name="deliveryAddressId"
            control={control}
            rules={{ required: 'Selecione um endereço' }}
            render={({ field }) => (
              <RadioGroup
                aria-label="Endereço de entrega"
                variant="card"
                value={field.value}
                onValueChange={field.onChange}
                options={addresses.map((address) => ({
                  value: address.id,
                  label: `${address.street}, ${address.number}`,
                  description: `${address.neighborhood} · ${address.city}/` +
                    address.state,
                }))}
              />
            )}
          />
        </FormField>
      ) : (
        <>
          <MaskedInput
            mask={maskZipCode}
            placeholder="CEP"
            aria-label="CEP"
            autoComplete="postal-code"
            {...register('guestZipCode', { required: 'Informe o CEP' })}
          />

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

          {!isAuthenticated && (
            <Box className={styles.row}>
              <Input
                placeholder="Cidade"
                aria-label="Cidade"
                autoComplete="address-level2"
                error={!!errors.guestCity}
                {...register('guestCity', { required: 'Informe a cidade' })}
              />
              <Input
                placeholder="UF"
                aria-label="Estado"
                autoComplete="address-level1"
                error={!!errors.guestState}
                {...register('guestState', { required: 'Informe o estado' })}
              />
            </Box>
          )}

          <Collapsible
            className={styles.disclosure}
            trigger={
              <DisclosureTrigger>Complemento ou referência</DisclosureTrigger>
            }
          >
            <Box className={styles.disclosureFields}>
              <Input
                placeholder="Apto, bloco ou ponto de referência"
                aria-label="Complemento ou ponto de referência"
                autoComplete="address-line2"
                {...register('guestComplement')}
              />
            </Box>
          </Collapsible>
        </>
      )}
    </Box>
  )
}
