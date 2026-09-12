import { useState } from 'react'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { OTPInput } from '@nino/ds/components/OTPInput'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'
import { OTP_CODE_LENGTH } from '@constants/otp.constants'
import { formatPhone, isCompletePhone, toE164 } from '@utils/phone'
import { useProfileFacade } from '@pages/Profile/facades/useProfileFacade/useProfileFacade'

import styles from './AccountProfilePhoneField.module.css'

/**
 * WHY: mostra o valor e diz por quê em vez de um campo desabilitado, que
 * pareceria um bug em vez de uma regra de negócio.
 */
const SavedPhone = ({ phone }: { phone: string }) => (
  <Box
    className={styles.field}
    role="group"
    aria-labelledby="profile-phone-label"
  >
    <Text as="span" className={styles.fieldLabel} id="profile-phone-label">
      Telefone
    </Text>
    <Text className={styles.readonly} id="profile-phone">
      {formatPhone(phone)}
    </Text>
    <Text className={styles.hint}>
      É por ele que você entra na conta. Para usar outro número, entre com ele —
      a loja abre uma conta nova.
    </Text>
  </Box>
)

export const AccountProfilePhoneField = () => {
  const {
    consumer,
    requestPhoneLink,
    isRequestingPhoneLink,
    requestPhoneLinkFailed,
    verifyPhoneLink,
    isVerifyingPhoneLink,
    verifyPhoneLinkFailed,
  } = useProfileFacade()

  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)

  if (consumer?.phone) return <SavedPhone phone={consumer.phone} />

  const phoneReady = isCompletePhone(phone)
  const codeReady = code.length === OTP_CODE_LENGTH

  const handleRequest = (event: React.FormEvent) => {
    event.preventDefault()
    if (!phoneReady) return

    requestPhoneLink(
      { phone: toE164(phone) },
      { onSuccess: () => setCodeSent(true) }
    )
  }

  const handleVerify = (event: React.FormEvent) => {
    event.preventDefault()
    if (!codeReady) return

    verifyPhoneLink({ phone: toE164(phone), code })
  }

  if (codeSent) {
    return (
      <Box as="form" className={styles.field} onSubmit={handleVerify}>
        <Text as="span" className={styles.fieldLabel}>
          Telefone
        </Text>
        <Text className={styles.hint}>
          Enviamos um código para {formatPhone(phone)}.
        </Text>

        <OTPInput
          length={OTP_CODE_LENGTH}
          type="numeric"
          otp
          invalid={verifyPhoneLinkFailed}
          className={styles.codeInput}
          value={Array.from(
            { length: OTP_CODE_LENGTH },
            (_, index) => code[index] ?? ''
          )}
          onValueChange={(digits) =>
            setCode(digits.map((digit) => digit ?? '').join(''))
          }
          onValueComplete={(filled) => setCode(filled)}
        />

        {verifyPhoneLinkFailed && (
          <Alert variant="error" className={styles.alert}>
            Código inválido ou expirado. Peça outro e tente de novo.
          </Alert>
        )}

        <Button
          type="submit"
          className={styles.action}
          disabled={!codeReady || isVerifyingPhoneLink}
        >
          {isVerifyingPhoneLink ? 'Confirmando…' : 'Confirmar'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={styles.ghost}
          onClick={() => setCodeSent(false)}
        >
          Usar outro número
        </Button>
      </Box>
    )
  }

  return (
    <Box as="form" className={styles.field} onSubmit={handleRequest}>
      <Text as="span" className={styles.fieldLabel} id="profile-phone-label">
        Telefone
      </Text>
      <Text className={styles.hint}>
        Pedimos só na entrega, se algo mudar no pedido.
      </Text>

      <Box className={styles.row}>
        <PhoneInput
          aria-labelledby="profile-phone-label"
          autoComplete="tel"
          className={styles.input}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
        <Button
          type="submit"
          className={styles.action}
          disabled={!phoneReady || isRequestingPhoneLink}
        >
          {isRequestingPhoneLink ? 'Enviando…' : 'Adicionar'}
        </Button>
      </Box>

      {requestPhoneLinkFailed && (
        <Alert variant="error" className={styles.alert}>
          Não conseguimos enviar o código agora. Tente de novo em instantes.
        </Alert>
      )}
    </Box>
  )
}
