import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import ghost from './CustomerSummarySkeleton.module.css'
import summary from '@pages/CustomerDetail/components/CustomerSummary/CustomerSummary.module.css'

const GHOST_FACTS = ['spent', 'orders', 'points']

export const CustomerSummarySkeleton = () => (
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
