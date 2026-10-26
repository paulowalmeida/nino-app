import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import { toUnitsWelcomeTitle } from '@pages/Units/utils/toUnitsWelcomeTitle/toUnitsWelcomeTitle'

import motion from '@styles/motion.module.css'
import styles from './UnitsHeader.module.css'

export const UnitsHeader = () => {
  const { user } = useUnitsFacade()

  return (
    <Box direction="row" wrap align="end" justify="between" gap={3}>
      <Box>
        <Text
          as="p"
          size="xs"
          weight="bold"
          color="faint"
          className={styles.eyebrow}
        >
          Unidades
        </Text>
        <Header
          mt={1}
          className={motion.deal}
          size="2xl"
          title={toUnitsWelcomeTitle(user?.name)}
          description="Cada unidade tem cardápio, horário e zonas próprios. A empresa e a assinatura ficam por cima de todas."
        />
      </Box>
      <Link to="/boas-vindas" className={styles.guideAgain}>
        Ver como funciona
      </Link>
    </Box>
  )
}
