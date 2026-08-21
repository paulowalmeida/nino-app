import { useParams } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Eyebrow } from '@nino/ds/components/Eyebrow'
import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Tabs } from '@nino/ds/components/Tabs'
import { Text } from '@nino/ds/components/Text'
import { Breadcrumb } from '@atoms/Breadcrumb/Breadcrumb'
import { PersonMark } from '@atoms/PersonMark/PersonMark'
import {
  CustomerAddresses,
} from '@molecules/CustomerAddresses/CustomerAddresses'
import { CustomerContact } from '@organisms/CustomerContact/CustomerContact'
import {
  CustomerOrderHistory,
} from '@organisms/CustomerOrderHistory/CustomerOrderHistory'
import { CustomerSummary } from '@organisms/CustomerSummary/CustomerSummary'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useCustomer } from '@hooks/customer/useCustomer'
import { useCustomerOrders } from '@hooks/customer/useCustomerOrders'
import { lastOrderLabel } from '@utils/order-recency'
import {
  CustomerDetailSkeleton,
} from '@skeletons/pages/CustomerDetailSkeleton/CustomerDetailSkeleton'

import styles from './CustomerDetail.module.css'
import motion from '@styles/motion.module.css'

const monthYear = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
  year: 'numeric',
})

const countedLabel = (name: string, count: number | undefined): string =>
  count === undefined ? name : `${name} · ${count}`

export const CustomerDetail = () => {
  const { customerId } = useParams()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { data: customer, isPending } = useCustomer(
    tenantId,
    customerId as string
  )

  const { total: totalOrders } = useCustomerOrders(
    tenantId,
    customerId as string
  )

  if (isPending) return <CustomerDetailSkeleton />

  if (!customer) {
    return (
      <div className={styles.page}>
        <Breadcrumb trail={[{ label: 'Clientes', to: '..' }, { label: '—' }]} />
        <EmptyState>
          Esta pessoa não tem pedido nesta loja.
        </EmptyState>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Breadcrumb
        trail={[
          { label: 'Clientes', to: '..' },
          { label: customer.name },
        ]}
      />

      <Box
        as="header"
        direction="row"
        gap={4}
        align="center"
        className={`${motion.settle} ${styles.hero}`}
      >
        <PersonMark name={customer.name} className={styles.mark} />

        <div className={styles.heroText}>
          <Eyebrow>Cliente</Eyebrow>
          <Heading level={1} size="xl" className={styles.name}>
            {customer.name}
          </Heading>
          <Text className={styles.cadence}>
            Cliente desde {monthYear.format(new Date(customer.since))}
            {' · '}
            {lastOrderLabel(customer.lastOrderAt)}
          </Text>
        </div>
      </Box>

      <CustomerSummary customer={customer} />

      <CustomerContact customer={customer} />

      <Tabs
        className={styles.panels}
        tabs={[
          {
            value: 'orders',
            label: countedLabel('Pedidos', totalOrders),
            content: (
              <CustomerOrderHistory
                tenantId={tenantId}
                customerId={customerId as string}
                customerName={customer.name}
              />
            ),
          },
          {
            value: 'addresses',
            label: countedLabel('Endereços', customer.addresses.length),
            content: <CustomerAddresses addresses={customer.addresses} />,
          },
        ]}
      />
    </div>
  )
}
