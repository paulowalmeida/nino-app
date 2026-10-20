import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { FormField } from '@nino/ds/components/FormField'
import { Grid } from '@nino/ds/components/Grid'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'

import { useProfileFacade } from '../../facades/useProfileFacade/useProfileFacade'

import motion from '@styles/motion.module.css'
import styles from './ProfileForm.module.css'

export const ProfileForm = () => {
  const { form } = useProfileFacade()
  const { draft, change, emailError, isDirty, isSaving, save, saveError } = form

  return (
    <>
      <Grid
        columns={{ mobile: 1, tablet: 2 }}
        gap={4}
        mt={8}
        className={motion.deal}
      >
        <FormField
          label="Nome"
          helperText="Como a equipe te vê no painel e no histórico"
          className={styles.wide}
        >
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

        <FormField label="Telefone" helperText="Usado para recuperar o acesso">
          <PhoneInput
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

      <Box
        direction={{ mobile: 'column', tablet: 'row' }}
        align={{ tablet: 'center' }}
        justify={{ tablet: 'end' }}
        gap={{ tablet: 4 }}
        className={styles.profileFormActions}
      >
        {!isDirty && !saveError && (
          <Text
            as="p"
            size="xs"
            color="faint"
            className={styles.profileFormStatus}
          >
            Nada mudou ainda.
          </Text>
        )}
        <Button
          loading={isSaving}
          disabled={!isDirty}
          className={motion.press}
          onClick={() => void save()}
        >
          Salvar meus dados
        </Button>
      </Box>
    </>
  )
}
