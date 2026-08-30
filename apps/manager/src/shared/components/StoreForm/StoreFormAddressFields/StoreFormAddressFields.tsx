import { useState } from 'react'

import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { maskZipCode } from '@nino/ds/masks'
import { lookupZipCode, onlyDigits } from '@nino/lib/services/zip-code.service'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/rise.module.css'
import styles from './StoreFormAddressFields.module.css'

export type StoreFormAddressFieldsProps = {
  register: UseFormRegister<FirstStoreFormValues>
  errors: FieldErrors<FirstStoreFormValues>
  setValue: UseFormSetValue<FirstStoreFormValues>
  setError: UseFormSetError<FirstStoreFormValues>
}

export const StoreFormAddressFields = ({
  register,
  errors,
  setValue,
  setError,
}: StoreFormAddressFieldsProps) => {
  const [isLookingUp, setIsLookingUp] = useState(false)

  const handleZipCodeBlur = async (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    const zipCode = event.target.value
    if (onlyDigits(zipCode).length !== 8) return

    setIsLookingUp(true)
    const address = await lookupZipCode(zipCode).finally(() =>
      setIsLookingUp(false)
    )

    if (!address) {
      setError('zipCode', { message: 'CEP não encontrado' })
      return
    }

    setValue('street', address.street)
    setValue('neighborhood', address.neighborhood)
    setValue('city', address.city)
    setValue('state', address.state)
  }

  return (
    <Box as="section" direction="column" gap={4} className={styles.fields}>
      <p className={`${motion.rise} ${styles.groupTitle}`}>Onde fica</p>

      <div
        className={`${motion.rise} ${styles.rowLocator}`}
        style={riseDelay(300)}
      >
        <FormField
          label="CEP"
          className={styles.zipCodeField}
          error={errors.zipCode?.message}
        >
          <MaskedInput
            mask={maskZipCode}
            placeholder="00000-000"
            autoComplete="postal-code"
            error={!!errors.zipCode}
            {...register('zipCode', {
              required: 'Informe o CEP',
              onBlur: handleZipCodeBlur,
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
            {...register('number', { required: 'Informe o número' })}
          />
        </FormField>

        <FormField
          label="Logradouro"
          className={styles.streetField}
          error={errors.street?.message}
        >
          <Input
            placeholder={isLookingUp ? 'Buscando…' : 'Rua das Flores'}
            autoComplete="address-line1"
            {...register('street', { required: 'Informe o logradouro' })}
          />
        </FormField>
      </div>

      <div
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
      </div>

      <div
        className={`${motion.rise} ${styles.rowCity}`}
        style={riseDelay(420)}
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
      </div>
    </Box>
  )
}
