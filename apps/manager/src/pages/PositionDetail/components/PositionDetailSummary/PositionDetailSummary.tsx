import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'

import styles from './PositionDetailSummary.module.css'

type PositionDetailSummaryProps = {
  /** Name of the cargo right above; `null` at the top (the owner). */
  aboveName: string | null
  selectedCount: number
  totalCount: number
  memberCount: number
}

const peopleLabel = (count: number): string =>
  count === 1 ? '1 pessoa' : `${count} pessoas`

export const PositionDetailSummary = ({
  aboveName,
  selectedCount,
  totalCount,
  memberCount,
}: PositionDetailSummaryProps) => (
  <Box as="aside" aria-label="Resumo do cargo" className={styles.summary}>
    {aboveName && (
      <Box className={styles.item}>
        <Text className={styles.value}>{aboveName}</Text>
        <Text className={styles.caption}>fica logo abaixo de</Text>
      </Box>
    )}
    <Box className={styles.item}>
      <Text className={styles.value}>{`${selectedCount} de ${totalCount}`}</Text>
      <Text className={styles.caption}>permissões liberadas</Text>
    </Box>
    <Box className={styles.item}>
      <Text className={styles.value}>{peopleLabel(memberCount)}</Text>
      <Text className={styles.caption}>com este cargo</Text>
    </Box>
  </Box>
)
