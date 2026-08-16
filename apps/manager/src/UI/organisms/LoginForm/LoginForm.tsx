import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { PasswordInput } from '@nino/ds/components/PasswordInput'
import { LOGIN_FIELD_RULES } from '@constants/auth.constants'
import { RiseIn } from '@atoms/RiseIn/RiseIn'
import { useLoginForm } from '@hooks/auth/useLoginForm'

import styles from '@styles/authForm.module.css'

export const LoginForm = () => {
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useLoginForm()

  return (
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
  )
}
