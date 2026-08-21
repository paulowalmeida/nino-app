import { Alert } from '@nino/ds/components/Alert'
import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'
import { FormField } from '@nino/ds/components/FormField'
import { Grid } from '@nino/ds/components/Grid'
import { Input } from '@nino/ds/components/Input'
import { PhoneInput } from '@nino/ds/components/PhoneInput'
import { Text } from '@nino/ds/components/Text'

import styles from './AccountProfileForm.module.css'
import motion from '@styles/motion.module.css'

export type AccountProfileFormProps = {
  draft: { name: string; phone: string; email: string }
  isDirty: boolean
  isSaving: boolean
  emailError: string | null
  saveError: string | null
  onDraftChange: (patch: {
    name?: string
    phone?: string
    email?: string
  }) => void
  onSave: () => Promise<void>
}

export const AccountProfileForm = ({
  draft,
  isDirty,
  isSaving,
  emailError,
  saveError,
  onDraftChange,
  onSave,
}: AccountProfileFormProps) => (
  <>
    <Grid
      columns={{ mobile: 1, tablet: 2 }}
      gap={4}
      mt={8}
      className={motion.settle}
    >
      <FormField
        label="Nome"
        helperText="Como a equipe te vê no painel e no histórico"
        className={styles.wide}
      >
        <Input
          value={draft.name}
          onChange={(event) => onDraftChange({ name: event.target.value })}
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
          onChange={(event) => onDraftChange({ email: event.target.value })}
        />
      </FormField>

      <FormField label="Telefone" helperText="Usado para recuperar o acesso">
        <PhoneInput
          value={draft.phone}
          onChange={(event) => onDraftChange({ phone: event.target.value })}
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
      className={styles.actions}
    >
      {!isDirty && !saveError && (
        <Text as="p" size="xs" color="faint" className={styles.status}>
          Nada mudou ainda.
        </Text>
      )}
      <Button
        loading={isSaving}
        disabled={!isDirty}
        className={motion.press}
        onClick={() => void onSave()}
      >
        Salvar meus dados
      </Button>
    </Box>
  </>
)
