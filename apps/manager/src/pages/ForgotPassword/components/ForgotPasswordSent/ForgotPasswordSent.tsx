import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { RESET_LINK_TTL_LABEL } from '@pages/ForgotPassword/constants/forgotPassword.constants'
import { RiseIn } from '@shared/components/RiseIn/RiseIn'

import styles from './ForgotPasswordSent.module.css'

type ForgotPasswordSentProps = {
  email: string
  onUseAnotherEmail: () => void
}

export const ForgotPasswordSent = ({
  email,
  onUseAnotherEmail,
}: ForgotPasswordSentProps) => (
  <RiseIn>
    <Box direction="column" role="status" className={styles.forgotPasswordSentPanel}>
      <Box direction="row" align="center" gap={2} className={styles.flag}>
        <Box className={styles.dot} aria-hidden="true" />
        <Text as="span" className={styles.flagLabel}>
          Link a caminho
        </Text>
      </Box>

      <Text size="sm" color="subtle" mt={4}>
        Enviamos o link para
      </Text>
      <Text className={styles.address}>{email}</Text>

      <Box direction="row" align="center" gap={2} className={styles.validity}>
        <Icon name="clock" size="sm" color="brand-strong" />
        <Text size="sm" color="muted">
          O link vale por {RESET_LINK_TTL_LABEL}.
        </Text>
      </Box>

      <Text size="sm" color="subtle" className={styles.forgotPasswordSentNote}>
        Não chegou? Procure na caixa de spam antes de pedir outro.
      </Text>

      <Button
        variant="ghost"
        size="sm"
        onClick={onUseAnotherEmail}
        className={styles.retry}
      >
        Usar outro e-mail
      </Button>
    </Box>
  </RiseIn>
)
