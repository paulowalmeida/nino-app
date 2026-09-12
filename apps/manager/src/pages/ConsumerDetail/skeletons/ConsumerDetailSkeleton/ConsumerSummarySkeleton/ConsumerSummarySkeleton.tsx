import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import ghost from './ConsumerSummarySkeleton.module.css'
import summary from '@pages/ConsumerDetail/components/ConsumerSummary/ConsumerSummary.module.css'

const GHOST_FACTS = ['spent', 'orders', 'points']

export const ConsumerSummarySkeleton = () => (
  <Box as="section" aria-label="Resumo" className={summary.strip}>
    <Box className={summary.facts}>
      {GHOST_FACTS.map((fact) => (
        <Box key={fact} className={summary.fact}>
          <Skeleton className={ghost.factLabel} />
          <Skeleton className={ghost.factValue} />
        </Box>
      ))}
    </Box>
  </Box>
)
