import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import styles from './CollaboratorRemovalAccess.module.css'

type CollaboratorRemovalAccessProps = {
  firstName: string
  removalLockHint?: string
  onOpenRemovalConfirm: () => void
}

export const CollaboratorRemovalAccess = ({
  firstName,
  removalLockHint,
  onOpenRemovalConfirm,
}: CollaboratorRemovalAccessProps) => (
  <Box as="footer" align="start" gap={2} className={styles.removal}>
    <Text as="p" size="xs" color="faint" className={styles.collaboratorRemovalAccessDescription}>
      {firstName} perde o painel desta loja. A conta continua existindo, e o
      histórico de pedidos fica registrado.
    </Text>

    <Button
      variant="ghost"
      size="sm"
      disabled={!!removalLockHint}
      onClick={onOpenRemovalConfirm}
      className={styles.collaboratorRemovalAccessButton}
    >
      Tirar da loja
    </Button>

    {removalLockHint && (
      <Box direction="row" align="center" gap={1.5}>
        <Icon name="lock" size="sm" aria-hidden />
        <Text as="span" size="xs" color="faint">
          {removalLockHint}
        </Text>
      </Box>
    )}
  </Box>
)
