import { Link } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import type { Order } from '@shared/types/order/order'
import { brl } from '@shared/utils/money/money'

import styles from './TableTabsList.module.css'

type TableTabsListProps = {
  orders: Order[]
  isPending: boolean
  isError: boolean
}

export const TableTabsList = ({
  orders,
  isPending,
  isError,
}: TableTabsListProps) => (
  <Box className={styles.page}>
    <Header
      title="Comandas"
      accent="Comandas"
      description="Acompanhe as mesas abertas e feche a conta quando o cliente pedir."
      mb={{ mobile: 3, desktop: 6 }}
    />
    {isPending && <Text color="muted">Carregando comandas…</Text>}
    {isError && (
      <Alert variant="error">
        Não foi possível carregar as comandas. Tente novamente.
      </Alert>
    )}
    {!isPending && !isError && orders.length === 0 && (
      <EmptyState size="md">Nenhuma comanda aberta.</EmptyState>
    )}
    {!isPending && !isError && orders.length > 0 && (
      <Box as="ul" className={styles.list}>
        {orders.map((order) => (
          <li key={order.id}>
            <Link className={styles.card} to={`../pedidos/${order.id}`}>
              <Box direction="row" justify="between" align="center">
                <Box direction="column" gap={0.5}>
                  <Text weight="bold">
                    {order.tableNumber || order.guestName || 'Comanda sem identificação'}
                  </Text>
                  <Text size="sm" color="muted">
                    Pedido #{order.orderNumber}
                  </Text>
                </Box>
                <Text weight="bold">{brl(Number(order.totalAmount))}</Text>
              </Box>
            </Link>
          </li>
        ))}
      </Box>
    )}
  </Box>
)
