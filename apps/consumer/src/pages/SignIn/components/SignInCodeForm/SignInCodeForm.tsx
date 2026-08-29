import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { OTPInput } from '@nino/ds/components/OTPInput'
import { Text } from '@nino/ds/components/Text'
import { riseDelay } from '@utils/rise-delay'
import { OTP_CODE_LENGTH } from '@pages/sign-in/constants/sign-in.constants'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'
import { resolveOtpCredentials } from '@pages/sign-in/utils/resolveOtpCredentials/resolveOtpCredentials'

import styles from './SignInCodeForm.module.css'
import motion from '@styles/motion.module.css'

export const SignInCodeForm = () => {
  const {
    channel,
    phone,
    email,
    code,
    setCode,
    verifyCode,
    isVerifying,
    verifyFailed,
    goToIdentify,
  } = useSignInFacade()

  const isEmail = channel === 'email'
  const sentTo = isEmail ? email : phone

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (code.length !== OTP_CODE_LENGTH) return

    verifyCode(resolveOtpCredentials(channel, phone, email), code)
  }

  return (
    <Box
      as="form"
      className={motion.riseIn}
      style={riseDelay(60)}
      onSubmit={handleSubmit}
    >
      <Text
        size="xs"
        weight="bold"
        case="uppercase"
        color="faintest"
        className="mt-9 text-2xs tracking-[0.16em]"
      >
        Passo 2 de 2
      </Text>
      <Heading
        level={1}
        color="muted"
        className="mt-2 font-display text-[1.75rem] font-extrabold
          leading-tight"
      >
        Digite o código
      </Heading>
      <Text size="sm" color="muted" className="mt-2.5 leading-relaxed">
        Enviamos para{' '}
        <Text as="span" weight="bold" color="muted">
          {sentTo}
        </Text>
        . Ele vale por poucos minutos.
      </Text>

      {/* o Ark controla um array de 6 posições: mandar um array curto
          (ou receber os buracos dele de volta) vira `undefined` no meio
          do código já na primeira tecla */}
      <OTPInput
        length={OTP_CODE_LENGTH}
        type="numeric"
        otp
        invalid={verifyFailed}
        className={styles.codeField}
        value={Array.from(
          { length: OTP_CODE_LENGTH },
          (_, index) => code[index] ?? ''
        )}
        onValueChange={(digits) =>
          setCode(digits.map((digit) => digit ?? '').join(''))
        }
        onValueComplete={(filled) => setCode(filled)}
      />

      {verifyFailed && (
        <Alert variant="error" className={styles.alert}>
          Código inválido ou expirado. Peça outro e tente de novo.
        </Alert>
      )}

      <Button
        type="submit"
        className={`${motion.press} ${styles.cta}`}
        disabled={code.length !== OTP_CODE_LENGTH || isVerifying}
      >
        {isVerifying ? 'Confirmando…' : 'Entrar'}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className={`${motion.press} ${styles.secondary}`}
        onClick={goToIdentify}
      >
        {isEmail ? 'Usar outro e-mail' : 'Usar outro telefone'}
      </Button>
    </Box>
  )
}
