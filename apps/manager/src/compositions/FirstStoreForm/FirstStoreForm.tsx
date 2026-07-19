import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  Button,
  FormField,
  Input,
  MaskedInput,
  Select,
  maskZipCode,
} from '@nino/ds'

import { useCreateStore } from '@hooks/store/useCreateStore'
import { useStoreTypes } from '@hooks/store/useStoreTypes'
import { lookupZipCode, onlyDigits } from '@services/store/address.service'
import { checkSlug } from '@services/store/store.service'
import { ApiError } from '@utils/api-error'
import { riseDelay } from '@utils/rise-delay'
import { slugify } from '@utils/slugify'

import type { FirstStoreFormValues } from './FirstStoreForm.types'

import styles from './FirstStoreForm.module.css'
import motion from '@layouts/AuthLayout/motion.module.css'

const TAKEN_MESSAGE = 'Este endereço já está em uso'

/**
 * The check is a courtesy: the unique constraint is what actually decides, and
 * the submit surfaces it as a 409. So a throttled or offline lookup lets the
 * form through instead of blocking on an answer we could not get.
 */
const checkSlugTaken = async (slug: string): Promise<true | string> => {
  try {
    const { available } = await checkSlug(slug)
    return available || TAKEN_MESSAGE
  } catch {
    return true
  }
}

export const FirstStoreForm = () => {
  const { data: types = [] } = useStoreTypes()
  const { mutateAsync: createStore } = useCreateStore()
  const [lookingUp, setLookingUp] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FirstStoreFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  })

  const typeOptions = types.map(({ id, name, description }) => ({
    value: id,
    label: description ?? name,
  }))

  const handleNameBlur = () => {
    const { customName, slug } = getValues()
    if (!slug && customName) setValue('slug', slugify(customName))
  }

  const handleZipCodeBlur = async () => {
    const zipCode = getValues('zipCode')
    if (onlyDigits(zipCode).length !== 8) return

    setLookingUp(true)
    const address = await lookupZipCode(zipCode).finally(() =>
      setLookingUp(false)
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

  const onSubmit = async (data: FirstStoreFormValues) => {
    try {
      await createStore({
        ...data,
        slug: slugify(data.slug),
        zipCode: onlyDigits(data.zipCode),
      })
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError('slug', { message: TAKEN_MESSAGE })
        return
      }
      setError('root', {
        message:
          'Não foi possível criar a loja. Confira os dados e tente de novo.',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
            placeholder={lookingUp ? 'Buscando…' : 'Rua das Flores'}
            {...register('street', { required: 'Informe a rua' })}
          />
        </FormField>
      </div>

      <div className={motion.rise} style={riseDelay(380)}>
        <FormField label="Complemento (opcional)">
          <Input placeholder="Loja 2" {...register('complement')} />
        </FormField>
      </div>

      <div className={`${motion.rise} ${styles.row}`} style={riseDelay(420)}>
        <FormField label="Bairro" error={errors.neighborhood?.message}>
          <Input
            placeholder="Centro"
            {...register('neighborhood', { required: 'Informe o bairro' })}
          />
        </FormField>

        <FormField label="Cidade" error={errors.city?.message}>
          <Input
            placeholder="Belém"
            {...register('city', { required: 'Informe a cidade' })}
          />
        </FormField>
      </div>

      <div className={motion.rise} style={riseDelay(460)}>
        <FormField label="Estado" error={errors.state?.message}>
          <Input
            placeholder="PA"
            maxLength={2}
            {...register('state', { required: 'Informe o estado' })}
          />
        </FormField>
      </div>

      {errors.root && <p className={styles.errorText}>{errors.root.message}</p>}

      <div className={motion.rise} style={riseDelay(500)}>
        <Button
          type="submit"
          loading={isSubmitting}
          loadingIndicator="dots"
          className={styles.submit}
        >
          Criar loja
        </Button>
      </div>
    </form>
  )
}
