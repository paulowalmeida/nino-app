import { useState } from 'react'

import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form'
import { useWatch } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Icon } from '@nino/ds/components/Icon'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { Text } from '@nino/ds/components/Text'
import { maskZipCode } from '@nino/ds/masks'
import { AddressSuggestionList } from '@shared/components/AddressSuggestionList/AddressSuggestionList'
import { useUnitAddressSearch } from '@shared/hooks/unit/useUnitAddressSearch/useUnitAddressSearch'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/rise.module.css'
import styles from './StoreFormAddressFields.module.css'

type StoreFormAddressFieldsProps = {
  register: UseFormRegister<FirstStoreFormValues>
  errors: FieldErrors<FirstStoreFormValues>
  control: Control<FirstStoreFormValues>
  setValue: UseFormSetValue<FirstStoreFormValues>
}

export const StoreFormAddressFields = ({
  register,
  errors,
  control,
  setValue,
}: StoreFormAddressFieldsProps) => {
  const [isLookupRequested, setIsLookupRequested] = useState(false)
  const [selectionError, setSelectionError] = useState<string | null>(null)
  const [searchedAddress, setSearchedAddress] = useState('')
  const street = useWatch({ control, name: 'street' }) ?? ''
  const number = useWatch({ control, name: 'number' }) ?? ''
  const city = useWatch({ control, name: 'city' }) ?? ''
  const state = useWatch({ control, name: 'state' }) ?? ''
  const addressSearch = useUnitAddressSearch(
    null,
    street,
    number,
    state,
    city,
    isLookupRequested
  )

  const startAddressLookup = () => {
    if (!street.trim() || !number.trim() || !city.trim() || !state.trim()) {
      return
    }
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
      setSelectionError(
        'Não foi possível preencher esse endereço. Escolha outra sugestão.'
      )
    }
  }

  const isConfirmingAddress =
    isLookupRequested || addressSearch.isResolvingSelectedAddress

  return (
    <Box
      as="section"
      direction="column"
      gap={4}
      className={styles.storeFormAddressFields}
    >
      <Text as="p" className={`${motion.rise} ${styles.groupTitle}`}>
        Onde fica
      </Text>

      <Box
        className={`${motion.rise} ${styles.rowCity}`}
        style={riseDelay(300)}
      >
        <FormField label="Cidade" error={errors.city?.message}>
          <Input
            placeholder="Belém"
            autoComplete="address-level2"
            {...register('city', { required: 'Informe a cidade' })}
          />
        </FormField>

        <FormField label="UF" error={errors.state?.message}>
          <Input
            placeholder="PA"
            maxLength={2}
            autoComplete="address-level1"
            {...register('state', { required: 'Informe o estado' })}
          />
        </FormField>
      </Box>

      <Box
        className={`${motion.rise} ${styles.rowLocator}`}
        style={riseDelay(340)}
      >
        <FormField
          label="Logradouro"
          className={styles.streetField}
          error={errors.street?.message}
        >
          <Input
            placeholder="Rua das Flores"
            autoComplete="address-line1"
            {...register('street', {
              required: 'Informe o logradouro',
              onBlur: startAddressLookup,
            })}
          />
        </FormField>

        <FormField
          label="Número"
          className={styles.numberField}
          error={errors.number?.message}
        >
          <Input
            placeholder="123"
            autoComplete="off"
            {...register('number', {
              required: 'Informe o número',
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

      <Box
        className={`${motion.rise} ${styles.rowPlace}`}
        style={riseDelay(380)}
      >
        <FormField label="Complemento (opcional)">
          <Input
            placeholder="Loja 2"
            autoComplete="address-line2"
            {...register('complement')}
          />
        </FormField>

        <FormField label="Bairro" error={errors.neighborhood?.message}>
          <Input
            placeholder="Centro"
            autoComplete="address-level3"
            {...register('neighborhood', { required: 'Informe o bairro' })}
          />
        </FormField>

        <FormField label="CEP" error={errors.zipCode?.message}>
          <MaskedInput
            mask={maskZipCode}
            placeholder="00000-000"
            autoComplete="postal-code"
            error={!!errors.zipCode}
            {...register('zipCode', { required: 'Informe o CEP' })}
          />
        </FormField>
      </Box>
    </Box>
  )
}
