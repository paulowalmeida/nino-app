import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'

import ghost from './CollaboratorSummarySkeleton.module.css'
import summary from '@pages/CollaboratorDetail/components/CollaboratorWorkspace/CollaboratorSummary/CollaboratorSummary.module.css'

const GHOST_FACTS = ['revenue', 'orders', 'changes']

export const CollaboratorSummarySkeleton = () => (
  <Box as="section" aria-label="Resumo do trabalho" className={summary.strip}>
    <Box className={summary.facts}>
      {GHOST_FACTS.map((fact) => (
        <Box key={fact} className={summary.fact}>
          <Skeleton className={ghost.factLabel} />
          <Skeleton className={ghost.factValue} />
        </Box>
      ))}
    </Box>

    <Box className={summary.footnote}>
      <Skeleton className={ghost.footnote} />
    </Box>
  </Box>
)
