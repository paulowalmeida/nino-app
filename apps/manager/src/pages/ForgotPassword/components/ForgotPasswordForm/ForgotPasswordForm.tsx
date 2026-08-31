import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Input } from '@nino/ds/components/Input'
import { FORGOT_PASSWORD_FIELD_RULES } from '@pages/ForgotPassword/constants/forgotPassword.constants'
import { useForgotPasswordFacade } from '@pages/ForgotPassword/facades/useForgotPasswordFacade/useForgotPasswordFacade'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

import styles from './ForgotPasswordForm.module.css'

export const ForgotPasswordForm = () => {
  const { register, submit, fieldErrors, isSending, isSent } =
    useForgotPasswordFacade()

  if (isSent) {
    return (
      <RiseIn>
        <Alert variant="success">
          Se o e-mail existir, enviamos instruções de recuperação.
        </Alert>
      </RiseIn>
    )
  }

  return (
    <Box as="form" direction="column" gap={4} mt={8} onSubmit={submit}>
      <RiseIn delay={120}>
        <FormField label="Email" error={fieldErrors.email?.message}>
          <Input
            type="email"
            placeholder="seu@email.com"
            {...register('email', FORGOT_PASSWORD_FIELD_RULES.email)}
          />
        </FormField>
      </RiseIn>

      {fieldErrors.root && (
        <Alert variant="error">{fieldErrors.root.message}</Alert>
      )}

      <RiseIn delay={200}>
        <Button
          type="submit"
          loading={isSending}
          className={styles.fullWidthAction}
          loadingIndicator="dots"
        >
          Enviar link de recuperação
        </Button>
      </RiseIn>
    </Box>
  )
}
