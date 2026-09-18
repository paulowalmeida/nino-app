import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Combobox } from '@nino/ds/components/Combobox'
import { FieldHint } from '@nino/ds/components/FieldHint'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Modal } from '@nino/ds/components/Modal'
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
  const isAddressModalOpen = Boolean(
    addressLookupRequested && !isSearchingAddress
  )

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
        number: address.number || value.number,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        latitude: address.latitude,
        longitude: address.longitude,
      })
      onAddressLookupRequested?.(false)
    } catch {
      setSelectionError('A loja não entrega nesse endereço.')
    }
  }

  const streetField = (
    <Box direction="column" gap={1}>
      <Combobox
        options={addressLookupRequested === undefined ? addressOptions : []}
        value={value.providerId ?? ''}
        inputValue={streetQuery}
        placeholder="Digite o logradouro"
        ariaLabel="Logradouro"
        emptyMessage={
          !value.number.trim()
            ? 'Informe o número para buscar'
            : streetQuery.trim().length < 3
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
        onBlur={() => {
          if (value.street.trim() && value.number.trim()) {
            onAddressLookupRequested?.(true)
          }
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
        onNumberBlur={() => {
          if (value.street.trim() && value.number.trim()) {
            onAddressLookupRequested?.(true)
          }
        }}
      />
      <Modal
        open={isAddressModalOpen}
        onOpenChange={(open) => {
          if (!open) onAddressLookupRequested?.(false)
        }}
        ariaLabel="Confirme o endereço"
        size="lg"
        contentClassName={styles.addressModal}
        header={
          <Box direction="column" gap={1}>
            <Heading level={2} size="md">
              Confirme o endereço
            </Heading>
            <Text size="sm" color="muted">
              Escolha o resultado que corresponde ao endereço informado.
            </Text>
          </Box>
        }
        body={
          <Box direction="column" gap={1.5}>
            {addressOptions.length > 0 ? (
              addressOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="ghost"
                  onClick={() => void selectPrediction(option.value)}
                  className={styles.addressOption}
                >
                  {option.label}
                </Button>
              ))
            ) : (
              <Text color="muted">
                Nenhum endereço encontrado. Confira o logradouro e o número.
              </Text>
            )}
          </Box>
        }
      />
    </Box>
  )
}
