import { Flexbox } from '@nino/ds/components/Flexbox'
import { useState } from 'react'
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetError,
  UseFormSetValue,
} from 'react-hook-form'

import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { maskZipCode } from '@nino/ds/masks'
import { lookupZipCode, onlyDigits } from '@nino/lib/services/zip-code.service'
import type { FirstStoreFormValues } from '@custom_types/store/first-store-form-values'
import { riseDelay } from '@utils/rise-delay'

import styles from './StoreFormAddressFields.module.css'
import motion from '@styles/rise.module.css'

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

  const handleZipCodeBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
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
    <Flexbox as="section" direction="column" gap={4}>
      <p className={`${motion.rise} ${styles.groupTitle}`}>Onde fica</p>

      <div className={`${motion.rise} ${styles.row}`} style={riseDelay(300)}>
        <FormField label="CEP" error={errors.zipCode?.message}>
          <MaskedInput
            mask={maskZipCode}
            placeholder="00000-000"
            error={!!errors.zipCode}
            {...register('zipCode', {
              required: 'Informe o CEP',
              onBlur: handleZipCodeBlur,
            })}
          />
        </FormField>

        <FormField label="Número" error={errors.number?.message}>
          <Input
            placeholder="123"
            {...register('number', { required: 'Informe o número' })}
          />
        </FormField>
      </div>

      <div className={motion.rise} style={riseDelay(340)}>
        <FormField label="Rua" error={errors.street?.message}>
          <Input
            placeholder={isLookingUp ? 'Buscando…' : 'Rua das Flores'}
            {...register('street', { required: 'Informe a rua' })}
          />
        </FormField>
      </div>

      <div className={motion.rise} style={riseDelay(380)}>
        <FormField label="Complemento (opcional)">
          <Input placeholder="Loja 2" {...register('complement')} />
        </FormField>
      </div>

      <div
        className={`${motion.rise} ${styles.rowAddress}`}
        style={riseDelay(420)}
      >
        <FormField
          label="Bairro"
          className={styles.neighborhoodField}
          error={errors.neighborhood?.message}
        >
          <Input
            placeholder="Centro"
            {...register('neighborhood', { required: 'Informe o bairro' })}
          />
        </FormField>

        <FormField
          label="Cidade"
          className={styles.cityField}
          error={errors.city?.message}
        >
          <Input
            placeholder="Belém"
            {...register('city', { required: 'Informe a cidade' })}
          />
        </FormField>

        <FormField
          label="UF"
          className={styles.stateField}
          error={errors.state?.message}
        >
          <Input
            placeholder="PA"
            maxLength={2}
            {...register('state', { required: 'Informe o estado' })}
          />
        </FormField>
      </div>
    </Flexbox>
  )
}
