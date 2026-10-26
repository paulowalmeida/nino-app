import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { PasswordInput } from '@nino/ds/components/PasswordInput'
import { RESET_PASSWORD_FIELD_RULES } from '@pages/ResetPassword/constants/resetPassword.constants'
import { useResetPasswordFacade } from '@pages/ResetPassword/facades/useResetPasswordFacade/useResetPasswordFacade'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

import styles from './ResetPasswordForm.module.css'

export const ResetPasswordForm = () => {
  const { register, submit, getValues, fieldErrors, isSending, hasToken } =
    useResetPasswordFacade()

  if (!hasToken) {
    return (
      <RiseIn>
        <Alert variant="error">
          Link inválido ou expirado. Solicite uma nova recuperação.
        </Alert>
      </RiseIn>
    )
  }

  return (
    <Box as="form" direction="column" gap={4} mt={8} onSubmit={submit}>
      <RiseIn delay={120}>
        <FormField label="Nova senha" error={fieldErrors.password?.message}>
          <PasswordInput
            placeholder="••••••••"
            autoComplete="new-password"
            error={!!fieldErrors.password}
            {...register('password', RESET_PASSWORD_FIELD_RULES.password)}
          />
        </FormField>
      </RiseIn>

      <RiseIn delay={200}>
        <FormField
          label="Confirmar senha"
          error={fieldErrors.confirmPassword?.message}
        >
          <PasswordInput
            placeholder="••••••••"
            autoComplete="new-password"
            error={!!fieldErrors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Confirme a senha',
              validate: (value) =>
                value === getValues('password') || 'As senhas não conferem',
            })}
          />
        </FormField>
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
          Redefinir senha
        </Button>
      </RiseIn>
    </Box>
  )
}
