import { useParams } from 'react-router'

import { Breadcrumb } from '@atoms/Breadcrumb/Breadcrumb'
import { CollaboratorContentContainer } from '@containers/CollaboratorContentContainer/CollaboratorContentContainer'
import { CollaboratorHeaderContainer } from '@containers/CollaboratorHeaderContainer/CollaboratorHeaderContainer'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useStaffDetail } from '@hooks/team/useStaffDetail'
import { Alert } from '@nino/ds/components/Alert'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Box } from '@nino/ds/components/Box'
import { CollaboratorDetailSkeleton } from '@skeletons/pages/CollaboratorDetailSkeleton/CollaboratorDetailSkeleton'

import styles from './CollaboratorDetail.module.css'

export const CollaboratorDetail = () => {
  const { userId } = useParams()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const {
    data: member,
    isPending,
    isError,
  } = useStaffDetail(tenantId, userId as string)

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
      <CollaboratorHeaderContainer member={member} />

      <CollaboratorContentContainer member={member} activityHeadingLevel={2} />
    </Box>
  )
}
