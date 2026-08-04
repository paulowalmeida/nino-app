import { Controller } from 'react-hook-form'
import type {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form'

import { useCheckSlugAvailable } from '@hooks/store/useCheckSlugAvailable'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { Select } from '@nino/ds/components/Select'
import { riseDelay } from '@utils/rise-delay'
import { slugify } from '@utils/slugify'

import type { FirstStoreFormValues } from '../FirstStoreForm'

import styles from '../FirstStoreForm.module.css'
import motion from '@styles/rise.module.css'

export type StoreDetailsFieldsProps = {
  register: UseFormRegister<FirstStoreFormValues>
  errors: FieldErrors<FirstStoreFormValues>
  control: Control<FirstStoreFormValues>
  getValues: UseFormGetValues<FirstStoreFormValues>
  setValue: UseFormSetValue<FirstStoreFormValues>
  typeOptions: { value: string; label: string }[]
}

export const StoreDetailsFields = ({
  register,
  errors,
  control,
  getValues,
  setValue,
  typeOptions,
}: StoreDetailsFieldsProps) => {
  const checkSlugTaken = useCheckSlugAvailable()

  const handleNameBlur = () => {
    const { customName, slug } = getValues()
    if (!slug && customName) setValue('slug', slugify(customName))
  }

  return (
    <section className={styles.group}>
      <p className={`${motion.rise} ${styles.groupTitle}`}>A loja</p>

      <div className={motion.rise} style={riseDelay(180)}>
        <FormField label="Nome da loja" error={errors.customName?.message}>
          <Input
            placeholder="Lanchonete do Zé"
            {...register('customName', {
              required: 'Informe o nome da loja',
              onBlur: handleNameBlur,
            })}
          />
        </FormField>
      </div>

      <div className={motion.rise} style={riseDelay(220)}>
        <FormField
          label="Endereço da loja"
          helperText="É o link que seus clientes vão acessar"
          error={errors.slug?.message}
        >
          <div className={styles.slugField}>
            <span className={styles.slugPrefix}>nino.delivery/</span>
            <Input
              placeholder="lanchonete-do-ze"
              {...register('slug', {
                required: 'Informe o endereço',
                setValueAs: slugify,
                validate: async (value) => {
                  const slug = slugify(value)
                  if (!slug) return 'Informe o endereço'
                  return checkSlugTaken(slug)
                },
              })}
            />
          </div>
        </FormField>
      </div>

      <div className={motion.rise} style={riseDelay(260)}>
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
      </div>
    </section>
  )
}
