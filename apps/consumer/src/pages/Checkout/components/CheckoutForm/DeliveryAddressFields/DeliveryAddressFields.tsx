import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { Controller, useWatch } from 'react-hook-form'

import { Collapsible } from '@nino/ds/components/Collapsible'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { Heading } from '@nino/ds/components/Heading'
import { RadioGroup } from '@nino/ds/components/RadioGroup'
import { Spinner } from '@nino/ds/components/Spinner'
import { maskZipCode } from '@nino/ds/masks'
import { ADDRESS_LOOKUP_SKELETON_ROWS } from '@pages/checkout/constants/addressLookupSkeletonRows.constants'
import { useCheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import type { CheckoutFacade } from '@pages/checkout/facades/useCheckoutFacade/useCheckoutFacade'
import { useGuestAddressSearch } from '@pages/checkout/hooks/useGuestAddressSearch/useGuestAddressSearch'
import { brl } from '@utils/money'

import { DisclosureTrigger } from '../DisclosureTrigger/DisclosureTrigger'

import styles from './DeliveryAddressFields.module.css'

/**
 * WHY: espelha a mesma busca de endereço do balcão do manager
 * (DeliveryRecipientFields) — rua+número disparam a busca no Google ao
 * perder o foco, e a tela troca para a lista de sugestões até o cliente
 * confirmar um ponto. Não existe mais busca por CEP; o campo de CEP é só
 * exibição/edição do valor resolvido.
 */
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
  const [isConfirmingAddress, setIsConfirmingAddress] = useState(false)
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const searchedAddress = useRef('')
  const zipCodeField = register('guestZipCode')
  const guestNeighborhoodField = register('guestNeighborhood', {
    required: 'Informe o bairro',
  })
  const guestComplementField = register('guestComplement')
  const guestStreet = useWatch({ control, name: 'guestStreet' }) ?? ''
  const guestNumber = useWatch({ control, name: 'guestNumber' }) ?? ''
  const guestState = useWatch({ control, name: 'guestState' })
  const {
    suggestions,
    isSearching: isSearchingAddress,
    resolveSelectedAddress,
    isResolvingSelectedAddress,
  } = useGuestAddressSearch(
    store?.id,
    guestState || store?.state,
    guestStreet,
    guestNumber,
    isConfirmingAddress
  )
  const isLoadingAddresses = isSearchingAddress || isResolvingSelectedAddress
  const hasDeliveryQuote = !!quote && !isQuoting

  /** WHY: editar rua/número/bairro invalida o ponto já resolvido pelo Google.
   * O CEP some junto — ele veio daquele ponto, e mantê-lo faz a cotação de
   * entrega continuar rodando (e tremendo) atrás de um endereço que o
   * cliente já está reescrevendo. Editar o próprio CEP não deve apagar o
   * que acabou de ser digitado nele, só o ponto resolvido. */
  const clearProviderSelection = () => {
    const options = { shouldDirty: true, shouldValidate: true }
    form.setValue('guestProviderId', undefined, options)
    form.setValue('guestLatitude', undefined, options)
    form.setValue('guestLongitude', undefined, options)
  }

  const clearResolvedAddress = () => {
    clearProviderSelection()
    form.setValue('guestZipCode', '', {
      shouldDirty: true,
      shouldValidate: true,
    })
  }

  const handleManualAddressChange = (
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    event: ChangeEvent<HTMLInputElement>,
    clearZipCode = false
  ) => {
    void onChange(event)
    if (clearZipCode) clearResolvedAddress()
    else clearProviderSelection()
  }

  const handleStreetChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectionError(null)
    form.setValue('guestStreet', event.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    })
    clearResolvedAddress()
  }

  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setValue('guestNumber', event.target.value, {
      shouldDirty: true,
      shouldValidate: true,
    })
    clearResolvedAddress()
  }

  const startAddressLookup = () => {
    const street = guestStreet.trim()
    const number = guestNumber.trim()
    if (!street || !number) return

    const typedAddress = `${street}, ${number}`
    if (typedAddress === searchedAddress.current) return

    searchedAddress.current = typedAddress
    setIsConfirmingAddress(true)
  }

  const selectPrediction = async (placeId: string) => {
    setSelectionError(null)
    setIsConfirmingAddress(false)
    try {
      const address = await resolveSelectedAddress(placeId)
      const options = { shouldDirty: true, shouldValidate: true }
      form.setValue('guestProviderId', address.providerId, options)
      form.setValue('guestZipCode', address.zipCode, options)
      form.setValue('guestStreet', address.street, options)
      form.setValue('guestNumber', address.number || guestNumber, options)
      form.setValue('guestNeighborhood', address.neighborhood, options)
      form.setValue('guestCity', address.city, options)
      form.setValue('guestState', address.state, options)
      form.setValue('guestLatitude', address.latitude, options)
      form.setValue('guestLongitude', address.longitude, options)
      const resolvedNumber = address.number || guestNumber
      searchedAddress.current = `${address.street}, ${resolvedNumber}`
    } catch {
      setSelectionError('A loja não entrega nesse endereço.')
    }
  }

  const addressResults = isLoadingAddresses ? (
    <Box direction="column" gap={1.5} aria-live="polite">
      <Text size="sm" color="muted">
        Procurando {guestStreet}, {guestNumber}…
      </Text>
      {ADDRESS_LOOKUP_SKELETON_ROWS.map((row) => (
        <Skeleton key={row} className={styles.addressOptionPlaceholder} />
      ))}
    </Box>
  ) : suggestions.length > 0 ? (
    <Box direction="column" gap={1.5}>
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.placeId}
          type="button"
          variant="ghost"
          onClick={() => void selectPrediction(suggestion.placeId)}
          className={styles.addressOption}
        >
          <Icon name="map-pin" size="sm" className={styles.addressPin} />
          <Box direction="column" gap={0.5} className={styles.addressText}>
            <Text as="span" size="sm" weight="semibold">
              {suggestion.mainText}
            </Text>
            <Text as="span" size="xs" color="muted">
              {suggestion.secondaryText}
            </Text>
          </Box>
        </Button>
      ))}
    </Box>
  ) : (
    <Text color="muted">
      Nenhum endereço encontrado. Confira o logradouro e o número.
    </Text>
  )

  return (
    <Box className={styles.block}>
      <Heading level={2} size="md" className={styles.blockLabel}>
        Endereço de entrega
      </Heading>

      <FormField error={errors.deliveryZoneId?.message}>
        <Controller
          name="deliveryZoneId"
          control={control}
          rules={{ required: 'Confirme um endereço atendido pela loja' }}
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
                visible={isQuoting}
                label="Calculando a taxa de entrega"
              />
              {hasDeliveryQuote ? (
                <Text as="span" className={styles.deliveryFee}>
                  Taxa de entrega · {brl(quote.fee)}
                </Text>
              ) : (
                <Text color="subtle">
                  {isQuoting
                    ? 'Calculando a taxa de entrega…'
                    : 'Informe o endereço para calcular a entrega.'}
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
      ) : isConfirmingAddress ? (
        <Box direction="column" gap={2} className={styles.confirm}>
          <Button
            type="button"
            variant="ghost"
            className={styles.confirmBack}
            onClick={() => setIsConfirmingAddress(false)}
          >
            <Icon name="arrow-left" size="sm" />
            Confirme o endereço
          </Button>
          <Text size="sm" color="muted">
            A taxa sai do ponto escolhido aqui, não do CEP digitado.
          </Text>
          {selectionError && (
            <Text size="sm" color="danger">
              {selectionError}
            </Text>
          )}
          {addressResults}
        </Box>
      ) : (
        <>
          {selectionError && (
            <Text size="sm" color="danger">
              {selectionError}
            </Text>
          )}

          <Box className={styles.deliveryAddressFieldsRow}>
            <FormField>
              <Input
                placeholder="Rua, avenida, travessa…"
                aria-label="Endereço"
                value={guestStreet}
                onChange={handleStreetChange}
                onBlur={startAddressLookup}
              />
            </FormField>
            <FormField>
              <Input
                placeholder="Nº"
                aria-label="Número"
                inputMode="numeric"
                value={guestNumber}
                onChange={handleNumberChange}
                onBlur={startAddressLookup}
              />
            </FormField>
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
              />
            </Box>
          </Collapsible>

          <Box className={styles.deliveryAddressFieldsRow}>
            <FormField error={errors.guestNeighborhood?.message}>
              <Input
                placeholder="Bairro"
                aria-label="Bairro"
                autoComplete="address-level3"
                error={!!errors.guestNeighborhood}
                {...guestNeighborhoodField}
                onChange={(event) =>
                  handleManualAddressChange(
                    guestNeighborhoodField.onChange,
                    event,
                    true
                  )
                }
              />
            </FormField>
            <FormField error={errors.guestZipCode?.message}>
              <MaskedInput
                {...zipCodeField}
                mask={maskZipCode}
                placeholder="CEP"
                aria-label="CEP"
                autoComplete="postal-code"
                inputMode="numeric"
                onChange={(event) =>
                  handleManualAddressChange(zipCodeField.onChange, event)
                }
              />
            </FormField>
          </Box>
        </>
      )}
    </Box>
  )
}
