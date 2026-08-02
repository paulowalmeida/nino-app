import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { MaskedInput } from '@nino/ds/components/MaskedInput'
import { Select } from '@nino/ds/components/Select'
import { maskZipCode } from '@nino/ds/masks'
import { lookupZipCode, onlyDigits } from '@nino/lib/services/zip-code'
import { STORE_DRAFT_KEY } from '@constants/drafts'
import { useCreateStore } from '@hooks/store/useCreateStore'
import { useStoreTypes } from '@hooks/store/useStoreTypes'
import { checkSlug } from '@services/store/store.service'
import { ApiError } from '@utils/api-error'
import { clearDraft, readDraft, writeDraft } from '@utils/form-draft'
import { riseDelay } from '@utils/rise-delay'
import { slugify } from '@utils/slugify'

import type {
  FirstStoreFormProps,
  FirstStoreFormValues,
} from './FirstStoreForm.types'

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

export const FirstStoreForm = ({
  onChange,
  onCreated,
  submitLabel = 'Criar loja',
}: FirstStoreFormProps) => {
  const { data: types = [] } = useStoreTypes()
  const { mutateAsync: createStore } = useCreateStore(onCreated)
  const [lookingUp, setLookingUp] = useState(false)
  const [draft] = useState(() => readDraft<FirstStoreFormValues>(STORE_DRAFT_KEY))

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FirstStoreFormValues>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: draft ?? undefined,
  })

  /* O rascunho entra antes da primeira tecla: quem espelha o formulário
   * (a placa da tela de unidades) precisa nascer com o que já está lá. */
  useEffect(() => {
    if (draft) onChange?.(draft)
  }, [draft, onChange])

  useEffect(() => {
    const { unsubscribe } = watch((values) => {
      writeDraft<FirstStoreFormValues>(STORE_DRAFT_KEY, values)
      onChange?.(values)
    })

    return unsubscribe
  }, [watch, onChange])

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

      clearDraft(STORE_DRAFT_KEY)
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setError('slug', { message: TAKEN_MESSAGE })
        return
      }

      if (!navigator.onLine) {
        setError('root', {
          message:
            'Você está sem internet. O que já foi preenchido fica salvo — ' +
            'tente de novo quando a conexão voltar.',
        })
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
      {draft && (
        <p className={`${motion.rise} ${styles.draftNotice}`} role="status">
          Continuamos de onde você parou.
        </p>
      )}

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

      <section className={styles.group}>
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

        <div
          className={`${motion.rise} ${styles.rowAddress}`}
          style={riseDelay(420)}
        >
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

          <FormField label="UF" error={errors.state?.message}>
            <Input
              placeholder="PA"
              maxLength={2}
              {...register('state', { required: 'Informe o estado' })}
            />
          </FormField>
        </div>
      </section>

      {errors.root && (
        <div className={styles.error}>
          <Alert variant="error">{errors.root.message}</Alert>
        </div>
      )}

      <div
        className={`${motion.rise} ${styles.actions}`}
        style={riseDelay(500)}
      >
        <Button
          type="submit"
          loading={isSubmitting}
          loadingIndicator="dots"
          className={styles.submit}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
