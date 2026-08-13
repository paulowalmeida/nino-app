import { Outlet } from 'react-router'

import { NinoLogo } from '@elements/NinoLogo/NinoLogo'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Heading } from '@nino/ds/components/Heading'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { Text } from '@nino/ds/components/Text'

import styles from './AuthLayout.module.css'

const brandPanel = `${styles.brandPanel} ${styles.dotGrid} ${styles.grain}`
const glowTop = `${styles.glowTop} ${styles.glowPulse}`
const mascot = `${styles.mascot} ${styles.mascotFloat}`
const mobileMascot = `${styles.mobileMascot} ${styles.mascotFloat}`

export const AuthLayout = () => (
  <div className={styles.authShell}>
    {/* O painel só existe a partir de `lg`, e quem manda nisso é o
        `hidden lg:flex` do module — um Flexbox aqui fixaria `display: flex`
        e o painel apareceria no celular. */}
    <aside className={brandPanel}>
      <div className={glowTop} />
      <div className={styles.glowBottom} />

      <Flexbox direction="row" className={styles.brandLogo}>
        <NinoLogo tone="light" />
      </Flexbox>

      <Flexbox align="center" justify="center" className={styles.mascotArea}>
        <div className={styles.mascotStage}>
          <div className={styles.mascotHalo} />
          <NinoMascot className={mascot} />
        </div>
      </Flexbox>

      <Flexbox direction="column" className={styles.tagline}>
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
      </Flexbox>
    </aside>

    <Flexbox
      as="main"
      align="center"
      justify="center"
      className={styles.formPanel}
    >
      <Flexbox direction="column" className={styles.formCard}>
        <Flexbox
          direction="row"
          justify="center"
          className={styles.mobileBrand}
        >
          <NinoLogo size="md" mark={<NinoMascot className={mobileMascot} />} />
        </Flexbox>
        <Outlet />
      </Flexbox>
    </Flexbox>
  </div>
)
