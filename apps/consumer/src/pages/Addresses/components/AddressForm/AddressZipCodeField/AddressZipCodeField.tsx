import type { UseFormReturn } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { maskZipCode, onlyDigits } from '@nino/ds/masks'
import type { SaveAddressRequest } from '@custom_types/address/save-address-request'

import styles from './AddressZipCodeField.module.css'

type AddressZipCodeFieldProps = {
  form: UseFormReturn<SaveAddressRequest>
}

export const AddressZipCodeField = ({ form }: AddressZipCodeFieldProps) => (
  <FormField
    label="CEP"
    labelVariant="compact"
    error={form.formState.errors.zipCode?.message}
  >
    <Box className={styles.zip}>
      <MaskedInput
        {...form.register('zipCode', {
          validate: (value) =>
            onlyDigits(value).length === 8 || 'Informe um CEP válido',
        })}
        mask={maskZipCode}
        placeholder="00000-000"
        autoComplete="postal-code"
        inputMode="numeric"
        className={styles.addressZipCodeFieldInput}
      />
    </Box>
  </FormField>
)
