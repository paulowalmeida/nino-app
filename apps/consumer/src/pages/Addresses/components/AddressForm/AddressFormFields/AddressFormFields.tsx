import type { UseFormReturn } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'
import type { AddressLookupStatus } from '@pages/Addresses/types/AddressLookupStatus.type'

import { AddressZipCodeField } from '../AddressZipCodeField/AddressZipCodeField'
import styles from './AddressFormFields.module.css'

type AddressFormFieldsProps = {
  form: UseFormReturn<SaveAddressRequest>
  lookup: AddressLookupStatus
  isLookingUp: boolean
  lookupAddress: Parameters<typeof AddressZipCodeField>[0]['lookupAddress']
  onLookupChange: (status: AddressLookupStatus) => void
}

const required = (value: string) => value.trim() !== '' || 'Campo obrigatório'

export const AddressFormFields = ({
  form,
  lookup,
  isLookingUp,
  lookupAddress,
  onLookupChange,
}: AddressFormFieldsProps) => {
  const { register, formState } = form
  const stateField = register('state', { validate: required })

  return (
    <>
      <AddressZipCodeField
        form={form}
        lookup={lookup}
        isLookingUp={isLookingUp}
        lookupAddress={lookupAddress}
        onLookupChange={onLookupChange}
      />
      <Box className={styles.pair}>
        <FormField
          label="Rua"
          labelVariant="compact"
          error={formState.errors.street?.message}
        >
          <Input
            autoComplete="address-line1"
            className={styles.input}
            {...register('street', { validate: required })}
          />
        </FormField>
        <FormField
          label="Nº"
          labelVariant="compact"
          error={formState.errors.number?.message}
        >
          <Input
            inputMode="numeric"
            className={styles.input}
            {...register('number', { validate: required })}
          />
        </FormField>
      </Box>
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
          className={styles.input}
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
          className={styles.input}
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
            className={styles.input}
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
            className={styles.input}
            onChange={(event) => {
              event.target.value = event.target.value.toUpperCase()
              void stateField.onChange(event)
            }}
          />
        </FormField>
      </Box>
    </>
  )
}
