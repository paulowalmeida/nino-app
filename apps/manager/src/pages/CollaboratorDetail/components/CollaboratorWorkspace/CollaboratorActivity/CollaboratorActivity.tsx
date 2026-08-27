import type { ComponentProps } from 'react'

import { Box } from '@nino/ds/components/Box'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Grid } from '@nino/ds/components/Grid'
import { Heading } from '@nino/ds/components/Heading'
import { ListRow } from '@nino/ds/components/ListRow'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
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
  `Pedido #${ticketNumber(entry.orderId)}, ` +
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
      <>
        <Grid
          align="center"
          className={`${styles.grid} ${styles.columns}`}
          aria-hidden
        >
          {COLLABORATOR_DETAIL_COLUMNS.map((label) => (
            <Text
              key={label}
              as="span"
              size="xs"
              color="faintest"
              weight="bold"
              case="uppercase"
              align="right"
              className={styles.columnLabel}
            >
              {label}
            </Text>
          ))}
        </Grid>

        <ScrollArea className={styles.listScroll}>
          <Box as="ul" gap={0} className={styles.entries}>
            {activity.map((entry, index) => (
              <ListRow
                key={entry.id}
                divider={index === activity.length - 1 ? 'none' : 'bottom'}
                padding={0}
                className={motion.deal}
                style={riseDelay(index * 30 + 80)}
                aria-label={activityEntryAriaLabel(entry)}
              >
                <Grid
                  align="center"
                  className={`${styles.grid} ${styles.entryRow}`}
                  aria-hidden
                >
                  <Text
                    as="span"
                    size="sm"
                    color="faint"
                    weight="semibold"
                    className={styles.entryTicket}
                  >
                    #{ticketNumber(entry.orderId)}
                  </Text>

                  <Text
                    as="span"
                    size="sm"
                    color="strong"
                    weight="semibold"
                    className={styles.entryCustomer}
                  >
                    {entry.customerName ?? 'Visitante'}
                  </Text>

                  <Box
                    direction="row"
                    align="center"
                    gap={1.5}
                    className={styles.entryMeta}
                  >
                    <Text
                      as="span"
                      size="xs"
                      color="faint"
                      className={styles.entryChannel}
                    >
                      {CHANNEL_LABEL[entry.channel]}
                    </Text>
                    <Text
                      as="span"
                      size="xs"
                      color="faint"
                      aria-hidden
                      className={styles.entryDot}
                    >
                      ·
                    </Text>
                    <Text
                      as="span"
                      size="xs"
                      color="faint"
                      className={styles.entryStatus}
                    >
                      {STATUS_LABEL[entry.status]}
                    </Text>
                    <Text
                      as="span"
                      size="xs"
                      color="faint"
                      aria-hidden
                      className={styles.entryDot}
                    >
                      ·
                    </Text>
                    <time className={styles.entryAt} dateTime={entry.createdAt}>
                      <Text as="span" size="xs" color="faint">
                        {stamp.format(new Date(entry.createdAt))}
                      </Text>
                    </time>
                  </Box>

                  <Text
                    as="span"
                    size="sm"
                    color="strong"
                    weight="semibold"
                    align="right"
                    className={styles.entryTotal}
                  >
                    {brl(entry.totalAmount)}
                  </Text>
                </Grid>
              </ListRow>
            ))}
          </Box>
        </ScrollArea>
      </>
    )}
  </Box>
)
