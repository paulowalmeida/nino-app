import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'

import styles from './PersonalizeHeader.module.css'

export const PersonalizeHeader = () => (
  <Box as="header" className={styles.header}>
    <Heading level={1} size="2xl">
      Personalizar loja
    </Heading>
    <Text as="p" size="sm" color="subtle" className={styles.subtitle}>
      Cor, logo e banner do cardápio que o cliente abre. A prévia acompanha
      cada alteração — nada vai pro ar antes de você publicar.
    </Text>
  </Box>
)
