import { Card } from '@nino/ds/components/Card'
import { Text } from '@nino/ds/components/Text'
import { unitLabel } from '@pages/StoreSelection/utils/unit-label'
import type { Membership } from '@shared/types/auth/membership'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './CompanyPickCard.module.css'

type CompanyPickCardProps = {
  companyName: string
  units: Membership[]
  index: number
  onClick: () => void
}

export const CompanyPickCard = ({
  companyName,
  units,
  index,
  onClick,
}: CompanyPickCardProps) => (
  <Card
    variant="flat"
    onClick={onClick}
    style={riseDelay(index * 80 + 100)}
    className={`${motion.deal} ${motion.lift} ${styles.companyPickCard}`}
  >
    <Text as="span" weight="semibold" className={styles.name}>
      {companyName}
    </Text>
    <Text as="span" size="sm" color="muted" className={styles.unit}>
      {units.length > 1 ? unitLabel(units.length) : units[0].unitName}
    </Text>
  </Card>
)
