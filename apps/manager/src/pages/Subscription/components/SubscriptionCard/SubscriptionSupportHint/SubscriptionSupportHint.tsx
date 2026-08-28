import { Text } from '@nino/ds/components/Text'

import styles from './SubscriptionSupportHint.module.css'

export const SubscriptionSupportHint = () => (
  <Text as="p" size="xs" color="faint" mt={4} className={styles.hint}>
    Para mudar ou cancelar seu plano, fale com o suporte.
  </Text>
)
