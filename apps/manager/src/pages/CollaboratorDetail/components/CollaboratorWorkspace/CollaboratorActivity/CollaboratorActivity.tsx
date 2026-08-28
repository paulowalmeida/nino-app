import type { ComponentProps } from 'react'

import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nino/ds/components/Table'
import { Text } from '@nino/ds/components/Text'
import { COLLABORATOR_DETAIL_COLUMNS } from '@pages/CollaboratorDetail/constants/collaborator-detail.constants'
import { CHANNEL_LABEL, STATUS_LABEL } from '@shared/constants/order.constants'
import type { StaffActivityEntry } from '@shared/types/team/staff-activity-entry'
import { brl } from '@shared/utils/money/money'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './CollaboratorActivity.module.css'

const stamp = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

const activityEntryAriaLabel = (entry: StaffActivityEntry): string =>
  `Pedido #${ticketNumber(entry.orderNumber)}, ` +
  `${entry.customerName ?? 'Visitante'}, ` +
  `${CHANNEL_LABEL[entry.channel]}, ${STATUS_LABEL[entry.status]}, ` +
  `${stamp.format(new Date(entry.createdAt))}, ${brl(entry.totalAmount)}`

export type CollaboratorActivityProps = {
  activity: StaffActivityEntry[]
  headingLevel: ComponentProps<typeof Heading>['level']
}

export const CollaboratorActivity = ({
  activity,
  headingLevel,
}: CollaboratorActivityProps) => (
  <Box
    as="section"
    direction="column"
    grow
    shrink
    className={styles.activity}
    aria-label="Atividade recente"
  >
    <Box
      direction="row"
      align="baseline"
      justify="between"
      wrap
      className={styles.activityHead}
    >
      <Heading
        level={headingLevel}
        size="sm"
        color="faint"
        className={styles.activityTitle}
      >
        Atividade recente
      </Heading>
      <Text as="p" size="xs" color="faint">
        Últimas 30 mudanças
      </Text>
    </Box>

    {activity.length === 0 ? (
      <EmptyState className={styles.empty}>
        Nenhum pedido passou pela mão desta pessoa ainda.
      </EmptyState>
    ) : (
      <ScrollArea className={styles.listScroll}>
        <Table>
          <TableHeader className={styles.stickyHeader}>
            <TableRow>
              {COLLABORATOR_DETAIL_COLUMNS.map((label, index) => (
                <TableHead
                  key={label}
                  className={index > 1 ? styles.colRight : undefined}
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {activity.map((entry, index) => (
              <TableRow
                key={entry.id}
                className={motion.deal}
                style={riseDelay(index * 30 + 80)}
                aria-label={activityEntryAriaLabel(entry)}
              >
                <TableCell className={styles.entryTicket}>
                  #{ticketNumber(entry.orderNumber)}
                </TableCell>

                <TableCell className={styles.entryCustomer}>
                  {entry.customerName ?? 'Visitante'}
                </TableCell>

                <TableCell className={styles.colRight}>
                  {CHANNEL_LABEL[entry.channel]}
                </TableCell>

                <TableCell className={styles.colRight}>
                  {STATUS_LABEL[entry.status]}
                </TableCell>

                <TableCell className={styles.colRight}>
                  <time dateTime={entry.createdAt}>
                    {stamp.format(new Date(entry.createdAt))}
                  </time>
                </TableCell>

                <TableCell className={styles.entryTotal}>
                  {brl(entry.totalAmount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    )}
  </Box>
)
