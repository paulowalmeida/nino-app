import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import styles from './CashSkeleton.module.css'

const FIGURES = ['float', 'sales', 'deposits', 'withdrawals']
const ACTIONS = ['withdrawal', 'deposit', 'close']
const MOVEMENT_ROWS = ['first', 'second', 'third', 'fourth']

export const CashSkeleton = () => (
  <Box
    aria-busy="true"
    aria-label="Carregando o caixa"
    direction="column"
    className={styles.cashSkeletonPage}
  >
    <Text as="p" role="status" className={styles.loadingLabel}>
      Carregando o caixa
    </Text>

    <Box direction="column" className={styles.cashSkeletonControls}>
      <Box direction="column" gap={1} className={styles.header}>
        <Skeleton className={styles.title} />
        <Skeleton className={styles.description} />
      </Box>

      <Box direction="column" gap={1} className={styles.dateSelector}>
        <Skeleton className={styles.dateLabel} />
        <Skeleton className={styles.dateField} />
      </Box>

      <Box direction="column" className={styles.cashSkeletonCard}>
        <Box direction="row" align="baseline" justify="between">
          <Skeleton className={styles.summaryTitle} />
          <Skeleton className={styles.summaryMeta} />
        </Box>

        <Box direction="row" wrap className={styles.figures}>
          {FIGURES.map((figure) => (
            <Box key={figure} direction="column" className={styles.figure}>
              <Skeleton className={styles.figureLabel} />
              <Skeleton className={styles.figureValue} />
            </Box>
          ))}
        </Box>

        <Box
          direction="row"
          justify="between"
          align="center"
          className={styles.expected}
        >
          <Skeleton className={styles.expectedLabel} />
          <Skeleton className={styles.expectedValue} />
        </Box>
      </Box>

      <Box direction="row" wrap className={styles.cashSkeletonActions}>
        {ACTIONS.map((action) => (
          <Skeleton key={action} className={styles.cashSkeletonAction} />
        ))}
      </Box>
    </Box>

    <Box direction="column" className={styles.movements}>
      <Box
        direction="row"
        justify="between"
        align="baseline"
        className={styles.movementsHead}
      >
        <Skeleton className={styles.movementsTitle} />
        <Skeleton className={styles.movementsCount} />
      </Box>

      <Box className={styles.tableShell}>
        <Box className={styles.tableHeader}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </Box>
        {MOVEMENT_ROWS.map((row) => (
          <Box key={row} className={styles.tableRow}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
)
