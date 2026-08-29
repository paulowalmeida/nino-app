import { useState } from 'react'
import { Link } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Chip } from '@nino/ds/components/Chip'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import type { Order } from '@shared/types/order/order'
import { brl } from '@shared/utils/money/money'

import motion from '@styles/motion.module.css'
import styles from './TableTabsList.module.css'

type TableTabsListProps = {
  openOrders: Order[]
  closedOrders: Order[]
  isPending: boolean
  isError: boolean
}

export const TableTabsList = ({
  openOrders,
  closedOrders,
  isPending,
  isError,
}: TableTabsListProps) => {
  const [selectedTab, setSelectedTab] = useState<'open' | 'closed'>('open')
  const orders = selectedTab === 'open' ? openOrders : closedOrders

  return (
    <Box className={styles.page}>
      <Header
        className={motion.deal}
        title="Comandas"
        accent="Comandas"
        description="Acompanhe as mesas abertas e feche a conta quando o cliente pedir."
      />
      <Box
        direction="row"
        role="tablist"
        aria-label="Estado das comandas"
        className={`${motion.unroll} ${styles.tabs}`}
      >
        <Chip
          variant="tab"
          selected={selectedTab === 'open'}
          onClick={() => setSelectedTab('open')}
        >
          Abertas ({openOrders.length})
        </Chip>
        <Chip
          variant="tab"
          selected={selectedTab === 'closed'}
          onClick={() => setSelectedTab('closed')}
        >
          Fechadas ({closedOrders.length})
        </Chip>
      </Box>
      {isPending && <Text color="muted">Carregando comandas…</Text>}
      {isError && (
        <Alert variant="error">
          Não foi possível carregar as comandas. Tente novamente.
        </Alert>
      )}
      {!isPending && !isError && orders.length === 0 && (
        <EmptyState size="md" className={motion.settle}>
          {selectedTab === 'open'
            ? 'Nenhuma comanda aberta.'
            : 'Nenhuma comanda fechada.'}
        </EmptyState>
      )}
      {!isPending && !isError && orders.length > 0 && (
        <Box
          key={selectedTab}
          as="ul"
          className={`${motion.unroll} ${styles.list}`}
        >
          {orders.map((order) => (
            <li key={order.id} className={motion.deal}>
              <Link className={styles.card} to={`../comandas/${order.id}`}>
                <Box direction="row" justify="between" align="start">
                  <Box direction="column" gap={0.5}>
                    <Text size="sm" color="muted">
                      Comanda #{order.orderNumber}
                    </Text>
                    <Text weight="bold" size="lg">
                      {order.tableNumber ||
                        order.guestName ||
                        'Sem identificação'}
                    </Text>
                  </Box>
                  <Badge
                    variant={selectedTab === 'open' ? 'brand' : 'default'}
                    size="sm"
                  >
                    {selectedTab === 'open' ? 'Aberta' : 'Fechada'}
                  </Badge>
                </Box>
                <Box direction="row" justify="between" align="end">
                  <Text size="sm" color="muted">
                    {order.items.length}{' '}
                    {order.items.length === 1 ? 'item' : 'itens'}
                  </Text>
                  <Text weight="bold" size="lg">
                    {brl(Number(order.totalAmount))}
                  </Text>
                </Box>
              </Link>
            </li>
          ))}
        </Box>
      )}
    </Box>
  )
}
