import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { CHART_PALETTE } from '@pages/Reports/constants/reports.constants'

import styles from './ChartLegend.module.css'

export type ChartLegendItem = { key: string; label: string }

export type ChartLegendProps = {
  items: ChartLegendItem[]
}

export const ChartLegend = ({ items }: ChartLegendProps) => (
  <ul className={styles.legend}>
    {items.map((item, index) => (
      <ListRow
        key={item.key}
        divider="none"
        padding={0}
        gap={1.5}
        className={styles.legendItem}
      >
        <span
          aria-hidden="true"
          className={`${styles.legendDot} ${
            styles[CHART_PALETTE[index % CHART_PALETTE.length]]
          }`}
        />
        <Text as="span">{item.label}</Text>
      </ListRow>
    ))}
  </ul>
)
