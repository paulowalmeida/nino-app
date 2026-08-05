import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { STORE_DRAFT_KEY } from '@constants/drafts'
import { SLUG_TAKEN_MESSAGE } from '@hooks/store/useCheckSlugAvailable'
import { useCreateStore } from '@hooks/store/useCreateStore'
import { useStoreTypes } from '@hooks/store/useStoreTypes'
import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { onlyDigits } from '@nino/lib/services/zip-code'
import type { FirstStoreFormValues } from '@custom_types/store/first-store-form-values'
import { ApiError } from '@utils/api-error'
import { clearDraft, readDraft, writeDraft } from '@utils/form-draft'
import { riseDelay } from '@utils/rise-delay'
import { slugify } from '@utils/slugify'

import { StoreFormAddressFields } from '../StoreFormAddressFields/StoreFormAddressFields'
import { StoreFormDetailsFields } from '../StoreFormDetailsFields/StoreFormDetailsFields'

import styles from './FirstStoreForm.module.css'
import motion from '@styles/rise.module.css'

type FirstStoreFormProps = {
  onChange?: (values: Partial<FirstStoreFormValues>) => void
  onCreated?: (store: { id: string; slug: string }) => string
  submitLabel?: string
}

export const FirstStoreForm = ({
  onChange,
  onCreated,
  submitLabel = 'Criar loja',
}: FirstStoreFormProps) => {
  const { data: types = [] } = useStoreTypes()
  const { mutateAsync: createStore } = useCreateStore(onCreated)
  const [draft] = useState(() =>
    readDraft<FirstStoreFormValues>(STORE_DRAFT_KEY)
  )

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

  /* The draft lands before the first keystroke: whoever mirrors the form
   * (the store sign on the units screen) needs to be born with what is
   * already there. */
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
        setError('slug', { message: SLUG_TAKEN_MESSAGE })
        return
      }

      if (!navigator.onLine) {
        setError('root', {
          message:
            'Você está sem internet. O que já foi preenchido fica ' +
            'salvo — tente de novo quando a conexão voltar.',
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

      <StoreFormDetailsFields
        register={register}
        errors={errors}
        control={control}
        getValues={getValues}
        setValue={setValue}
        typeOptions={typeOptions}
      />

      <div className={styles.addressGroup}>
        <StoreFormAddressFields
          register={register}
          errors={errors}
          setValue={setValue}
          setError={setError}
        />
      </div>

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
