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
import { Text } from '@nino/ds/components/Text'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import ghost from './CustomerDetailSkeleton.module.css'
import contact from '@pages/CustomerDetail/components/CustomerContact/CustomerContact.module.css'
import hero from '@pages/CustomerDetail/components/CustomerHeader/CustomerHeader.module.css'
import summary from '@pages/CustomerDetail/components/CustomerSummary/CustomerSummary.module.css'
import orders from '@pages/CustomerDetail/components/CustomerWorkspace/CustomerOrderHistory/CustomerOrderHistory.module.css'
import workspace from '@pages/CustomerDetail/components/CustomerWorkspace/CustomerWorkspace.module.css'
import page from '@pages/CustomerDetail/CustomerDetail.module.css'

const GHOST_FACTS = ['spent', 'orders', 'points']
const GHOST_TABS = ['orders', 'addresses']
const GHOST_ORDERS = ['first', 'second', 'third', 'fourth', 'fifth']

/* WHY: o Breadcrumb e o cabeçalho da tabela não viram osso — já funcionam
 * sem o cliente e sumiriam da tela se virassem barra cinza. */
export const CustomerDetailSkeleton = () => (
  <Box className={page.page}>
    <Breadcrumb trail={[{ label: 'Clientes', to: '..' }, { label: '—' }]} />

    <Text as="p" role="status" className="sr-only">
      Carregando o cliente
    </Text>

    <Box
      as="header"
      direction="row"
      gap={4}
      align="center"
      className={hero.hero}
    >
      <Skeleton variant="circle" className={hero.mark} />

      <Box className={hero.heroText}>
        <Skeleton className={ghost.eyebrow} />
        <Skeleton className={ghost.name} />
        <Skeleton className={ghost.cadence} />
      </Box>
    </Box>

    <Box as="section" aria-label="Resumo" className={summary.strip}>
      <Box className={summary.facts}>
        {GHOST_FACTS.map((fact) => (
          <Box key={fact} className={summary.fact}>
            <Skeleton className={ghost.factLabel} />
            <Skeleton className={ghost.factValue} />
          </Box>
        ))}
      </Box>
    </Box>

    <Box
      as="section"
      aria-label="Contato"
      direction="row"
      gap={{ mobile: 2, desktop: 4 }}
      align="center"
      wrap
      className={contact.contact}
    >
      <Box direction="row" gap={2} wrap className={contact.actions}>
        <Skeleton className={ghost.action} />
        <Skeleton className={ghost.action} />
      </Box>

      <Skeleton className={ghost.document} />
    </Box>

    <Box className={workspace.panels}>
      <Box direction="row" className={ghost.tabBar}>
        {GHOST_TABS.map((tab) => (
          <Skeleton key={tab} className={ghost.tab} />
        ))}
      </Box>

      <Box className={ghost.panel}>
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
                    <Skeleton className={ghost.orderNumber} />
                  </TableCell>
                  <TableCell>
                    <Skeleton className={ghost.orderStatus} />
                  </TableCell>
                  <TableCell className={orders.colRight}>
                    <Skeleton className={ghost.orderAt} />
                  </TableCell>
                  <TableCell className={orders.colRight}>
                    <Skeleton className={ghost.orderTotal} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </Box>
  </Box>
)
