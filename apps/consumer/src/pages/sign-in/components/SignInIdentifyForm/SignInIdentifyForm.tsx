import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Chip } from '@nino/ds/components/Chip'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'
import { isCompletePhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'
import { SIGN_IN_CHANNELS } from '@pages/sign-in/constants/sign-in.constants'
import {
  useSignInFacade,
} from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'
import {
  resolveOtpCredentials,
} from '@pages/sign-in/utils/resolveOtpCredentials/resolveOtpCredentials'

import styles from './SignInIdentifyForm.module.css'
import motion from '@styles/motion.module.css'

export const SignInIdentifyForm = () => {
  const {
    channel,
    setChannel,
    phone,
    setPhone,
    email,
    setEmail,
    requestCode,
    isRequesting,
    requestFailed,
  } = useSignInFacade()

  const isEmail = channel === 'email'
  const ready = isEmail ? /.+@.+\..+/.test(email) : isCompletePhone(phone)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready) return

    requestCode(resolveOtpCredentials(channel, phone, email))
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
        Passo 1 de 2
      </Text>
      <Heading
        level={1}
        color="muted"
        className="mt-2 font-display text-[1.75rem] font-extrabold
          leading-tight"
      >
        {isEmail ? 'Qual é o seu e-mail?' : 'Qual é o seu telefone?'}
      </Heading>
      <Text size="sm" color="muted" className="mt-2.5 leading-relaxed">
        Mandamos um código de 6 dígitos para confirmar que é você. Sem senha
        para inventar nem lembrar depois.
      </Text>

      {/* a escolha do canal vem antes do campo: é ela que decide o que
          digitar, e um campo que aceita as duas coisas não sabe mascarar
          nenhuma das duas */}
      <Box direction="row" className={styles.channels} role="tablist">
        {SIGN_IN_CHANNELS.map(({ id, label }) => (
          <Chip
            key={id}
            variant="tab"
            selected={channel === id}
            className={channel === id ? styles.channelOn : styles.channel}
            onClick={() => setChannel(id)}
          >
            {label}
          </Chip>
        ))}
      </Box>

      {isEmail ? (
        <Input
          type="email"
          size="lg"
          aria-label="E-mail"
          autoComplete="email"
          placeholder="voce@email.com"
          className={styles.field}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      ) : (
        <PhoneInput
          size="lg"
          aria-label="Telefone"
          autoComplete="tel"
          className={styles.field}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      )}

      {requestFailed && (
        <Alert variant="error" className={styles.alert}>
          {isEmail
            ? 'Não achamos conta com esse e-mail. Entre pelo telefone ' +
              '— depois dá para salvar o e-mail na sua conta.'
            : 'Não conseguimos enviar o código agora. Tente de novo ' +
              'em instantes.'}
        </Alert>
      )}

      <Button
        type="submit"
        className={`${motion.press} ${styles.cta}`}
        disabled={!ready || isRequesting}
      >
        {isRequesting ? 'Enviando…' : 'Enviar código'}
      </Button>
    </Box>
  )
}
