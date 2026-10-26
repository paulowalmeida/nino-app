import { Text } from '@nino/ds/components/Text'

import styles from './SubscriptionSupportHint.module.css'

export const SubscriptionSupportHint = () => (
  <Text as="p" size="xs" color="faint" mt={4} className={styles.hint}>
    As alterações afetam todas as unidades da empresa.
  </Text>
)
