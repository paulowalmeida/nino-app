import { Text } from '@nino/ds/components/Text'

import styles from './SubscriptionSupportHint.module.css'

export const SubscriptionSupportHint = () => (
  <Text as="p" size="xs" color="faint" mt={4} className={styles.hint}>
    Mudança de plano e cancelamento passam pelo suporte enquanto a troca
    automática não está no ar.
  </Text>
)
