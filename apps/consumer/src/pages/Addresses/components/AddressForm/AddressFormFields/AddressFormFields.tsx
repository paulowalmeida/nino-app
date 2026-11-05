import { useState } from 'react'

import { useWatch } from 'react-hook-form'
import type { UseFormReturn } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import { AddressSuggestionList } from '@shared/components/AddressSuggestionList/AddressSuggestionList'
import { useStoreAddressSearch } from '@shared/hooks/useStoreAddressSearch/useStoreAddressSearch'

import { AddressZipCodeField } from '../AddressZipCodeField/AddressZipCodeField'
import styles from './AddressFormFields.module.css'

type AddressFormFieldsProps = {
  form: UseFormReturn<SaveAddressRequest>
  storeId: string | undefined
  storeState: string | undefined
}

const required = (value: string) => value.trim() !== '' || 'Campo obrigatório'

export const AddressFormFields = ({
  form,
  storeId,
  storeState,
}: AddressFormFieldsProps) => {
  const { register, formState, control, setValue } = form
  const stateField = register('state', { validate: required })
  const [isLookupRequested, setIsLookupRequested] = useState(false)
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const [searchedAddress, setSearchedAddress] = useState('')
  const street = useWatch({ control, name: 'street' }) ?? ''
  const number = useWatch({ control, name: 'number' }) ?? ''
  const state = useWatch({ control, name: 'state' }) ?? ''
  const addressSearch = useStoreAddressSearch(
    storeId,
    state || storeState,
    street,
    number,
    isLookupRequested
  )

  const startAddressLookup = () => {
    if (!street.trim() || !number.trim()) return
    const typedAddress = `${street.trim()}, ${number.trim()}`
    if (typedAddress === searchedAddress) return

    setSearchedAddress(typedAddress)
    setSelectionError(null)
    setIsLookupRequested(true)
  }

  const selectAddress = async (placeId: string) => {
    setIsLookupRequested(false)
    try {
      const address = await addressSearch.resolveSelectedAddress(placeId)
      const options = { shouldDirty: true, shouldValidate: true }
      setValue('zipCode', address.zipCode, options)
      setValue('street', address.street, options)
      setValue('number', address.number || number, options)
      setValue('neighborhood', address.neighborhood, options)
      setValue('city', address.city, options)
      setValue('state', address.state, options)
      setSearchedAddress(`${address.street}, ${address.number || number}`)
    } catch {
      setSelectionError('A loja não entrega nesse endereço.')
    }
  }

  const isConfirmingAddress =
    isLookupRequested || addressSearch.isResolvingSelectedAddress

  return (
    <>
      <Box className={styles.pair}>
        <FormField
          label="Rua"
          labelVariant="compact"
          error={formState.errors.street?.message}
        >
          <Input
            autoComplete="address-line1"
            className={styles.addressFormFieldsInput}
            {...register('street', {
              validate: required,
              onBlur: startAddressLookup,
            })}
          />
        </FormField>
        <FormField
          label="Nº"
          labelVariant="compact"
          error={formState.errors.number?.message}
        >
          <Input
            inputMode="numeric"
            className={styles.addressFormFieldsInput}
            {...register('number', {
              validate: required,
              onBlur: startAddressLookup,
            })}
          />
        </FormField>
      </Box>
      {selectionError && (
        <Text size="sm" color="danger">
          {selectionError}
        </Text>
      )}
      {isConfirmingAddress && (
        <Box direction="column" gap={2}>
          <Button
            type="button"
            variant="ghost"
            className={styles.confirmBack}
            disabled={addressSearch.isResolvingSelectedAddress}
            onClick={() => setIsLookupRequested(false)}
          >
            <Icon name="arrow-left" size="sm" />
            Confirme o endereço
          </Button>
          <AddressSuggestionList
            searchedText={`${street}, ${number}`}
            suggestions={addressSearch.suggestions}
            isLoading={
              addressSearch.isSearching ||
              addressSearch.isResolvingSelectedAddress
            }
            onSelect={(placeId) => void selectAddress(placeId)}
          />
        </Box>
      )}
      <FormField
        label={
          <>
            Complemento{' '}
            <Text as="span" className={styles.optional}>
              (opcional)
            </Text>
          </>
        }
        labelVariant="compact"
      >
        <Input
          placeholder="Apto, bloco ou ponto de referência"
          autoComplete="address-line2"
          className={styles.addressFormFieldsInput}
          {...register('complement')}
        />
      </FormField>
      <FormField
        label="Bairro"
        labelVariant="compact"
        error={formState.errors.neighborhood?.message}
      >
        <Input
          autoComplete="address-level3"
          className={styles.addressFormFieldsInput}
          {...register('neighborhood', { validate: required })}
        />
      </FormField>
      <Box className={styles.pairState}>
        <FormField
          label="Cidade"
          labelVariant="compact"
          error={formState.errors.city?.message}
        >
          <Input
            autoComplete="address-level2"
            className={styles.addressFormFieldsInput}
            {...register('city', { validate: required })}
          />
        </FormField>
        <FormField
          label="UF"
          labelVariant="compact"
          error={formState.errors.state?.message}
        >
          <Input
            {...stateField}
            maxLength={2}
            autoComplete="address-level1"
            className={styles.addressFormFieldsInput}
            onChange={(event) => {
              event.target.value = event.target.value.toUpperCase()
              void stateField.onChange(event)
            }}
          />
        </FormField>
      </Box>
      <AddressZipCodeField form={form} />
    </>
  )
}
