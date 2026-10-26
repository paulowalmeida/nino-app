import { Text } from '@nino/ds/components/Text'
import { CHART_PALETTE } from '@pages/Reports/constants/reports.constants'
import { chartFullDateLabel } from '@shared/utils/chart-format/chart-format'

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

export const ChartSeriesTooltip = ({ at, lines }: ChartSeriesTooltipProps) => (
  <>
    <Text as="p" className={styles.chartSeriesTooltipLabel}>
      {chartFullDateLabel.format(at)}
    </Text>
    {lines.map((line, index) => (
      <Text as="p" key={line.key} className={styles.chartSeriesTooltipRow}>
        <span
          aria-hidden="true"
          className={`${styles.dot} ${
            styles[CHART_PALETTE[index % CHART_PALETTE.length]]
          }`}
        />
        <Text as="span" className={styles.name}>
          {line.label}
        </Text>
        <Text as="span" className={styles.chartSeriesTooltipValue}>
          {line.value}
        </Text>
      </Text>
    ))}
  </>
)
