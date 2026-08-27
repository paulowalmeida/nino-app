import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { CnpjInput } from '@nino/ds/components/CnpjInput'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'
import { COMPANY_FIELD_RULES } from '@pages/Register/utils/register-field-rules/register-field-rules'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'
import { firstName } from '@shared/utils/firstName/firstName'

import styles from './CompanyStep.module.css'

export const CompanyStep = () => {
  const {
    account,
    goToAccount,
    companyForm: {
      register,
      submit,
      formState: { errors, isSubmitting },
    },
  } = useRegisterFacade()

  if (!account) return null

  return (
    <Box direction="column">
      <RiseIn as="header">
        <Heading level={1} size="2xl" align="center">
          Sua empresa
        </Heading>
        <Text size="sm" color="muted" align="center" mt={2}>
          Quase lá, {firstName(account.name)}
        </Text>
      </RiseIn>

      <Box as="form" direction="column" gap={4} mt={8} onSubmit={submit}>
        <RiseIn delay={120}>
          <FormField label="Nome" error={errors.company?.name?.message}>
            <Input
              placeholder="Lanchonete do Zé"
              {...register('company.name', COMPANY_FIELD_RULES.name)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={180}>
          <FormField label="CNPJ" error={errors.company?.cnpj?.message}>
            <CnpjInput
              error={!!errors.company?.cnpj}
              {...register('company.cnpj', COMPANY_FIELD_RULES.cnpj)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={240}>
          <FormField
            label="Razão social (opcional)"
            error={errors.company?.legalName?.message}
          >
            <Input
              placeholder="Zé Alimentos LTDA"
              {...register('company.legalName')}
            />
          </FormField>
        </RiseIn>

        {errors.root && <Alert variant="error">{errors.root.message}</Alert>}

        <RiseIn delay={300}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={styles.fullWidthAction}
            loadingIndicator="dots"
          >
            Continuar
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={goToAccount}
            disabled={isSubmitting}
            className={styles.fullWidthAction}
          >
            Voltar
          </Button>
        </RiseIn>
      </Box>
    </Box>
  )
}
