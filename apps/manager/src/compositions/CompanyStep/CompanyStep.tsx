import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { CnpjInput } from '@nino/ds/components/CnpjInput'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { COMPANY_FIELD_RULES } from '@constants/auth.constants'
import type { SignupAccount } from '@custom_types/auth/signup-account'
import { RiseIn } from '@elements/RiseIn/RiseIn'
import { useCompanyForm } from '@hooks/auth/useCompanyForm'

import styles from '@styles/authForm.module.css'

export type CompanyStepProps = {
  account: SignupAccount
  onBack: () => void
  onSignedUp: () => void
}

export const CompanyStep = ({
  account,
  onBack,
  onSignedUp,
}: CompanyStepProps) => {
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useCompanyForm({ account, onSignedUp })

  return (
    <Flexbox direction="column">
      <RiseIn as="header">
        <Heading level={1} size="2xl" align="center">
          Sua empresa
        </Heading>
        <Text size="sm" color="muted" align="center" mt={2}>
          Quase lá, {account.name.split(' ')[0]}
        </Text>
      </RiseIn>

      <Flexbox as="form" direction="column" gap={4} mt={8} onSubmit={submit}>
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
            onClick={onBack}
            disabled={isSubmitting}
            className={styles.fullWidthAction}
          >
            Voltar
          </Button>
        </RiseIn>
      </Flexbox>
    </Flexbox>
  )
}
