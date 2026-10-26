import { Text } from '@nino/ds/components/Text'

import styles from './DisclosureTrigger.module.css'

type DisclosureTriggerProps = {
  children: string
}

/** O gatilho de todo campo opcional dobrado: um "+" quieto e o rótulo. */
export const DisclosureTrigger = ({ children }: DisclosureTriggerProps) => (
  <Text as="span" className={styles.disclosureTriggerLabel}>
    <Text as="span" className={styles.plus} aria-hidden="true">
      +
    </Text>
    {children}
  </Text>
)
