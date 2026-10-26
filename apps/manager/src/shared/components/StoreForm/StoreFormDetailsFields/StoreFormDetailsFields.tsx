import type {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { Text } from '@nino/ds/components/Text'
import { toStoreSlug } from '@shared/adapters/store-slug.adapter/store-slug.adapter'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/rise.module.css'
import styles from './StoreFormDetailsFields.module.css'

export type StoreDetailsFieldsProps = {
  register: UseFormRegister<FirstStoreFormValues>
  errors: FieldErrors<FirstStoreFormValues>
  control: Control<FirstStoreFormValues>
  getValues: UseFormGetValues<FirstStoreFormValues>
  setValue: UseFormSetValue<FirstStoreFormValues>
  typeOptions: { value: string; label: string }[]
}

export const StoreFormDetailsFields = ({
  register,
  errors,
  control,
  getValues,
  setValue,
  typeOptions,
}: StoreDetailsFieldsProps) => {
  const handleNameBlur = () => {
    const { customName, slug } = getValues()
    if (!slug && customName) setValue('slug', toStoreSlug(customName))
  }

  return (
    <Box as="section" direction="column" gap={4}>
      <Text as="p" className={`${motion.rise} ${styles.groupTitle}`}>A loja</Text>

      <Box className={motion.rise} style={riseDelay(180)}>
        <FormField label="Nome da loja" error={errors.customName?.message}>
          <Input
            placeholder="Lanchonete do Zé"
            {...register('customName', {
              required: 'Informe o nome da loja',
              onBlur: handleNameBlur,
            })}
          />
        </FormField>
      </Box>

      <Box className={motion.rise} style={riseDelay(220)}>
        <FormField
          label="Endereço da loja"
          helperText="É o link que seus clientes vão acessar"
          error={errors.slug?.message}
        >
          <Box gap={1.5} align="center">
            <Input
              placeholder="lanchonete-do-ze"
              {...register('slug', {
                required: 'Informe o endereço',
                setValueAs: toStoreSlug,
              })}
            />
            <Text as="span" className={styles.slugPrefix}>.dev.nino.delivery</Text>
          </Box>
        </FormField>
      </Box>

      <Box className={motion.rise} style={riseDelay(260)}>
        <FormField label="Tipo" error={errors.typeId?.message}>
          <Controller
            name="typeId"
            control={control}
            rules={{ required: 'Escolha o tipo da loja' }}
            render={({ field }) => (
              <Select
                options={typeOptions}
                placeholder="Selecione"
                error={!!errors.typeId}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </FormField>
      </Box>
    </Box>
  )
}
