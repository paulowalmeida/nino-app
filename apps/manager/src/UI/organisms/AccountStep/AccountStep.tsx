import { Link } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { CpfInput } from '@nino/ds/components/CpfInput'
import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { PasswordInput } from '@nino/ds/components/PasswordInput'
import { PasswordStrength } from '@nino/ds/components/PasswordStrength'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'
import { ACCOUNT_FIELD_RULES } from '@constants/auth.constants'
import type { SignupAccount } from '@custom_types/auth/signup-account'
import { RiseIn } from '@atoms/RiseIn/RiseIn'
import { useAccountForm } from '@hooks/auth/useAccountForm'

import styles from '@styles/authForm.module.css'

export type AccountStepProps = {
  defaultValues?: SignupAccount | null
  onNext: (account: SignupAccount) => void
}

export const AccountStep = ({ defaultValues, onNext }: AccountStepProps) => {
  const {
    register,
    submit,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useAccountForm({ defaultValues, onValid: onNext })

  const password = watch('password')

  return (
    <Box direction="column">
      <RiseIn as="header">
        <Heading level={1} size="2xl" align="center">
          Crie sua conta
        </Heading>
        <Text size="sm" color="muted" align="center" mt={2}>
          Comece pelos seus dados de responsável
        </Text>
      </RiseIn>

      <Box as="form" direction="column" gap={4} mt={8} onSubmit={submit}>
        <RiseIn delay={120}>
          <FormField label="Nome" error={errors.name?.message}>
            <Input
              placeholder="Seu nome"
              {...register('name', ACCOUNT_FIELD_RULES.name)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={180}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register('email', ACCOUNT_FIELD_RULES.email)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={240}>
          <FormField label="Telefone" error={errors.phone?.message}>
            <PhoneInput
              error={!!errors.phone}
              {...register('phone', ACCOUNT_FIELD_RULES.phone)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={300}>
          <FormField label="CPF" error={errors.cpf?.message}>
            <CpfInput
              error={!!errors.cpf}
              {...register('cpf', ACCOUNT_FIELD_RULES.cpf)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={360}>
          <FormField label="Senha" error={errors.password?.message}>
            <PasswordInput
              placeholder="••••••••"
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

        <RiseIn delay={420}>
          <FormField
            label="Confirmar senha"
            error={errors.confirmPassword?.message}
          >
            <PasswordInput
              placeholder="••••••••"
              error={!!errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Confirme a senha',
                validate: (value) =>
                  value === getValues('password') || 'As senhas não conferem',
              })}
            />
          </FormField>
        </RiseIn>

        {errors.root && <Alert variant="error">{errors.root.message}</Alert>}

        <RiseIn delay={480}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={styles.fullWidthAction}
            loadingIndicator="dots"
          >
            Continuar
          </Button>
        </RiseIn>
      </Box>

      <RiseIn delay={540}>
        <Text size="sm" color="muted" align="center" mt={8}>
          Já tem conta?{' '}
          <Link to="/entrar" className={styles.footerLink}>
            Entrar
          </Link>
        </Text>
      </RiseIn>
    </Box>
  )
}
