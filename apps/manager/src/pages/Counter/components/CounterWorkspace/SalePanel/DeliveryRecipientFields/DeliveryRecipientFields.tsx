import { Box } from '@nino/ds/components/Box'
import { Combobox } from '@nino/ds/components/Combobox'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'
import { AddressFields } from '@shared/components/AddressFields/AddressFields'
import type { Recipient } from '@shared/types/order/recipient'

import styles from './DeliveryRecipientFields.module.css'

type DeliveryRecipientFieldsProps = {
  value: Recipient
  addressSuggestions: AddressSearchResult[]
  isSearchingAddress: boolean
  onChange: (patch: Partial<Recipient>) => void
}

export const DeliveryRecipientFields = ({
  value,
  addressSuggestions,
  isSearchingAddress,
  onChange,
}: DeliveryRecipientFieldsProps) => {
  const streetQuery = value.street
  const suggestions = addressSuggestions

  const addressOptions = suggestions.map((suggestion) => ({
    value: suggestion.id,
    label: `${suggestion.street} · ${suggestion.neighborhood || suggestion.city} · ${suggestion.zipCode || suggestion.state}`,
    inputLabel: suggestion.street,
  }))

  if (
    value.street &&
    !addressOptions.some((option) => option.value === value.addressId)
  ) {
    addressOptions.unshift({
      value: value.addressId || 'current-address',
      label: value.street,
      inputLabel: value.street,
    })
  }

  const streetField = (
    <Combobox
      options={addressOptions}
      value={value.addressId ?? ''}
      inputValue={streetQuery}
      placeholder="Digite o logradouro"
      ariaLabel="Logradouro"
      emptyMessage={
        streetQuery.trim().length < 3
          ? 'Digite pelo menos 3 caracteres'
          : 'Nenhum endereço encontrado'
      }
      loading={isSearchingAddress}
      shouldFilterOptions={false}
      onInputValueChange={(query) => {
        onChange({
          street: query,
          addressId: undefined,
          latitude: undefined,
          longitude: undefined,
          zipCode: undefined,
          neighborhood: '',
          city: undefined,
          state: undefined,
        })
      }}
      onValueChange={(addressId) => {
        const suggestion = suggestions.find((item) => item.id === addressId)

        if (!suggestion) return

        onChange({
          addressId: suggestion.id,
          zipCode: suggestion.zipCode,
          street: suggestion.street,
          neighborhood: suggestion.neighborhood,
          city: suggestion.city,
          state: suggestion.state,
          latitude: suggestion.latitude,
          longitude: suggestion.longitude,
        })
      }}
    />
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
        onChange={onChange}
      />
    </Box>
  )
}
