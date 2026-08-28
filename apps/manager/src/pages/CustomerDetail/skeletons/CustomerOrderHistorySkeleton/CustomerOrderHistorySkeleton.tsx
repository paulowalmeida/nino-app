import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'

import ghost from './CustomerOrderHistorySkeleton.module.css'
import orders from '@pages/CustomerDetail/components/CustomerWorkspace/CustomerOrderHistory/CustomerOrderHistory.module.css'

const GHOST_ORDERS = ['first', 'second', 'third', 'fourth', 'fifth']

/* WHY: a régua de colunas não vira osso — já funciona sem os pedidos e
 * sumiria da tela se virasse barra cinza. */
export const CustomerOrderHistorySkeleton = () => (
  <Box className={orders.scroll}>
    <Table>
      <TableHeader className={orders.stickyHeader}>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className={orders.colRight}>Data</TableHead>
          <TableHead className={orders.colRight}>Total</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {GHOST_ORDERS.map((order) => (
          <TableRow key={order}>
            <TableCell>
              <Skeleton className={ghost.number} />
            </TableCell>
            <TableCell>
              <Skeleton className={ghost.status} />
            </TableCell>
            <TableCell className={orders.colRight}>
              <Skeleton className={ghost.createdAt} />
            </TableCell>
            <TableCell className={orders.colRight}>
              <Skeleton className={ghost.total} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Box>
)
