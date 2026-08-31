import { Link } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { PasswordInput } from '@nino/ds/components/PasswordInput'
import { Text } from '@nino/ds/components/Text'
import { LOGIN_FIELD_RULES } from '@pages/Login/constants/login.constants'
import { useLoginFacade } from '@pages/Login/facades/useLoginFacade/useLoginFacade'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

import styles from './LoginForm.module.css'

export const LoginForm = () => {
  const { register, submit, fieldErrors, isSending } = useLoginFacade()

  return (
    <Box as="form" direction="column" gap={4} mt={8} onSubmit={submit}>
      <RiseIn delay={120}>
        <FormField label="Email" error={fieldErrors.email?.message}>
          <Input
            type="email"
            placeholder="seu@email.com"
            {...register('email', LOGIN_FIELD_RULES.email)}
          />
        </FormField>
      </RiseIn>

      <RiseIn delay={200}>
        <FormField label="Senha" error={fieldErrors.password?.message}>
          <PasswordInput
            placeholder="••••••••"
            error={!!fieldErrors.password}
            {...register('password', LOGIN_FIELD_RULES.password)}
          />
        </FormField>
        <Text size="sm" align="right" mt={2}>
          <Link to="/esqueci-senha" className={styles.forgotPasswordLink}>
            Esqueceu a senha?
          </Link>
        </Text>
      </RiseIn>

      {fieldErrors.root && (
        <Alert variant="error">{fieldErrors.root.message}</Alert>
      )}

      <RiseIn delay={280}>
        <Button
          type="submit"
          loading={isSending}
          className={styles.fullWidthAction}
          loadingIndicator="dots"
        >
          Entrar
        </Button>
      </RiseIn>
    </Box>
  )
}
