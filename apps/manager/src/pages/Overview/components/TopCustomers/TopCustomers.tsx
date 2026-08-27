import { Box } from '@nino/ds/components/Box'
import { useOverviewFacade } from '@pages/Overview/facades/useOverviewFacade/useOverviewFacade'
import { brl } from '@shared/utils/money/money'

import { CustomerRankingCard } from './CustomerRankingCard/CustomerRankingCard'

import styles from './TopCustomers.module.css'

export const TopCustomers = () => {
  const { topCustomersSpent: bySpent, topCustomersOrders: byOrders } =
    useOverviewFacade()

  const spentBars = bySpent.topCustomers.map((customer) => ({
    id: customer.id,
    label: customer.name,
    value: customer.spent,
    display: brl(customer.spent),
  }))

  const ordersBars = byOrders.topCustomers.map((customer) => ({
    id: customer.id,
    label: customer.name,
    value: customer.orders,
    display: String(customer.orders),
  }))

  return (
    <Box className={styles.grid}>
      <CustomerRankingCard
        label="Quem mais gasta"
        isPending={bySpent.isPending}
        items={spentBars}
      />
      <CustomerRankingCard
        label="Quem mais pede"
        isPending={byOrders.isPending}
        items={ordersBars}
      />
    </Box>
  )
}
