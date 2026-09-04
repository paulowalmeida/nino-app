import { Box } from '@nino/ds/components/Box'
import { Combobox } from '@nino/ds/components/Combobox'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Select } from '@nino/ds/components/Select'
import type { AddressSearchResult } from '@nino/lib/types/address/address-lookup'
import { AddressFields } from '@shared/components/AddressFields/AddressFields'
import type { Recipient } from '@shared/types/order/recipient'
import type { DeliveryCity } from '@shared/types/store/delivery-city'

import styles from './DeliveryRecipientFields.module.css'

type DeliveryRecipientFieldsProps = {
  isDelivery?: boolean
  value: Recipient
  storeAddress: { city: string; state: string }
  deliveryCities: DeliveryCity[]
  addressSuggestions: AddressSearchResult[]
  isSearchingAddress: boolean
  onChange: (patch: Partial<Recipient>) => void
}

export const DeliveryRecipientFields = ({
  isDelivery = true,
  value,
  storeAddress,
  deliveryCities,
  addressSuggestions,
  isSearchingAddress,
  onChange,
}: DeliveryRecipientFieldsProps) => {
  const streetQuery = value.street
  const suggestions = addressSuggestions

  const addressOptions = suggestions.map((suggestion) => ({
    value: suggestion.zipCode,
    label: `${suggestion.street} · ${suggestion.neighborhood} · ${suggestion.zipCode}`,
  }))

  if (
    value.zipCode &&
    value.street &&
    !addressOptions.some((option) => option.value === value.zipCode)
  ) {
    addressOptions.unshift({
      value: value.zipCode,
      label: value.street,
    })
  }

  const streetField = (
    <Combobox
      options={addressOptions}
      value={value.zipCode ?? ''}
      inputValue={streetQuery}
      placeholder="Digite o logradouro"
      ariaLabel="Logradouro"
      emptyMessage={
        streetQuery.trim().length < 3
          ? 'Digite pelo menos 3 caracteres'
          : 'Nenhum endereço encontrado'
      }
      loading={isSearchingAddress}
      onInputValueChange={(query) => {
        onChange({ street: query })
      }}
      onValueChange={(zipCode) => {
        const suggestion = suggestions.find((item) => item.zipCode === zipCode)

        if (!suggestion) return

        onChange(suggestion)
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

      {isDelivery && (
        <FormField
          label={
            <FieldHint
              label="Cidade"
              hint="A unidade atende toda a cidade principal e pode cobrir parcialmente as cidades adicionais."
            />
          }
        >
          <Select
            options={deliveryCities.map((item) => ({
              value: `${item.city}|${item.state}`,
              label: `${item.city} · ${item.state}`,
            }))}
            value={`${value.city || storeAddress.city}|${value.state || storeAddress.state}`}
            aria-label="Cidade de entrega"
            onValueChange={(selected) => {
              const [city, state] = selected.split('|')
              onChange({
                city,
                state,
                zipCode: '',
                street: '',
                neighborhood: '',
              })
            }}
          />
        </FormField>
      )}

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
        showCityAndState={!isDelivery}
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
