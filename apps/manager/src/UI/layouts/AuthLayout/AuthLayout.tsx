import { Outlet } from 'react-router'

import { NinoLogo } from '@atoms/NinoLogo/NinoLogo'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'

import styles from './AuthLayout.module.css'

const brandPanel = mergeClasses(styles.brandPanel, styles.dotGrid, styles.grain)
const glowTop = mergeClasses(styles.glowTop, styles.glowPulse)
const mascot = mergeClasses(styles.mascot, styles.mascotFloat)
const mobileMascot = mergeClasses(styles.mobileMascot, styles.mascotFloat)

export const AuthLayout = () => (
  <div className={styles.authShell}>
    <aside className={brandPanel}>
      <div className={glowTop} aria-hidden="true" />

      <div className={styles.glowBottom} aria-hidden="true" />

      <Box direction="row" className={styles.brandLogo}>
        <NinoLogo tone="light" />
      </Box>

      <Box align="center" justify="center" className={styles.mascotArea}>
        <Box direction="column" className={styles.mascotStage}>
          <div className={styles.mascotHalo} aria-hidden="true" />

          <NinoMascot className={mascot} />
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

    <Box
      as="main"
      align="center"
      justify="center"
      className={styles.formPanel}
    >
      <Box direction="column" className={styles.formCard}>
        <Box
          direction="row"
          justify="center"
          className={styles.mobileBrand}
        >
          <NinoLogo size="md" mark={<NinoMascot className={mobileMascot} />} />
        </Box>

        <Outlet />
      </Box>
    </Box>
  </div>
)
