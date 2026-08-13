import { Link } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { PasswordInput } from '@nino/ds/components/PasswordInput'
import { Text } from '@nino/ds/components/Text'
import { LOGIN_FIELD_RULES } from '@constants/auth.constants'
import { RiseIn } from '@elements/RiseIn/RiseIn'
import { useLoginForm } from '@hooks/auth/useLoginForm'

import styles from '@styles/authForm.module.css'

export const Login = () => {
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useLoginForm()

  return (
    <Flexbox direction="column">
      <RiseIn as="header">
        <Heading level={1} size="2xl" align="center">
          Bem-vindo
        </Heading>
      </RiseIn>

      <Flexbox as="form" direction="column" gap={4} mt={8} onSubmit={submit}>
        <RiseIn delay={120}>
          <FormField label="Email" error={errors.email?.message}>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register('email', LOGIN_FIELD_RULES.email)}
            />
          </FormField>
        </RiseIn>

        <RiseIn delay={200}>
          <FormField label="Senha" error={errors.password?.message}>
            <PasswordInput
              placeholder="••••••••"
              error={!!errors.password}
              {...register('password', LOGIN_FIELD_RULES.password)}
            />
          </FormField>
        </RiseIn>

        {errors.root && <Alert variant="error">{errors.root.message}</Alert>}

        <RiseIn delay={280}>
          <Button
            type="submit"
            loading={isSubmitting}
            className={styles.fullWidthAction}
            loadingIndicator="dots"
          >
            Entrar
          </Button>
        </RiseIn>
      </Flexbox>

      <RiseIn delay={360}>
        <Text size="sm" color="muted" align="center" mt={8}>
          Não tem conta?{' '}
          <Link to="/cadastrar" className={styles.footerLink}>
            Criar conta
          </Link>
        </Text>
      </RiseIn>
    </Flexbox>
  )
}
