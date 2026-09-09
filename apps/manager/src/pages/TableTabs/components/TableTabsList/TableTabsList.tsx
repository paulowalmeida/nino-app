import { useState } from 'react'
import { Link } from 'react-router'

import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Chip } from '@nino/ds/components/Chip'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Header } from '@nino/ds/components/Header'
import { Input } from '@nino/ds/components/Input'
import { ListRow } from '@nino/ds/components/ListRow'
import { Text } from '@nino/ds/components/Text'
import { TableTabsListSkeleton } from '@pages/TableTabs/skeletons/TableTabsListSkeleton/TableTabsListSkeleton'
import { filterTableTabs } from '@pages/TableTabs/utils/filterTableTabs/filterTableTabs'
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
  const [search, setSearch] = useState('')
  const selectedOrders = selectedTab === 'open' ? openOrders : closedOrders
  const isSearching = search.trim().length > 0
  const searchableOrders = isSearching
    ? [...openOrders, ...closedOrders]
    : selectedOrders
  const orders = filterTableTabs(searchableOrders, search)

  return (
    <Box className={styles.page}>
      <Box className={styles.controls}>
        <Header
          className={motion.deal}
          title="Comandas"
          accent="Comandas"
          description="Acompanhe as mesas abertas e feche a conta quando o cliente pedir."
        />
        <Input
          type="search"
          value={search}
          placeholder="Buscar por nome, mesa ou número da comanda"
          aria-label="Buscar comandas por nome, mesa ou número da comanda"
          className={styles.search}
          onChange={(event) => setSearch(event.target.value)}
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
      </Box>

      <Box className={styles.scrollArea}>
        {isPending && <TableTabsListSkeleton />}
        {isError && (
          <Alert variant="error">
            Não foi possível carregar as comandas. Tente novamente.
          </Alert>
        )}
        {!isPending && !isError && orders.length === 0 && (
          <EmptyState size="md" className={motion.settle}>
            {search.trim()
              ? 'Nenhuma comanda encontrada para esta busca.'
              : selectedTab === 'open'
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
              <ListRow
                key={order.id}
                divider="none"
                padding={0}
                className={motion.deal}
              >
                <Card
                  variant="flat"
                  padding="none"
                  asChild
                  className={`${styles.card} w-full`}
                >
                  <Link to={`../comandas/${order.id}`}>
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
                        variant={
                          openOrders.some(({ id }) => id === order.id)
                            ? 'brand'
                            : 'default'
                        }
                        size="sm"
                      >
                        {openOrders.some(({ id }) => id === order.id)
                          ? 'Aberta'
                          : 'Fechada'}
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
                </Card>
              </ListRow>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
