import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { Controller, useWatch } from 'react-hook-form'

import { Collapsible } from '@nino/ds/components/Collapsible'
import { Box } from '@nino/ds/components/Box'
import { Combobox } from '@nino/ds/components/Combobox'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { Text } from '@nino/ds/components/Text'
import { Heading } from '@nino/ds/components/Heading'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Spinner } from '@nino/ds/components/Spinner'
import { maskZipCode, onlyDigits } from '@nino/ds/masks'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { useGuestAddressLookup } from '@pages/checkout/hooks/useGuestAddressLookup/useGuestAddressLookup'
import { useGuestAddressSearch } from '@pages/checkout/hooks/useGuestAddressSearch/useGuestAddressSearch'
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
    form,
    control,
    register,
    errors,
    zone: quote,
    isQuoting,
    isAuthenticated,
    addresses,
    store,
  } = useCheckoutFacade(checkout)
  const { mutate: lookupAddress, isPending: isLookingUpAddress } =
    useGuestAddressLookup()
  const [lookupStatus, setLookupStatus] = useState<
    'idle' | 'done' | 'notFound'
  >('idle')
  const zipCodeField = register('guestZipCode', {
    required: 'Informe o CEP',
  })
  const guestNumberField = register('guestNumber', {
    required: 'Informe o nº',
  })
  const guestNeighborhoodField = register('guestNeighborhood', {
    required: 'Informe o bairro',
  })
  const guestCityField = register('guestCity', { required: 'Informe a cidade' })
  const guestStateField = register('guestState', {
    required: 'Informe o estado',
  })
  const guestComplementField = register('guestComplement')
  const guestProviderId = useWatch({ control, name: 'guestProviderId' })
  const guestStreet = useWatch({ control, name: 'guestStreet' })
  const guestState = useWatch({ control, name: 'guestState' })
  const { suggestions, isSearching: isSearchingStreet } = useGuestAddressSearch(
    store?.id,
    guestState || store?.state,
    guestStreet
  )
  const hasDeliveryQuote = !!quote && !isLookingUpAddress && !isQuoting

  const clearGuestAddressSelection = (clearZipCode = false) => {
    const options = { shouldDirty: true, shouldValidate: true }
    form.setValue('guestProviderId', undefined, options)
    form.setValue('guestLatitude', undefined, options)
    form.setValue('guestLongitude', undefined, options)
    if (clearZipCode) form.setValue('guestZipCode', '', options)
  }

  const handleStreetInputChange = (street: string) => {
    form.setValue('guestStreet', street, {
      shouldDirty: true,
      shouldValidate: true,
    })
    clearGuestAddressSelection(true)
  }

  const handleManualAddressChange = (
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    void onChange(event)
    clearGuestAddressSelection()
  }

  const applySuggestion = (providerId: string) => {
    const suggestion = suggestions.find((item) => item.id === providerId)
    if (!suggestion) return

    const options = { shouldDirty: true, shouldValidate: true }
    setLookupStatus('done')
    form.setValue('guestProviderId', suggestion.providerId, options)
    form.setValue('guestZipCode', suggestion.zipCode, options)
    form.setValue('guestStreet', suggestion.street, options)
    form.setValue('guestNeighborhood', suggestion.neighborhood, options)
    form.setValue('guestCity', suggestion.city, options)
    form.setValue('guestState', suggestion.state, options)
    form.setValue('guestLatitude', suggestion.latitude, options)
    form.setValue('guestLongitude', suggestion.longitude, options)
    form.setFocus('guestNumber')
  }

  const handleZipCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    void zipCodeField.onChange(event)
    const zipCode = event.target.value
    clearGuestAddressSelection()

    if (onlyDigits(zipCode).length !== 8) {
      setLookupStatus('idle')
      return
    }

    lookupAddress(zipCode, {
      onSuccess: (found) => {
        if (!found) {
          setLookupStatus('notFound')
          return
        }

        const current = form.getValues()
        const options = { shouldDirty: true, shouldValidate: true }
        setLookupStatus('done')
        form.setValue(
          'guestStreet',
          found.street || current.guestStreet,
          options
        )
        form.setValue(
          'guestNeighborhood',
          found.neighborhood || current.guestNeighborhood,
          options
        )
        form.setValue('guestCity', found.city || current.guestCity, options)
        form.setValue('guestState', found.state || current.guestState, options)
        form.setFocus('guestNumber')
      },
      onError: () => setLookupStatus('notFound'),
    })
  }

  return (
    <Box className={styles.block}>
      <Heading level={2} size="md" className={styles.blockLabel}>
        Endereço de entrega
      </Heading>

      <FormField error={errors.deliveryZoneId?.message}>
        <Controller
          name="deliveryZoneId"
          control={control}
          rules={{ required: 'Informe um CEP atendido pela loja' }}
          render={() => (
            <Box
              direction="row"
              align="center"
              gap={2}
              className={`${styles.lookupStatus} ${
                hasDeliveryQuote ? styles.deliveryConfirmed : ''
              }`}
              aria-live="polite"
            >
              <Spinner
                visible={isLookingUpAddress || isQuoting}
                label="Buscando endereço e entrega"
              />
              {hasDeliveryQuote ? (
                <Text as="span" className={styles.deliveryFee}>
                  Taxa de entrega · {brl(quote.fee)}
                </Text>
              ) : (
                <Text color="subtle">
                  {isLookingUpAddress
                    ? 'Buscando endereço pelo CEP…'
                    : isQuoting
                      ? 'Calculando a taxa de entrega…'
                      : lookupStatus === 'done'
                        ? 'Endereço preenchido. Verificando a entrega…'
                        : 'Informe o CEP para buscar o endereço e a entrega.'}
                </Text>
              )}
            </Box>
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
                  description:
                    `${address.neighborhood} · ${address.city}/` +
                    address.state,
                }))}
              />
            )}
          />
        </FormField>
      ) : (
        <>
          <Box className={styles.zipRow}>
            <FormField
              error={
                lookupStatus === 'notFound'
                  ? 'CEP não encontrado. Preencha o endereço.'
                  : errors.guestZipCode?.message
              }
            >
              <MaskedInput
                {...zipCodeField}
                mask={maskZipCode}
                placeholder="CEP"
                aria-label="CEP"
                autoComplete="postal-code"
                inputMode="numeric"
                onChange={handleZipCodeChange}
              />
            </FormField>
            <FormField error={errors.guestNumber?.message}>
              <Input
                placeholder="Nº"
                aria-label="Número"
                inputMode="numeric"
                error={!!errors.guestNumber}
                {...guestNumberField}
                onChange={(event) =>
                  handleManualAddressChange(guestNumberField.onChange, event)
                }
              />
            </FormField>
          </Box>

          <FormField error={errors.guestStreet?.message}>
            <Combobox
              options={suggestions.map((suggestion) => ({
                value: suggestion.id,
                label: `${suggestion.street} · ${suggestion.neighborhood}`,
                inputLabel: suggestion.street,
              }))}
              value={guestProviderId}
              inputValue={guestStreet}
              placeholder="Logradouro"
              ariaLabel="Endereço"
              disabled={isLookingUpAddress}
              loading={isSearchingStreet}
              emptyMessage={
                (guestStreet?.trim().length ?? 0) >= 3
                  ? 'Não encontrado. Continue preenchendo manualmente.'
                  : 'Digite pelo menos 3 caracteres para buscar'
              }
              onInputValueChange={handleStreetInputChange}
              onValueChange={applySuggestion}
            />
          </FormField>

          <FormField error={errors.guestNeighborhood?.message}>
            <Input
              placeholder="Bairro"
              aria-label="Bairro"
              autoComplete="address-level3"
              disabled={isLookingUpAddress}
              error={!!errors.guestNeighborhood}
              {...guestNeighborhoodField}
              onChange={(event) =>
                handleManualAddressChange(
                  guestNeighborhoodField.onChange,
                  event
                )
              }
            />
          </FormField>

          <Box className={styles.row}>
            <Input
              placeholder="Cidade"
              aria-label="Cidade"
              autoComplete="address-level2"
              disabled={isLookingUpAddress}
              error={!!errors.guestCity}
              {...guestCityField}
              onChange={(event) =>
                handleManualAddressChange(guestCityField.onChange, event)
              }
            />
            <Input
              placeholder="UF"
              aria-label="Estado"
              autoComplete="address-level1"
              maxLength={2}
              disabled={isLookingUpAddress}
              error={!!errors.guestState}
              {...guestStateField}
              onChange={(event) =>
                handleManualAddressChange(guestStateField.onChange, event)
              }
            />
          </Box>

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
                {...guestComplementField}
                onChange={(event) =>
                  handleManualAddressChange(
                    guestComplementField.onChange,
                    event
                  )
                }
              />
            </Box>
          </Collapsible>
        </>
      )}
    </Box>
  )
}
