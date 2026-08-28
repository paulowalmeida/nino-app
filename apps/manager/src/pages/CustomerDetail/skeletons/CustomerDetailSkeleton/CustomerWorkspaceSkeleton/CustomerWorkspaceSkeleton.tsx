import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CustomerOrderHistorySkeleton } from '@pages/CustomerDetail/skeletons/CustomerOrderHistorySkeleton/CustomerOrderHistorySkeleton'

import ghost from './CustomerWorkspaceSkeleton.module.css'
import workspace from '@pages/CustomerDetail/components/CustomerWorkspace/CustomerWorkspace.module.css'

const GHOST_TABS = ['orders', 'addresses']

/* WHY: só a aba de pedidos abre por padrão, então é a única que o esqueleto
 * desenha — a de endereços só existe depois do clique. */
export const CustomerWorkspaceSkeleton = () => (
  <Box className={workspace.panels}>
    <Box direction="row" className={ghost.tabBar}>
      {GHOST_TABS.map((tab) => (
        <Skeleton key={tab} className={ghost.tab} />
      ))}
    </Box>

    <Box className={ghost.panel}>
      <CustomerOrderHistorySkeleton />
    </Box>
  </Box>
)
