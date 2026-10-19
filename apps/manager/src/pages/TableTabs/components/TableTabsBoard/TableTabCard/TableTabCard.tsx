import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import {
  TAB_STATUS_BADGE_VARIANT,
  TAB_STATUS_LABEL,
} from '@shared/constants/tab.constants'
import type { Tab } from '@shared/types/tab/tab'
import { activeTabItems } from '@shared/utils/active-tab-items/active-tab-items'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './TableTabCard.module.css'

type TableTabCardProps = {
  tab: Tab
}

export const TableTabCard = ({ tab }: TableTabCardProps) => {
  const itemCount = activeTabItems(tab).length

  return (
    <ListRow divider="none" padding={0} className={motion.deal}>
      <Card
        variant="flat"
        padding="none"
        asChild
        className={`${styles.tableTabCard} w-full`}
      >
        <Link to={`../comandas/${tab.id}`}>
          <Box direction="row" justify="between" align="start">
            <Text weight="bold" size="lg">
              {tab.label}
            </Text>
            <Badge variant={TAB_STATUS_BADGE_VARIANT[tab.status]} size="sm">
              {TAB_STATUS_LABEL[tab.status]}
            </Badge>
          </Box>
          <Box direction="row" justify="between" align="end">
            <Text size="sm" color="muted">
              {itemCount} {itemCount === 1 ? 'item' : 'itens'}
            </Text>
            <Text weight="bold" size="lg">
              {brl(tab.totalAmount)}
            </Text>
          </Box>
        </Link>
      </Card>
    </ListRow>
  )
}
