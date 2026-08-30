import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'
import { toStoreSlug } from '@shared/adapters/store-slug.adapter/store-slug.adapter'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'
import { StoreFormAddressFields } from '@shared/components/StoreForm/StoreFormAddressFields/StoreFormAddressFields'

import styles from './TenantStep.module.css'

export const TenantStep = () => {
  const {
    account,
    company,
    goToCompanyStep,
    tenantForm: {
      register,
      submit,
      setValue,
      setError,
      fillSlugFromName,
      formState: { errors, isSubmitting },
    },
  } = useRegisterFacade()

  if (!account || !company) return null

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
              autoComplete="off"
              {...register('customName', {
                required: 'Informe o nome da unidade',
                onBlur: fillSlugFromName,
              })}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={180} className={styles.identityField}>
          <FormField label="Endereço público" error={errors.slug?.message}>
            <Box gap={1.5} align="center" direction="row">
              <Input
                placeholder="lanchonete-do-ze"
                autoComplete="off"
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
