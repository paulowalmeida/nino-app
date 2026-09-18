import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Combobox } from '@nino/ds/components/Combobox'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'
import type {
  AddressPrediction,
  AddressSearchResult,
} from '@nino/lib/types/address/address-lookup'
import { AddressFields } from '@shared/components/AddressFields/AddressFields'
import type { Recipient } from '@shared/types/order/recipient'

import styles from './DeliveryRecipientFields.module.css'

type DeliveryRecipientFieldsProps = {
  value: Recipient
  addressSuggestions: AddressPrediction[]
  isSearchingAddress: boolean
  onChange: (patch: Partial<Recipient>) => void
  resolveSelectedAddress: (placeId: string) => Promise<AddressSearchResult>
  isResolvingSelectedAddress: boolean
}

export const DeliveryRecipientFields = ({
  value,
  addressSuggestions,
  isSearchingAddress,
  onChange,
  resolveSelectedAddress,
  isResolvingSelectedAddress,
}: DeliveryRecipientFieldsProps) => {
  const [selectionError, setSelectionError] = useState<string | null>(null)

  const clearAddressSelection = (patch: Partial<Recipient>) =>
    onChange({
      ...patch,
      providerId: undefined,
      latitude: undefined,
      longitude: undefined,
    })

  const streetQuery = value.street
  const suggestions = addressSuggestions

  const addressOptions = suggestions.map((suggestion) => ({
    value: suggestion.placeId,
    label: suggestion.description,
    inputLabel: suggestion.mainText,
  }))

  const selectPrediction = async (placeId: string) => {
    setSelectionError(null)
    try {
      const address = await resolveSelectedAddress(placeId)
      onChange({
        providerId: address.providerId,
        zipCode: address.zipCode,
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        latitude: address.latitude,
        longitude: address.longitude,
      })
    } catch {
      setSelectionError('A loja não entrega nesse endereço.')
    }
  }

  const streetField = (
    <Box direction="column" gap={1}>
      <Combobox
        options={addressOptions}
        value={value.providerId ?? ''}
        inputValue={streetQuery}
        placeholder="Digite o logradouro"
        ariaLabel="Logradouro"
        emptyMessage={
          streetQuery.trim().length < 3
            ? 'Digite pelo menos 3 caracteres'
            : 'Nenhum endereço encontrado'
        }
        loading={isSearchingAddress || isResolvingSelectedAddress}
        shouldFilterOptions={false}
        onInputValueChange={(query) => {
          setSelectionError(null)
          clearAddressSelection({
            street: query,
            zipCode: undefined,
            neighborhood: '',
            city: undefined,
            state: undefined,
          })
        }}
        onValueChange={(placeId) => {
          void selectPrediction(placeId)
        }}
      />
      {selectionError && (
        <Text size="xs" color="danger">
          {selectionError}
        </Text>
      )}
    </Box>
  )

  return (
    <Box direction="column" gap={3}>
      <Box className={styles.identity}>
        <FormField label="Nome de quem pediu">
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
        zipCodeLabel={
          <FieldHint
            label="CEP"
            hint="Digite o CEP para preencher o endereço."
          />
        }
        streetLabel={
          <FieldHint
            label="Logradouro"
            hint="Ou digite o logradouro para buscar o endereço."
          />
        }
        onChange={clearAddressSelection}
      />
    </Box>
  )
}
