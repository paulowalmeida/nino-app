import { Card } from '@nino/ds/components/Card'
import { Text } from '@nino/ds/components/Text'
import type { Membership } from '@custom_types/auth/membership'
import { unitLabel } from '@utils/company-unit'
import { riseDelay } from '@utils/rise-delay'

import styles from './CompanyPickCard.module.css'
import motion from '@styles/motion.module.css'

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
    className={`${motion.settle} ${motion.lift} ${styles.card}`}
  >
    <Text as="span" weight="semibold" className={styles.name}>
      {companyName}
    </Text>
    <Text as="span" size="sm" color="muted" className={styles.unit}>
      {units.length > 1 ? unitLabel(units.length) : units[0].tenantName}
    </Text>
  </Card>
)
