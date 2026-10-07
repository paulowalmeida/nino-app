import { Box } from '@nino/ds/components/Box'
import { ListRow } from '@nino/ds/components/ListRow'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import styles from './SettingsUnitSkeleton.module.css'

const GHOST_UNITS = ['first', 'second', 'third']

export const SettingsUnitSkeleton = () => (
  <Box as="section" className={styles.settingsUnitSkeletonPanel}>
    <Text as="p" role="status" className={styles.loadingLabel}>
      Carregando lojas da empresa
    </Text>

    <Box as="header" align="start" justify="between" wrap mb={4}>
      <Box direction="column" gap={2}>
        <Skeleton className={styles.settingsUnitSkeletonTitle} />
        <Skeleton className={styles.settingsUnitSkeletonSubtitle} />
      </Box>

      <Skeleton className={styles.add} />
    </Box>

    <Box as="ul" direction="column">
      {GHOST_UNITS.map((unit) => (
        <ListRow key={unit} gap={3} padding={2} wrap>
          <Box direction="column" gap={2} className={styles.unit}>
            <Skeleton className={styles.name} />
            <Skeleton className={styles.company} />
          </Box>

          <Skeleton className={styles.remove} />
        </ListRow>
      ))}
    </Box>
  </Box>
)
