import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'

import styles from './StoreSelectionHeader.module.css'

export const StoreSelectionHeader = () => (
  <>
    <Heading level={1} size="2xl" className={styles.title}>
      Seus restaurantes
    </Heading>
    <Text size="sm" color="muted" mt={2}>
      Escolha qual você quer gerenciar
    </Text>
  </>
)
