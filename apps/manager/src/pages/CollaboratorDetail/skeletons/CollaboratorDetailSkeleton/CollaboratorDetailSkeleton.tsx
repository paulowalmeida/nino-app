import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { CollaboratorContactSkeleton } from '@pages/CollaboratorDetail/skeletons/CollaboratorDetailSkeleton/CollaboratorContactSkeleton/CollaboratorContactSkeleton'
import { CollaboratorHeaderSkeleton } from '@pages/CollaboratorDetail/skeletons/CollaboratorDetailSkeleton/CollaboratorHeaderSkeleton/CollaboratorHeaderSkeleton'
import { CollaboratorSummarySkeleton } from '@pages/CollaboratorDetail/skeletons/CollaboratorDetailSkeleton/CollaboratorSummarySkeleton/CollaboratorSummarySkeleton'
import { CollaboratorWorkspaceSkeleton } from '@pages/CollaboratorDetail/skeletons/CollaboratorDetailSkeleton/CollaboratorWorkspaceSkeleton/CollaboratorWorkspaceSkeleton'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import page from '@pages/CollaboratorDetail/CollaboratorDetail.module.css'

/* WHY: o Breadcrumb não vira osso — já navega sem a pessoa carregada e
 * sumiria da tela se virasse barra cinza. */
export const CollaboratorDetailSkeleton = () => (
  <Box className={page.page}>
    <Breadcrumb trail={[{ label: 'Equipe', to: '..' }, { label: '—' }]} />

    <Text as="p" role="status" className="sr-only">
      Carregando a pessoa
    </Text>

    <CollaboratorHeaderSkeleton />
    <CollaboratorSummarySkeleton />
    <CollaboratorContactSkeleton />
    <CollaboratorWorkspaceSkeleton />
  </Box>
)
