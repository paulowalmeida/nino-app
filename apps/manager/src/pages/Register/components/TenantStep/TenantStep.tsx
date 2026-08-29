import { useNavigate } from 'react-router'

import { useForm } from 'react-hook-form'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'
import { signupErrorMessage } from '@pages/Register/utils/signupErrorMessage/signupErrorMessage'
import { toStoreSlug } from '@shared/adapters/store-slug.adapter/store-slug.adapter'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'
import { StoreFormAddressFields } from '@shared/components/StoreForm/StoreFormAddressFields/StoreFormAddressFields'
import type { FirstStoreFormValues } from '@shared/types/store/first-store-form-values'

import styles from './TenantStep.module.css'

export const TenantStep = () => {
  const navigate = useNavigate()
  const {
    account,
    company,
    goToCompanyStep,
    signup: { mutateAsync: signup },
  } = useRegisterFacade()
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FirstStoreFormValues>({
    mode: 'onTouched',
    defaultValues: {
      customName: company?.name ?? '',
    },
  })

  if (!account || !company) return null

  const submit = handleSubmit(async (data) => {
    try {
      await signup({
        account,
        company,
        tenant: {
          customName: data.customName,
          slug: toStoreSlug(data.slug),
          zipCode: data.zipCode.replace(/\D/g, ''),
          street: data.street,
          number: data.number,
          complement: data.complement || undefined,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
        },
      })
      void navigate('/')
    } catch (error) {
      setError('root', { message: signupErrorMessage(error) })
    }
  })

  return (
    <Box direction="column">
      <RiseIn as="header">
        <Heading level={1} size="2xl" align="center">
          Abra sua unidade
        </Heading>
        <Text size="sm" color="muted" align="center" mt={2}>
          O endereço que seus clientes vão encontrar
        </Text>
      </RiseIn>

      <Box
        as="form"
        direction="column"
        gap={4}
        mt={12}
        onSubmit={submit}
        className={styles.form}
      >
        <RiseIn delay={120} className={styles.identityField}>
          <FormField label="Nome da unidade" error={errors.customName?.message}>
            <Input
              placeholder="Lanchonete do Zé"
              {...register('customName', {
                required: 'Informe o nome da unidade',
                onBlur: () => {
                  const { customName, slug } = getValues()
                  if (!slug && customName) {
                    setValue('slug', toStoreSlug(customName))
                  }
                },
              })}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={180} className={styles.identityField}>
          <FormField
            label="Endereço público"

            error={errors.slug?.message}
          >
            <Box gap={1.5} align="center" direction={'row'}>
              <Input
                placeholder="lanchonete-do-ze"
                {...register('slug', {
                  required: 'Informe o endereço público',
                  setValueAs: toStoreSlug,
                })}
              />
              <Text as="span" className={styles.slugPrefix}>
                .dev.nino.delivery
              </Text>
            </Box>
          </FormField>
        </RiseIn>

        <Box mt={2} className={styles.addressGroup}>
          <StoreFormAddressFields
            register={register}
            errors={errors}
            setValue={setValue}
            setError={setError}
          />
        </Box>

        {errors.root && (
          <Alert variant="error" className={styles.formFeedback}>
            {errors.root.message}
          </Alert>
        )}

        <RiseIn delay={300} className={styles.actions}>
          <Box direction="row" justify="end" gap={2}>
            <Button
              type="button"
              variant="ghost"
              onClick={goToCompanyStep}
              disabled={isSubmitting}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              loadingIndicator="dots"
            >
              Criar conta e unidade
            </Button>
          </Box>
        </RiseIn>
      </Box>
    </Box>
  )
}
