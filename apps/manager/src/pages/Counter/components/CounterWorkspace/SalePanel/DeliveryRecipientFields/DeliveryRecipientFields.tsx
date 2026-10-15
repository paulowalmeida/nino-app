import { useRef, useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import type {
  AddressPrediction,
  AddressSearchResult,
} from '@nino/lib/types/address/address-lookup'
import { ADDRESS_LOOKUP_SKELETON_ROWS } from '@pages/Counter/constants/counter.constants'
import { AddressFields } from '@shared/components/AddressFields/AddressFields'
import type { Recipient } from '@shared/types/order/recipient'

import { AddressConfirmMap } from './AddressConfirmMap/AddressConfirmMap'

import styles from './DeliveryRecipientFields.module.css'

type DeliveryRecipientFieldsProps = {
  value: Recipient
  addressSuggestions: AddressPrediction[]
  isSearchingAddress: boolean
  onChange: (patch: Partial<Recipient>) => void
  resolveSelectedAddress: (placeId: string) => Promise<AddressSearchResult>
  isResolvingSelectedAddress: boolean
  addressLookupRequested?: boolean
  onAddressLookupRequested?: (requested: boolean) => void
}

export const DeliveryRecipientFields = ({
  value,
  addressSuggestions,
  isSearchingAddress,
  onChange,
  resolveSelectedAddress,
  isResolvingSelectedAddress,
  addressLookupRequested,
  onAddressLookupRequested,
}: DeliveryRecipientFieldsProps) => {
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const [pickedAddress, setPickedAddress] =
    useState<AddressSearchResult | null>(null)
  const searchedAddress = useRef('')
  const isConfirmingAddress = Boolean(addressLookupRequested)
  const isLoadingAddresses = isSearchingAddress || isResolvingSelectedAddress

  const clearAddressSelection = (patch: Partial<Recipient>) => {
    if ('complement' in patch) {
      onChange(patch)
      return
    }

    onChange({
      ...patch,
      providerId: undefined,
      latitude: undefined,
      longitude: undefined,
    })
  }

  const startAddressLookup = () => {
    const street = value.street.trim()
    const number = value.number.trim()
    if (!street || !number) return

    const typedAddress = `${street}, ${number}`
    if (typedAddress === searchedAddress.current) return

    searchedAddress.current = typedAddress
    onAddressLookupRequested?.(true)
  }

  const selectPrediction = async (placeId: string) => {
    setSelectionError(null)
    try {
      const address = await resolveSelectedAddress(placeId)
      setPickedAddress({ ...address, number: address.number || value.number })
    } catch {
      setSelectionError('A loja não entrega nesse endereço.')
    }
  }

  const confirmPickedAddress = (address: AddressSearchResult) => {
    onChange({
      providerId: address.providerId,
      zipCode: address.zipCode,
      street: address.street,
      number: address.number,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
      latitude: address.latitude,
      longitude: address.longitude,
    })
    searchedAddress.current = `${address.street}, ${address.number}`
    setPickedAddress(null)
    onAddressLookupRequested?.(false)
  }

  const leaveAddressConfirmation = () => {
    setPickedAddress(null)
    onAddressLookupRequested?.(false)
  }

  const streetField = (
    <Input
      placeholder="Rua, avenida, travessa…"
      aria-label="Endereço"
      value={value.street}
      onChange={(event) => {
        setSelectionError(null)
        clearAddressSelection({
          street: event.target.value,
          zipCode: undefined,
          neighborhood: '',
          city: undefined,
          state: undefined,
        })
      }}
      onBlur={startAddressLookup}
    />
  )

  const addressResults = isLoadingAddresses ? (
    <Box direction="column" gap={1.5} aria-live="polite">
      <Text size="sm" color="muted">
        Procurando {value.street}, {value.number}…
      </Text>
      {ADDRESS_LOOKUP_SKELETON_ROWS.map((row) => (
        <Skeleton key={row} className={styles.addressOptionPlaceholder} />
      ))}
    </Box>
  ) : addressSuggestions.length > 0 ? (
    <Box direction="column" gap={1.5}>
      {addressSuggestions.map((suggestion) => (
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

  const confirmationContent = pickedAddress ? (
    <AddressConfirmMap
      address={pickedAddress}
      onConfirm={() => confirmPickedAddress(pickedAddress)}
      onPickAnother={() => setPickedAddress(null)}
    />
  ) : (
    addressResults
  )

  if (isConfirmingAddress) {
    return (
      <Box direction="column" gap={2} className={styles.confirm}>
        <Button
          type="button"
          variant="ghost"
          className={styles.confirmBack}
          onClick={leaveAddressConfirmation}
        >
          <Icon name="arrow-left" size="sm" />
          Confirme o endereço
        </Button>
        <Text size="sm" color="muted">
          A taxa sai do ponto escolhido aqui, não do CEP.
        </Text>
        {selectionError && (
          <Text size="sm" color="danger">
            {selectionError}
          </Text>
        )}
        {confirmationContent}
      </Box>
    )
  }

  return (
    <Box direction="column" gap={3}>
      <Box className={styles.identity}>
        <FormField label="Nome de quem pediu" className={styles.identityName}>
          <Input
            placeholder="Ex.: Ana"
            aria-label="Nome de quem pediu"
            value={value.name}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </FormField>
        <FormField label="Telefone">
          <PhoneInput
            inputMode="tel"
            placeholder="(91) 98888-0000"
            aria-label="Telefone"
            value={value.phone}
            onChange={(event) => onChange({ phone: event.target.value })}
          />
        </FormField>
      </Box>

      {selectionError && (
        <Text size="sm" color="danger">
          {selectionError}
        </Text>
      )}

      {isResolvingSelectedAddress ? (
        <Box direction="column" gap={2.5} aria-live="polite">
          <Text size="sm" color="muted">
            Preenchendo o endereço escolhido…
          </Text>
          {ADDRESS_LOOKUP_SKELETON_ROWS.map((row) => (
            <Skeleton key={row} className={styles.fieldPlaceholder} />
          ))}
        </Box>
      ) : (
        <AddressFields
          value={{
            zipCode: value.zipCode ?? '',
            street: value.street,
            number: value.number,
            complement: value.complement,
            neighborhood: value.neighborhood,
            city: value.city ?? '',
            state: value.state ?? '',
          }}
          streetField={streetField}
          showCityAndState={false}
          leadWith="street"
          streetLabel="Endereço"
          onChange={clearAddressSelection}
          onNumberBlur={startAddressLookup}
        />
      )}
    </Box>
  )
}
