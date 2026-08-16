import { Flexbox } from '@nino/ds/components/Flexbox'
import { Link, useParams } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import { Breadcrumb } from '@atoms/Breadcrumb/Breadcrumb'
import { PersonMark } from '@atoms/PersonMark/PersonMark'
import {
  CustomerAddresses,
} from '@molecules/CustomerAddresses/CustomerAddresses'
import {
  CustomerPersonalData,
} from '@organisms/CustomerPersonalData/CustomerPersonalData'
import { CustomerSummary } from '@organisms/CustomerSummary/CustomerSummary'
import { STATUS_LABEL } from '@constants/order.constants'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useCustomer } from '@hooks/customer/useCustomer'
import { useCustomerOrders } from '@hooks/customer/useCustomerOrders'
import { useLoadMore } from '@hooks/ui/useLoadMore'
import { brl } from '@utils/money'
import { statusBadgeVariant } from '@utils/order-badge'
import { riseDelay } from '@utils/rise-delay'
import {
  CustomerDetailSkeleton,
} from '@skeletons/pages/CustomerDetailSkeleton/CustomerDetailSkeleton'
import { ticketNumber } from '@utils/order-flow'

import styles from './CustomerDetail.module.css'
import motion from '@styles/motion.module.css'

const stamp = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const CustomerDetail = () => {
  const { customerId } = useParams()
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { data: customer, isPending } = useCustomer(
    tenantId,
    customerId as string
  )

  const {
    orders,
    total: totalOrders,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useCustomerOrders(tenantId, customerId as string)

  const sentinelRef = useLoadMore(!!hasNextPage, () => void fetchNextPage())

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

      <p className={styles.eyebrow}>Cliente</p>

      <Flexbox
        as="header"
        direction="row"
        gap={4}
        align="center"
        mt={1}
        className={motion.settle}
      >
        <PersonMark name={customer.name} className={styles.mark} />

        <div className={styles.heroText}>
          <h1 className={styles.name}>{customer.name}</h1>
        </div>
      </Flexbox>

      <div className={styles.body}>
        <div className={styles.summary}>
          <CustomerPersonalData customer={customer} />

          <CustomerSummary customer={customer} />

          <CustomerAddresses addresses={customer.addresses} />
        </div>

        <section className={styles.history} aria-label="Últimos pedidos">
        <div className={styles.historyHead}>
          <h2 className={styles.historyTitle}>Últimos pedidos</h2>
          <p className={styles.historyWindow}>
            {totalOrders !== undefined
              ? `${totalOrders} nos últimos 90 dias`
              : '90 dias ou 90 pedidos — o que vier primeiro'}
          </p>
        </div>

        {orders.length === 0 ? (
          <EmptyState className={styles.empty}>
            Nenhum pedido nos últimos 90 dias.
          </EmptyState>
        ) : (
          <ScrollArea className={styles.ordersScroll}>
            <ul className={styles.orders}>
            {orders.map((order, index) => (
              <li
                key={order.id}
                className={`${motion.deal} ${styles.order}`}
                style={riseDelay(index * 40 + 80)}
              >
                <Link
                  to={`../../pedidos/${order.id}`}
                  relative="path"
                  className={`${motion.lift} ${styles.orderLink}`}
                >
                  <span className={styles.orderNumber}>
                    #{ticketNumber(order.id)}
                  </span>
                  <Badge
                    size="sm"
                    variant={statusBadgeVariant(order.status)}
                    className={styles.orderStatus}
                  >
                    {STATUS_LABEL[order.status]}
                  </Badge>
                  <time className={styles.orderAt} dateTime={order.createdAt}>
                    {stamp.format(new Date(order.createdAt))}
                  </time>
                  <span className={styles.orderTotal}>
                    {brl(order.totalAmount)}
                  </span>
                </Link>
              </li>
            ))}
            </ul>

            {/* sentinela: entra em cena e puxa a próxima página sozinha */}
            <div ref={sentinelRef} className={styles.sentinel}>
              {isFetchingNextPage && (
                <span className={styles.loadingMore}>
                  Carregando mais pedidos…
                </span>
              )}
            </div>
          </ScrollArea>
        )}
        </section>
      </div>
    </div>
  )
}
