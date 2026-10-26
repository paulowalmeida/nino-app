import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { PositionDetailForm } from '@pages/PositionDetail/components/PositionDetailForm/PositionDetailForm'
import { PositionDetailHeader } from '@pages/PositionDetail/components/PositionDetailHeader/PositionDetailHeader'
import { usePositionDetailFacade } from '@pages/PositionDetail/facades/usePositionDetailFacade/usePositionDetailFacade'
import { PositionDetailSkeleton } from '@pages/PositionDetail/skeletons/PositionDetailSkeleton/PositionDetailSkeleton'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import styles from './PositionDetail.module.css'

export const PositionDetail = () => {
  const { isCreating, position, isPending, isError } =
    usePositionDetailFacade()

  if (isPending) {
    return (
      <Box className={styles.positionDetailPage}>
        <PositionDetailSkeleton />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box className={styles.positionDetailPage}>
        <Breadcrumb trail={[{ label: 'Cargos', to: '..' }, { label: '—' }]} />
        <Alert variant="error" title="Não foi possível carregar o cargo">
          Tente novamente em alguns instantes.
        </Alert>
      </Box>
    )
  }

  if (!isCreating && !position) {
    return (
      <Box className={styles.positionDetailPage}>
        <Breadcrumb trail={[{ label: 'Cargos', to: '..' }, { label: '—' }]} />
        <EmptyState>Este cargo não existe mais nesta loja.</EmptyState>
      </Box>
    )
  }

  return (
    <Box className={styles.positionDetailPage}>
      <PositionDetailHeader />
      <PositionDetailForm />
    </Box>
  )
}
