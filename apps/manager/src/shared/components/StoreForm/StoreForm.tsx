import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { SLUG_TAKEN_MESSAGE } from '@shared/constants/store.constants'
import { STORE_DRAFT_KEY } from '@shared/constants/store-draft.constants'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'
import type { StoreSubmitResult } from '@shared/types/store/store-submit-result'
import { clearDraft, readDraft, writeDraft } from '@shared/utils/form-draft/form-draft'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import { StoreFormAddressFields } from './StoreFormAddressFields/StoreFormAddressFields'
import { StoreFormDetailsFields } from './StoreFormDetailsFields/StoreFormDetailsFields'

import motion from '@styles/rise.module.css'
import styles from './StoreForm.module.css'

type FirstStoreFormProps = {
  typeOptions: { value: string; label: string }[]
  onSubmitStore: (data: FirstStoreFormValues) => Promise<StoreSubmitResult>
  onChange?: (values: Partial<FirstStoreFormValues>) => void
  submitLabel?: string
}

export const StoreForm = ({
  typeOptions,
  onSubmitStore,
  onChange,
  submitLabel = 'Criar loja',
}: FirstStoreFormProps) => {
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

  const onSubmit = async (data: FirstStoreFormValues) => {
    const result = await onSubmitStore(data)

    if (result.status === 'success') {
      clearDraft(STORE_DRAFT_KEY)
      return
    }

    if (result.status === 'slug-taken') {
      setError('slug', { message: SLUG_TAKEN_MESSAGE })
      return
    }

    if (result.status === 'offline') {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {draft && (
        <Text
          as="p"
          size="sm"
          color="brand-strong"
          role="status"
          className={mergeClasses(motion.rise, styles.draftNotice)}
        >
          <Icon name="rotate-ccw" size="xs" />
          Continuamos de onde você parou.
        </Text>
      )}

      <StoreFormDetailsFields
        register={register}
        errors={errors}
        control={control}
        getValues={getValues}
        setValue={setValue}
        typeOptions={typeOptions}
      />

      <Box mt={6} className={styles.addressGroup}>
        <StoreFormAddressFields
          register={register}
          errors={errors}
          setValue={setValue}
          setError={setError}
        />
      </Box>

      {errors.root && (
        <Box mt={6}>
          <Alert variant="error">{errors.root.message}</Alert>
        </Box>
      )}

      <Box
        direction={{ mobile: 'column', tablet: 'row' }}
        justify={{ tablet: 'end' }}
        className={mergeClasses(motion.rise, styles.actions)}
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
      </Box>
    </form>
  )
}
