import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Text } from '@nino/ds/components/Text'
import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import { toUnitsWelcomeTitle } from '@pages/Units/utils/toUnitsWelcomeTitle/toUnitsWelcomeTitle'

import styles from './UnitsHeader.module.css'

export const UnitsHeader = () => {
  const { user } = useUnitsFacade()

  return (
    <Box direction="row" wrap align="end" justify="between" gap={3}>
      <Box>
        <Text as="p" size="xs" weight="bold" color="faint" className={styles.eyebrow}>
          Unidades
        </Text>
        <Heading level={1} size="2xl" mt={1}>
          {toUnitsWelcomeTitle(user?.name)}
        </Heading>
        <Text as="p" size="sm" color="subtle" className={styles.unitsHeaderSubtitle}>
          Cada unidade tem cardápio, horário e zonas próprios. A empresa e a assinatura ficam por cima de todas.
        </Text>
      </Box>
      <Link to="/boas-vindas" className={styles.guideAgain}>
        Ver como funciona
      </Link>
    </Box>
  )
}
