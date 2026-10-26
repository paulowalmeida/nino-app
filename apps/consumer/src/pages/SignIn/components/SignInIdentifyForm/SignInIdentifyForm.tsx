import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'
import { isCompletePhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'
import { resolveOtpCredentials } from '@pages/sign-in/utils/resolveOtpCredentials/resolveOtpCredentials'

import styles from './SignInIdentifyForm.module.css'
import motion from '@styles/motion.module.css'

export const SignInIdentifyForm = () => {
  const {
    channel,
    phone,
    setPhone,
    email,
    setEmail,
    requestCode,
    isRequesting,
    requestFailed,
    goToMethods,
  } = useSignInFacade()

  const isEmail = channel === 'email'
  const normalizedEmail = email.trim()
  const ready = isEmail
    ? /.+@.+\..+/.test(normalizedEmail)
    : isCompletePhone(phone)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready) return

    requestCode(resolveOtpCredentials(channel, phone, normalizedEmail))
  }

  return (
    <Box
      as="form"
      className={motion.riseIn}
      style={riseDelay(60)}
      onSubmit={handleSubmit}
    >
      <Heading level={1} className={styles.signInIdentifyFormTitle}>
        {isEmail ? 'Qual é o seu e-mail?' : 'Qual é o seu celular?'}
      </Heading>
      <Text size="sm" className={styles.signInIdentifyFormSubtitle}>
        Mandaremos um código de 6 dígitos para confirmar que é você.
      </Text>

      {isEmail ? (
        <Input
          type="email"
          size="lg"
          autoFocus
          aria-label="E-mail"
          autoComplete="email"
          placeholder="voce@email.com"
          className={styles.signInIdentifyFormField}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      ) : (
        <PhoneInput
          size="lg"
          autoFocus
          aria-label="Celular"
          autoComplete="tel"
          className={styles.signInIdentifyFormField}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      )}

      {requestFailed && (
        <Alert variant="error" className={styles.alert}>
          Não conseguimos enviar o código agora. Tente de novo em instantes.
        </Alert>
      )}

      <Button
        type="submit"
        className={`${motion.press} ${styles.cta}`}
        disabled={!ready || isRequesting}
      >
        {isRequesting ? 'Enviando…' : 'Enviar código'}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className={`${motion.press} ${styles.signInIdentifyFormSecondary}`}
        onClick={goToMethods}
      >
        Entrar de outro jeito
      </Button>
    </Box>
  )
}
