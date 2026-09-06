import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { OTPInput } from '@nino/ds/components/OTPInput'
import { Text } from '@nino/ds/components/Text'
import { OTP_CODE_LENGTH } from '@constants/otp.constants'
import { riseDelay } from '@utils/rise-delay'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import styles from './SignInCompletePhoneCode.module.css'
import motion from '@styles/motion.module.css'

export const SignInCompletePhoneCode = () => {
  const {
    phone,
    code,
    setCode,
    verifyPhoneCode,
    isVerifyingPhoneCode,
    verifyPhoneCodeFailed,
    goHomeSkippingPhone,
  } = useSignInFacade()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (code.length !== OTP_CODE_LENGTH) return

    verifyPhoneCode(phone, code)
  }

  return (
    <Box
      as="form"
      className={motion.riseIn}
      style={riseDelay(60)}
      onSubmit={handleSubmit}
    >
      <Heading level={1} className={styles.title}>
        Confirme seu telefone
      </Heading>
      <Text size="sm" className={styles.subtitle}>
        Enviamos um código para{' '}
        <Text as="span" weight="bold" color="strong">
          {phone}
        </Text>
        .
      </Text>

      <OTPInput
        length={OTP_CODE_LENGTH}
        type="numeric"
        otp
        invalid={verifyPhoneCodeFailed}
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

      {verifyPhoneCodeFailed && (
        <Alert variant="error" className={styles.alert}>
          Código inválido ou expirado. Peça outro e tente de novo.
        </Alert>
      )}

      <Button
        type="submit"
        className={`${motion.press} ${styles.cta}`}
        disabled={code.length !== OTP_CODE_LENGTH || isVerifyingPhoneCode}
      >
        {isVerifyingPhoneCode ? 'Confirmando…' : 'Confirmar'}
      </Button>

      <Button
        type="button"
        variant="ghost"
        className={`${motion.press} ${styles.secondary}`}
        onClick={goHomeSkippingPhone}
      >
        Deixar para depois
      </Button>
    </Box>
  )
}
