import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { FormField } from '@nino/ds/components/FormField'
import { Grid } from '@nino/ds/components/Grid'
import { Heading } from '@nino/ds/components/Heading'
import { Input } from '@nino/ds/components/Input'
import { Text } from '@nino/ds/components/Text'
import { AccountFacts } from '@compositions/AccountFacts/AccountFacts'
import { useAccountForm } from '@hooks/account/useAccountForm'
import { useProfile } from '@hooks/account/useProfile'
import {
  AccountFieldsSkeleton,
} from '@skeletons/pages/AccountFieldsSkeleton/AccountFieldsSkeleton'

import styles from './Account.module.css'
import motion from '@styles/motion.module.css'

export const Account = () => {
  const { data: profile, isPending } = useProfile()
  const {
    draft,
    isDirty,
    isSaving,
    emailError,
    saveError,
    change,
    handleSave,
  } = useAccountForm(profile)

  return (
    <div className={styles.page}>
      <Text
        as="p"
        size="xs"
        weight="bold"
        case="uppercase"
        color="faint"
        className={motion.deal}
      >
        Minha conta
      </Text>

      <Flexbox
        as="header"
        gap={1.5}
        mt={1}
        className={`${motion.deal} ${styles.head}`}
      >
        <Heading level={1} size="2xl">
          Meus dados
        </Heading>
        <Text as="p" size="sm" color="subtle">
          É como a equipe te identifica no painel e no histórico dos pedidos.
        </Text>
      </Flexbox>

      {isPending ? (
        <AccountFieldsSkeleton />
      ) : (
        <>
          <Grid
            columns={{ mobile: 1, tablet: 2 }}
            gap={4}
            mt={6}
            className={motion.settle}
          >
            <FormField label="Nome" className={styles.wide}>
              <Input
                value={draft.name}
                onChange={(event) => change({ name: event.target.value })}
              />
            </FormField>

            <FormField
              label="E-mail"
              error={emailError ?? undefined}
              helperText="Usado para entrar no painel"
            >
              <Input
                type="email"
                placeholder="nome@exemplo.com"
                value={draft.email}
                onChange={(event) => change({ email: event.target.value })}
              />
            </FormField>

            <FormField
              label="Telefone"
              helperText="Usado para recuperar o acesso"
            >
              <Input
                inputMode="tel"
                value={draft.phone}
                onChange={(event) => change({ phone: event.target.value })}
              />
            </FormField>
          </Grid>

          {saveError && (
            <Alert variant="error" className={styles.saveError}>
              {saveError}
            </Alert>
          )}

          <Flexbox
            direction={{ mobile: 'column', tablet: 'row' }}
            align={{ tablet: 'center' }}
            justify={{ tablet: 'end' }}
            gap={{ tablet: 4 }}
            className={styles.actions}
          >
            {!isDirty && !saveError && (
              <Text
                as="p"
                size="xs"
                color="faint"
                className={styles.status}
              >
                Nada mudou desde o último salvamento.
              </Text>
            )}
            <Button
              loading={isSaving}
              disabled={!isDirty}
              className={motion.press}
              onClick={() => void handleSave()}
            >
              Salvar meus dados
            </Button>
          </Flexbox>
        </>
      )}

      {profile && <AccountFacts profile={profile} />}
    </div>
  )
}
