import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CollaboratorActivitySkeleton } from '@pages/CollaboratorDetail/skeletons/CollaboratorActivitySkeleton/CollaboratorActivitySkeleton'

import ghost from './CollaboratorWorkspaceSkeleton.module.css'
import workspace from '@pages/CollaboratorDetail/components/CollaboratorWorkspace/CollaboratorWorkspace.module.css'

const GHOST_TABS = ['activity', 'access']

/* WHY: só a aba de atividade abre por padrão, então é a única que o esqueleto
 * desenha — a de acesso só existe depois do clique. */
export const CollaboratorWorkspaceSkeleton = () => (
  <Box className={workspace.panels}>
    <Box direction="row" className={ghost.tabBar}>
      {GHOST_TABS.map((tab) => (
        <Skeleton key={tab} className={ghost.tab} />
      ))}
    </Box>

    <Box className={ghost.panel}>
      <CollaboratorActivitySkeleton />
    </Box>
  </Box>
)
