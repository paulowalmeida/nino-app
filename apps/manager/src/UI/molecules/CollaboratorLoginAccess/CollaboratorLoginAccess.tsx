import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'

import styles from './CollaboratorLoginAccess.module.css'

const LOGIN_LABEL_ID = 'collaborator-login-choice'

type CollaboratorLoginAccessProps = {
  email: string | null
  onOpenEmailModal: () => void
}

export const CollaboratorLoginAccess = ({
  email,
  onOpenEmailModal,
}: CollaboratorLoginAccessProps) => (
  <section aria-labelledby={LOGIN_LABEL_ID}>
    <Heading
      level={3}
      size="sm"
      color="faintest"
      id={LOGIN_LABEL_ID}
      className={styles.title}
    >
      Como entra no painel
    </Heading>

    <Box
      direction="row"
      align="center"
      justify="between"
      wrap
      className={styles.login}
    >
      <Text
        as="p"
        size="sm"
        color="strong"
        weight="semibold"
        className={styles.email}
      >
        {email ?? 'Nenhum e-mail cadastrado'}
      </Text>

      <Button variant="outline" size="sm" onClick={onOpenEmailModal}>
        Editar e-mail
      </Button>
    </Box>
  </section>
)
