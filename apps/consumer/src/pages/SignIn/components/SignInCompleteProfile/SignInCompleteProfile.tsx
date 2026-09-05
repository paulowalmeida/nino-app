import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'
import { isCompletePhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'
import { useSignInFacade } from '@pages/sign-in/facades/useSignInFacade/useSignInFacade'

import styles from './SignInCompleteProfile.module.css'
import motion from '@styles/motion.module.css'

/**
 * A mesma pergunta para os três jeitos de entrar: como te chamar, e — só
 * para quem ainda não tem um telefone confirmado — se quer deixá-lo já
 * registrado. Telefone aqui é sempre pulável: ele vira obrigatório só no
 * checkout, quando existe um pedido para entregar.
 */
export const SignInCompleteProfile = () => {
  const {
    customer,
    name,
    setName,
    phone,
    setPhone,
    finishProfile,
    isFinishingProfile,
    finishProfileFailed,
  } = useSignInFacade()

  const hasPhone = Boolean(customer?.phone)
  const trimmedName = name.trim()
  const normalizedPhone = phone.trim()
  const phoneIsValid = !normalizedPhone || isCompletePhone(normalizedPhone)
  const ready = trimmedName.length >= 2 && phoneIsValid

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready) return

    finishProfile(trimmedName, phoneIsValid ? normalizedPhone : '')
  }

  return (
    <Box
      as="form"
      className={motion.riseIn}
      style={riseDelay(60)}
      onSubmit={handleSubmit}
    >
      <Heading level={1} className={styles.title}>
        Como podemos te chamar?
      </Heading>
      <Text size="sm" className={styles.subtitle}>
        Só isso e você já pode pedir.
      </Text>

      <FormField label="Nome" required className={styles.field}>
        <Input
          size="lg"
          autoFocus
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </FormField>

      {!hasPhone && (
        <FormField
          label="Telefone (opcional agora)"
          className={styles.field}
          helperText="É por ele que a loja confirma o pedido e o entregador te acha."
        >
          <PhoneInput
            size="lg"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </FormField>
      )}

      {finishProfileFailed && (
        <Alert variant="error" className={styles.alert}>
          Não conseguimos salvar agora. Tente de novo em instantes.
        </Alert>
      )}

      <Button
        type="submit"
        className={`${motion.press} ${styles.cta}`}
        disabled={!ready || isFinishingProfile}
      >
        {isFinishingProfile ? 'Salvando…' : 'Continuar'}
      </Button>
    </Box>
  )
}
