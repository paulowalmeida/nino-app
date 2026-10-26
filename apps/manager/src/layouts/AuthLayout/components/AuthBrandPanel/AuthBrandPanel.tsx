import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { NinoLogo } from '@shared/components/NinoLogo/NinoLogo'

import styles from './AuthBrandPanel.module.css'

export const AuthBrandPanel = () => (
  <aside
    className={mergeClasses(styles.brandPanel, styles.dotGrid, styles.grain)}
  >
    <Box
      className={mergeClasses(styles.glowTop, styles.glowPulse)}
      aria-hidden="true"
    />
    <Box className={styles.glowBottom} aria-hidden="true" />

    <Box direction="row" className={styles.brandLogo}>
      <NinoLogo tone="light" />
    </Box>

    <Box align="center" justify="center" className={styles.mascotArea}>
      <Box direction="column" className={styles.mascotStage}>
        <Box className={styles.mascotHalo} aria-hidden="true" />
        <NinoMascot className={styles.mascot} />
      </Box>
    </Box>

    <Box direction="column" className={styles.tagline}>
      <Heading level={2} size="2xl" className={styles.taglineTitle}>
        Gerencie sua loja,
        <br />
        <Text as="span" size="3xl" className={styles.highlight}>
          do seu jeito.
        </Text>
      </Heading>
      <Text size="lg" mt={3} className={styles.taglineText}>
        Pedidos, cardápio, vendas e faturamento — tudo num só lugar.
      </Text>
    </Box>
  </aside>
)
