import { Text } from '@nino/ds/components/Text'
import { CHART_PALETTE } from '@constants/order.constants'
import { chartFullDateLabel } from '@utils/chart-format'

import styles from './ChartSeriesTooltip.module.css'

export type ChartSeriesTooltipLine = {
  key: string
  label: string
  value: string
}

export type ChartSeriesTooltipProps = {
  at: Date
  lines: ChartSeriesTooltipLine[]
}

export const ChartSeriesTooltip = ({
  at,
  lines,
}: ChartSeriesTooltipProps) => (
  <>
    <Text as="p" className={styles.label}>
      {chartFullDateLabel.format(at)}
    </Text>
    {lines.map((line, index) => (
      <Text as="p" key={line.key} className={styles.row}>
        <span
          aria-hidden="true"
          className={`${styles.dot} ${
            styles[CHART_PALETTE[index % CHART_PALETTE.length]]
          }`}
        />
        <Text as="span" className={styles.name}>
          {line.label}
        </Text>
        <Text as="span" className={styles.value}>
          {line.value}
        </Text>
      </Text>
    ))}
  </>
)
