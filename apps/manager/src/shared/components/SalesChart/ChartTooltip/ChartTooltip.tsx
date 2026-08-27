import { Text } from '@nino/ds/components/Text'
import { chartFullDateLabel } from '@shared/utils/chart-format/chart-format'

import styles from './ChartTooltip.module.css'

export type ChartTooltipProps = {
  at: Date
  value: string
}

export const ChartTooltip = ({ at, value }: ChartTooltipProps) => (
  <>
    <Text as="p" className={styles.label}>
      {chartFullDateLabel.format(at)}
    </Text>
    <Text as="p" className={styles.value}>
      {value}
    </Text>
  </>
)
