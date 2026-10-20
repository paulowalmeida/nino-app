import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import { useTableTabDetailFacade } from '@pages/TableTabDetail/facades/useTableTabDetailFacade/useTableTabDetailFacade'
import {
  TAB_STATUS_BADGE_VARIANT,
  TAB_STATUS_LABEL,
} from '@shared/constants/tab.constants'
import { activeTabItems } from '@shared/utils/active-tab-items/active-tab-items'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './TabDetailHero.module.css'

export const TabDetailHero = () => {
  const { tab } = useTableTabDetailFacade()

  if (!tab) return null

  const itemCount = activeTabItems(tab).length

  return (
    <Box as="header" className={`${motion.deal} ${styles.tabDetailHero}`}>
      <Box className={styles.tabDetailHeroIdentity}>
        <Header
          className={styles.tabDetailHeroLabel}
          level={1}
          size="2xl"
          title={tab.label}
        />
        <Box direction="row" align="center" gap={2} wrap>
          <Badge variant={TAB_STATUS_BADGE_VARIANT[tab.status]}>
            {TAB_STATUS_LABEL[tab.status]}
          </Badge>
          <Text size="sm" color="muted">
            {itemCount} {itemCount === 1 ? 'item' : 'itens'} na conta
          </Text>
        </Box>
      </Box>
      <Box className={styles.tabDetailHeroTotal}>
        <Text size="sm" color="muted">
          Total da conta
        </Text>
        <Text weight="bold" size="2xl">
          {brl(tab.totalAmount)}
        </Text>
      </Box>
    </Box>
  )
}
