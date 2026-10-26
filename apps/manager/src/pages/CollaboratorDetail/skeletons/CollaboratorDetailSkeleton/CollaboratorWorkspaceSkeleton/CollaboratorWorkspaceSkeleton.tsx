import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { CollaboratorSummarySkeleton } from '@pages/CollaboratorDetail/skeletons/CollaboratorDetailSkeleton/CollaboratorWorkspaceSkeleton/CollaboratorSummarySkeleton/CollaboratorSummarySkeleton'

import ghost from './CollaboratorWorkspaceSkeleton.module.css'
import workspace from '@pages/CollaboratorDetail/components/CollaboratorWorkspace/CollaboratorWorkspace.module.css'

const GHOST_TABS = ['overview', 'activity', 'access']

/* WHY: só a aba geral abre por padrão, então é a única que o esqueleto
 * desenha — as outras só existem depois do clique. */
export const CollaboratorWorkspaceSkeleton = () => (
  <Box className={workspace.panels}>
    <Box direction="row" className={ghost.tabBar}>
      {GHOST_TABS.map((tab) => (
        <Skeleton
          key={tab}
          className={ghost.collaboratorWorkspaceSkeletonTab}
        />
      ))}
    </Box>

    <Box className={ghost.collaboratorWorkspaceSkeletonPanel}>
      <CollaboratorSummarySkeleton />
    </Box>
  </Box>
)
