import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { FormField } from '@nino/ds/components/FormField'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { toast } from '@nino/ds/components/Toast'
import { AccountProfilePhoneField } from '@pages/Profile/components/AccountProfilePhoneField/AccountProfilePhoneField'
import { useProfileFacade } from '@pages/Profile/facades/useProfileFacade/useProfileFacade'
import { hasProfanity } from '@pages/Profile/utils/profanity/profanity'

import styles from './AccountProfile.module.css'

export const AccountProfile = () => {
  const { customer, completeProfile, isCompletingProfile } = useProfileFacade()

  // CONSTRAINT: conta aberta por telefone guarda o número no campo `name`
  // até a pessoa dizer como se chama — o formulário nasce vazio, não com o
  // telefone.
  const savedName = customer?.profileCompletedAt
    ? (customer?.name ?? '').trim()
    : ''

  const [name, setName] = useState(savedName)
  const [email, setEmail] = useState(customer?.email ?? '')

  const trimmedName = name.trim()
  const trimmedEmail = email.trim()

  const emailValid = !trimmedEmail || /.+@.+\..+/.test(trimmedEmail)
  // WHY: checagem também no cliente evita a ida e volta com a API, que
  // recusa o mesmo nome do outro lado.
  const nameClean = !hasProfanity(trimmedName)
  const changed =
    trimmedName !== savedName || trimmedEmail !== (customer?.email ?? '')
  const ready = trimmedName.length >= 2 && nameClean && emailValid && changed

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!ready) return

    completeProfile(
      { name: trimmedName, email: trimmedEmail || null },
      {
        onSuccess: () => toast.success('Dados salvos.'),
        onError: () => toast.error('Não deu para salvar agora.'),
      }
    )
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <Eyebrow>Dados pessoais</Eyebrow>
      <Heading level={2} size="lg" color="muted">
        Como a loja te encontra
      </Heading>
      <Text className={styles.note}>
        O nome vai na comanda, para a cozinha e o entregador saberem de quem é o
        pedido.
      </Text>

      <Box className={styles.card}>
        <FormField
          label="Nome"
          labelVariant="compact"
          error={
            !nameClean
              ? 'Esse nome vai ser lido em voz alta na cozinha — escolha outro.'
              : undefined
          }
        >
          <Input
            autoComplete="name"
            error={!nameClean}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </FormField>

        <AccountProfilePhoneField />

        <FormField
          label={
            <>
              E-mail{' '}
              <Text as="span" className={styles.hint}>
                (opcional)
              </Text>
            </>
          }
          labelVariant="compact"
          helperText={
            'Salvando o e-mail você também passa a entrar por ele, ' +
            'além do telefone.'
          }
          error={!emailValid ? 'Digite um e-mail válido.' : undefined}
        >
          <Input
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            error={!emailValid}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </FormField>
      </Box>

      <Box className={styles.actions}>
        <Button
          type="submit"
          className={styles.primary}
          disabled={!ready || isCompletingProfile}
        >
          {isCompletingProfile ? 'Salvando…' : 'Salvar'}
        </Button>
      </Box>
    </Box>
  )
}
