import { Box } from '@nino/ds/components/Box'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'

import styles from './AddressesHeader.module.css'

export const AddressesHeader = () => (
  <Box as="header">
    <Eyebrow>Endereços</Eyebrow>
    <Heading level={2} size="lg" color="muted">
      Para onde a loja entrega
    </Heading>
    <Text className={styles.note}>
      O principal já vem preenchido no checkout. Os outros ficam a um toque na
      hora de pedir.
    </Text>
  </Box>
)
