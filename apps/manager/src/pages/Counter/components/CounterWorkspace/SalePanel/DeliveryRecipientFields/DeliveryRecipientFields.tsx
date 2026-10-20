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
import { toMovedPinAddress } from '@pages/Counter/utils/toMovedPinAddress/toMovedPinAddress'
import { AddressFields } from '@shared/components/AddressFields/AddressFields'
import type { Recipient } from '@shared/types/order/recipient'
import type { UnitMapLocation } from '@shared/types/store/unit-map-location'

import { AddressConfirmMap } from './AddressConfirmMap/AddressConfirmMap'

import styles from './DeliveryRecipientFields.module.css'

type DeliveryRecipientFieldsProps = {
  value: Recipient
  addressSuggestions: AddressPrediction[]
  isSearchingAddress: boolean
  onChange: (patch: Partial<Recipient>) => void
  resolveSelectedAddress: (placeId: string) => Promise<AddressSearchResult>
  resolveAddressAtPoint: (
    location: UnitMapLocation
  ) => Promise<AddressSearchResult>
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
  resolveAddressAtPoint,
  isResolvingSelectedAddress,
  addressLookupRequested,
  onAddressLookupRequested,
}: DeliveryRecipientFieldsProps) => {
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const [pickedAddress, setPickedAddress] =
    useState<AddressSearchResult | null>(null)
  const [isUpdatingPinAddress, setIsUpdatingPinAddress] = useState(false)
  const searchedAddress = useRef('')
  const addressBeforePinMoves = useRef<AddressSearchResult | null>(null)
  const pinMoveRequest = useRef(0)
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

  const cancelPinMove = () => {
    pinMoveRequest.current += 1
    addressBeforePinMoves.current = null
    setIsUpdatingPinAddress(false)
  }

  const movePin = async (
    shownAddress: AddressSearchResult,
    location: UnitMapLocation
  ) => {
    const addressBeforeMove = addressBeforePinMoves.current ?? shownAddress
    addressBeforePinMoves.current = addressBeforeMove
    const requestId = pinMoveRequest.current + 1
    pinMoveRequest.current = requestId
    setSelectionError(null)
    setIsUpdatingPinAddress(true)
    setPickedAddress({ ...shownAddress, ...location })

    try {
      const addressAtPin = await resolveAddressAtPoint(location)
      if (requestId !== pinMoveRequest.current) return
      setPickedAddress(toMovedPinAddress(addressBeforeMove, addressAtPin))
    } catch {
      if (requestId !== pinMoveRequest.current) return
      setPickedAddress(addressBeforeMove)
      setSelectionError(
        'Não foi possível usar esse ponto: sem endereço ou fora da área de entrega.'
      )
    } finally {
      if (requestId === pinMoveRequest.current) cancelPinMove()
    }
  }

  const confirmPickedAddress = (address: AddressSearchResult) => {
    cancelPinMove()
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

  const pickAnotherAddress = () => {
    cancelPinMove()
    setPickedAddress(null)
  }

  const leaveAddressConfirmation = () => {
    cancelPinMove()
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
      <Skeleton className={styles.mapPlaceholder} />
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
      isUpdatingAddress={isUpdatingPinAddress}
      onPinMove={(location) => void movePin(pickedAddress, location)}
      onConfirm={() => confirmPickedAddress(pickedAddress)}
      onPickAnother={pickAnotherAddress}
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
