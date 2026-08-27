import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { CollaboratorContact } from '@pages/CollaboratorDetail/components/CollaboratorContact/CollaboratorContact'
import { CollaboratorHeader } from '@pages/CollaboratorDetail/components/CollaboratorHeader/CollaboratorHeader'
import { CollaboratorSummary } from '@pages/CollaboratorDetail/components/CollaboratorSummary/CollaboratorSummary'
import { CollaboratorWorkspace } from '@pages/CollaboratorDetail/components/CollaboratorWorkspace/CollaboratorWorkspace'
import { useCollaboratorDetailFacade } from '@pages/CollaboratorDetail/facades/useCollaboratorDetailFacade/useCollaboratorDetailFacade'
import { CollaboratorDetailSkeleton } from '@pages/CollaboratorDetail/skeletons/CollaboratorDetailSkeleton/CollaboratorDetailSkeleton'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import styles from './CollaboratorDetail.module.css'

export const CollaboratorDetail = () => {
  const { member, isPending, isError } = useCollaboratorDetailFacade()

  if (isPending) return <CollaboratorDetailSkeleton />

  if (isError) {
    return (
      <Box className={styles.page}>
        <Breadcrumb trail={[{ label: 'Equipe', to: '..' }, { label: '—' }]} />
        <Alert variant="error" title="Não foi possível carregar a pessoa">
          Tente novamente em alguns instantes.
        </Alert>
      </Box>
    )
  }

  if (!member) {
    return (
      <Box className={styles.page}>
        <Breadcrumb trail={[{ label: 'Equipe', to: '..' }, { label: '—' }]} />
        <EmptyState>Esta pessoa não está mais nesta loja.</EmptyState>
      </Box>
    )
  }

  return (
    <Box className={styles.page}>
      <Breadcrumb
        trail={[{ label: 'Equipe', to: '..' }, { label: member.user.name }]}
      />
      <CollaboratorHeader member={member} />
      <CollaboratorSummary member={member} />
      <CollaboratorContact member={member} />
      <CollaboratorWorkspace />
    </Box>
  )
}
