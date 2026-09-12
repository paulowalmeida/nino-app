import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { ConsumerContact } from '@pages/ConsumerDetail/components/ConsumerContact/ConsumerContact'
import { ConsumerHeader } from '@pages/ConsumerDetail/components/ConsumerHeader/ConsumerHeader'
import { ConsumerSummary } from '@pages/ConsumerDetail/components/ConsumerSummary/ConsumerSummary'
import { ConsumerWorkspace } from '@pages/ConsumerDetail/components/ConsumerWorkspace/ConsumerWorkspace'
import { useConsumerDetailFacade } from '@pages/ConsumerDetail/facades/useConsumerDetailFacade/useConsumerDetailFacade'
import { ConsumerDetailSkeleton } from '@pages/ConsumerDetail/skeletons/ConsumerDetailSkeleton/ConsumerDetailSkeleton'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import styles from './ConsumerDetail.module.css'

export const ConsumerDetail = () => {
  const { consumer, isPending } = useConsumerDetailFacade()

  if (isPending) return <ConsumerDetailSkeleton />

  if (!consumer) {
    return (
      <Box className={styles.page}>
        <Breadcrumb trail={[{ label: 'Clientes', to: '..' }, { label: '—' }]} />
        <EmptyState>Esta pessoa não tem pedido nesta loja.</EmptyState>
      </Box>
    )
  }

  return (
    <Box className={styles.page}>
      <Breadcrumb
        trail={[{ label: 'Clientes', to: '..' }, { label: consumer.name }]}
      />
      <ConsumerHeader />
      <ConsumerSummary />
      <ConsumerContact />
      <ConsumerWorkspace />
    </Box>
  )
}
