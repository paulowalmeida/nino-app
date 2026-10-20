import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { CpfInput } from '@nino/ds/components/CpfInput'
import { FormField } from '@nino/ds/components/FormField'
import { Header } from '@nino/ds/components/Header'
import { Input } from '@nino/ds/components/Input'
import { PasswordInput } from '@nino/ds/components/PasswordInput'
import { PasswordStrength } from '@nino/ds/components/PasswordStrength'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { useRegisterFacade } from '@pages/Register/facades/useRegisterFacade/useRegisterFacade'
import { ACCOUNT_FIELD_RULES } from '@pages/Register/utils/register-field-rules/register-field-rules'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

import styles from './AccountStep.module.css'

export const AccountStep = () => {
  const {
    accountForm: {
      register,
      submit,
      getValues,
      watch,
      formState: { errors, isSubmitting },
    },
  } = useRegisterFacade()

  const password = watch('password')

  return (
    <Box direction="column">
      <RiseIn as="header">
        <Header
          level={1}
          size="2xl"
          align="center"
          title="Crie sua conta"
          description="Comece pelos seus dados de responsável"
        />
      </RiseIn>

      <Box
        as="form"
        direction="column"
        gap={4}
        mt={12}
        onSubmit={submit}
        className={styles.accountStepForm}
      >
        <RiseIn delay={120} className={styles.primaryField}>
          <FormField label="Nome" error={errors.name?.message}>
            <Input
              placeholder="Seu nome"
              autoComplete="name"
              {...register('name', ACCOUNT_FIELD_RULES.name)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={180} className={styles.compactField}>
          <FormField label="Telefone" error={errors.phone?.message}>
            <PhoneInput
              autoComplete="tel"
              error={!!errors.phone}
              {...register('phone', ACCOUNT_FIELD_RULES.phone)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={240} className={styles.primaryField}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              {...register('email', ACCOUNT_FIELD_RULES.email)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={300} className={styles.compactField}>
          <FormField label="CPF" error={errors.cpf?.message}>
            <CpfInput
              autoComplete="off"
              error={!!errors.cpf}
              {...register('cpf', ACCOUNT_FIELD_RULES.cpf)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={360} className={styles.halfField}>
          <FormField label="Senha" error={errors.password?.message}>
            <PasswordInput
              placeholder="••••••••"
              autoComplete="new-password"
              error={!!errors.password}
              {...register('password', ACCOUNT_FIELD_RULES.password)}
            />
          </FormField>
          {password && (
            <PasswordStrength
              password={password}
              className={styles.strengthMeter}
            />
          )}
        </RiseIn>

        <RiseIn delay={420} className={styles.halfField}>
          <FormField
            label="Confirmar senha"
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              placeholder="••••••••"
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Confirme a senha',
                validate: (value) =>
                  value === getValues('password') || 'As senhas não conferem',
              })}
            />
          </FormField>
        </RiseIn>

        {errors.root && (
          <Alert variant="error" className={styles.formFeedback}>
            {errors.root.message}
          </Alert>
        )}

        <RiseIn delay={480} className={styles.accountStepActions}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={styles.continueButton}
            loadingIndicator="dots"
          >
            Continuar
          </Button>
        </RiseIn>
      </Box>
    </Box>
  )
}
