import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { CustomerContact } from '@pages/CustomerDetail/components/CustomerContact/CustomerContact'
import { CustomerHeader } from '@pages/CustomerDetail/components/CustomerHeader/CustomerHeader'
import { CustomerSummary } from '@pages/CustomerDetail/components/CustomerSummary/CustomerSummary'
import { CustomerWorkspace } from '@pages/CustomerDetail/components/CustomerWorkspace/CustomerWorkspace'
import { useCustomerDetailFacade } from '@pages/CustomerDetail/facades/useCustomerDetailFacade/useCustomerDetailFacade'
import { CustomerDetailSkeleton } from '@pages/CustomerDetail/skeletons/CustomerDetailSkeleton/CustomerDetailSkeleton'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import styles from './CustomerDetail.module.css'

export const CustomerDetail = () => {
  const { customer, isPending } = useCustomerDetailFacade()

  if (isPending) return <CustomerDetailSkeleton />

  if (!customer) {
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
        trail={[{ label: 'Clientes', to: '..' }, { label: customer.name }]}
      />
      <CustomerHeader />
      <CustomerSummary />
      <CustomerContact />
      <CustomerWorkspace />
    </Box>
  )
}
