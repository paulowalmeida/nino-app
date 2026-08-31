import type { ChangeEvent } from 'react'
import type { UseFormRegisterReturn, UseFormReturn } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { maskZipCode, onlyDigits } from '@nino/ds/masks'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'

import styles from './AddressZipCodeField.module.css'

export type AddressLookupStatus = 'idle' | 'done' | 'notFound'

type AddressZipCodeFieldProps = {
  form: UseFormReturn<SaveAddressRequest>
  lookup: AddressLookupStatus
  isLookingUp: boolean
  lookupAddress: (
    zipCode: string,
    callbacks: {
      onSuccess: (address: Partial<SaveAddressRequest> | null) => void
      onError: () => void
    }
  ) => void
  onLookupChange: (status: AddressLookupStatus) => void
}

export const AddressZipCodeField = ({
  form,
  lookup,
  isLookingUp,
  lookupAddress,
  onLookupChange,
}: AddressZipCodeFieldProps) => {
  const zipCodeField: UseFormRegisterReturn<'zipCode'> = form.register(
    'zipCode',
    {
      validate: (value) =>
        onlyDigits(value).length === 8 || 'Informe um CEP válido',
    }
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    void zipCodeField.onChange(event)
    const value = event.target.value
    if (onlyDigits(value).length !== 8) {
      onLookupChange('idle')
      return
    }

    lookupAddress(value, {
      onSuccess: (found) => {
        if (!found) {
          onLookupChange('notFound')
          return
        }
        const current = form.getValues()
        const options = { shouldDirty: true, shouldValidate: true }
        onLookupChange('done')
        form.setValue('street', found.street || current.street, options)
        form.setValue(
          'neighborhood',
          found.neighborhood || current.neighborhood,
          options
        )
        form.setValue('city', found.city || current.city, options)
        form.setValue('state', found.state || current.state, options)
        form.setFocus('number')
      },
      onError: () => onLookupChange('notFound'),
    })
  }

  return (
    <FormField
      label="CEP"
      labelVariant="compact"
      error={
        lookup === 'notFound'
          ? 'Não achamos esse CEP. Preencha o endereço abaixo.'
          : form.formState.errors.zipCode?.message
      }
      helperText={isLookingUp ? 'Buscando endereço…' : undefined}
    >
      <Box className={styles.zip}>
        <MaskedInput
          {...zipCodeField}
          mask={maskZipCode}
          placeholder="00000-000"
          autoComplete="postal-code"
          inputMode="numeric"
          className={styles.input}
          onChange={handleChange}
        />
      </Box>
    </FormField>
  )
}
