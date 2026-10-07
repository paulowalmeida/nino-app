import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import ghost from './UnitCardSkeleton.module.css'

export const UnitCardSkeleton = () => (
  <Box as="section" className={ghost.unitCardSkeletonPanel}>
    <Text as="p" role="status" className={ghost.loadingLabel}>
      Carregando os dados da unidade
    </Text>

    <Box as="header" align="start" justify="between" wrap gap={3} mb={4}>
      <Skeleton className={ghost.unitCardSkeletonTitle} />
      <Skeleton className={ghost.promote} />
    </Box>

    <Box direction="row" gap={0.5} className={ghost.unitCardSkeletonTabs}>
      <Skeleton className={ghost.unitCardSkeletonTab} />
      <Skeleton className={ghost.unitCardSkeletonTab} />
    </Box>

    <Box className={ghost.unitCardSkeletonFields}>
      <Box direction="column" gap={1.5}>
        <Skeleton className={ghost.unitCardSkeletonLabel} />
        <Skeleton className={ghost.unitCardSkeletonInput} />
      </Box>
      <Box direction="column" gap={1.5}>
        <Skeleton className={ghost.unitCardSkeletonLabel} />
        <Skeleton className={ghost.unitCardSkeletonInput} />
      </Box>
      <Box direction="column" gap={1.5}>
        <Skeleton className={ghost.unitCardSkeletonLabel} />
        <Skeleton className={ghost.unitCardSkeletonInput} />
      </Box>
    </Box>

    <Box className={ghost.address}>
      <Skeleton className={ghost.groupTitle} />
      <Box className={ghost.addressGrid}>
        <Skeleton className={`${ghost.unitCardSkeletonInput} ${ghost.zip}`} />
        <Skeleton className={`${ghost.unitCardSkeletonInput} ${ghost.street}`} />
        <Skeleton className={`${ghost.unitCardSkeletonInput} ${ghost.number}`} />
        <Skeleton className={`${ghost.unitCardSkeletonInput} ${ghost.complement}`} />
        <Skeleton className={`${ghost.unitCardSkeletonInput} ${ghost.neighborhood}`} />
        <Skeleton className={`${ghost.unitCardSkeletonInput} ${ghost.city}`} />
        <Skeleton className={`${ghost.unitCardSkeletonInput} ${ghost.state}`} />
      </Box>
    </Box>

    <Skeleton className={ghost.save} />
  </Box>
)
