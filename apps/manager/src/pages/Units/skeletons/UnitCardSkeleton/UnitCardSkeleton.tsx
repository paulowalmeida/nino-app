import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import ghost from './UnitCardSkeleton.module.css'

export const UnitCardSkeleton = () => (
  <Box as="section" className={ghost.panel}>
    <Text as="p" role="status" className={ghost.loadingLabel}>
      Carregando os dados da unidade
    </Text>

    <Box as="header" align="start" justify="between" wrap gap={3} mb={4}>
      <Skeleton className={ghost.title} />
      <Skeleton className={ghost.promote} />
    </Box>

    <Box direction="row" gap={0.5} className={ghost.tabs}>
      <Skeleton className={ghost.tab} />
      <Skeleton className={ghost.tab} />
    </Box>

    <Box className={ghost.fields}>
      <Box direction="column" gap={1.5}>
        <Skeleton className={ghost.label} />
        <Skeleton className={ghost.input} />
      </Box>
      <Box direction="column" gap={1.5}>
        <Skeleton className={ghost.label} />
        <Skeleton className={ghost.input} />
      </Box>
      <Box direction="column" gap={1.5}>
        <Skeleton className={ghost.label} />
        <Skeleton className={ghost.input} />
      </Box>
    </Box>

    <Box className={ghost.address}>
      <Skeleton className={ghost.groupTitle} />
      <Box className={ghost.addressGrid}>
        <Skeleton className={`${ghost.input} ${ghost.zip}`} />
        <Skeleton className={`${ghost.input} ${ghost.street}`} />
        <Skeleton className={`${ghost.input} ${ghost.number}`} />
        <Skeleton className={`${ghost.input} ${ghost.complement}`} />
        <Skeleton className={`${ghost.input} ${ghost.neighborhood}`} />
        <Skeleton className={`${ghost.input} ${ghost.city}`} />
        <Skeleton className={`${ghost.input} ${ghost.state}`} />
      </Box>
    </Box>

    <Skeleton className={ghost.save} />
  </Box>
)
