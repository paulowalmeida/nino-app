import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { ConsumerOrderHistorySkeleton } from '@pages/ConsumerDetail/skeletons/ConsumerOrderHistorySkeleton/ConsumerOrderHistorySkeleton'

import ghost from './ConsumerWorkspaceSkeleton.module.css'
import workspace from '@pages/ConsumerDetail/components/ConsumerWorkspace/ConsumerWorkspace.module.css'

const GHOST_TABS = ['orders', 'addresses']

/* WHY: só a aba de pedidos abre por padrão, então é a única que o esqueleto
 * desenha — a de endereços só existe depois do clique. */
export const ConsumerWorkspaceSkeleton = () => (
  <Box className={workspace.panels}>
    <Box direction="row" className={ghost.tabBar}>
      {GHOST_TABS.map((tab) => (
        <Skeleton key={tab} className={ghost.consumerWorkspaceSkeletonTab} />
      ))}
    </Box>

    <Box className={ghost.consumerWorkspaceSkeletonPanel}>
      <ConsumerOrderHistorySkeleton />
    </Box>
  </Box>
)
