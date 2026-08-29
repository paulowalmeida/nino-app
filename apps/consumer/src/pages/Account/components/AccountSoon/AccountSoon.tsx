import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Heading } from '@nino/ds/components/Heading'
import { Icon, type IconName } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import styles from './AccountSoon.module.css'

type AccountSoonProps = {
  eyebrow: string
  headline: string
  note: string
  icon: IconName
}

export const AccountSoon = ({
  eyebrow,
  headline,
  note,
  icon,
}: AccountSoonProps) => (
  <Box>
    <Eyebrow>{eyebrow}</Eyebrow>
    <Heading level={2} size="lg" color="muted">
      {headline}
    </Heading>

    <Box className={styles.card}>
      <Icon name={icon} className={styles.icon} />
      <Text className={styles.note}>{note}</Text>
      <Badge size="sm" className={styles.tag}>
        Em breve
      </Badge>
    </Box>
  </Box>
)
