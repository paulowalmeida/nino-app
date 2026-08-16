import { EmptyState } from '@nino/ds/components/EmptyState'
import { ScrollArea } from '@nino/ds/components/ScrollArea'
import {
  CHANNEL_LABEL,
  STATUS_LABEL,
} from '@constants/order.constants'
import { COLLABORATOR_DETAIL_COLUMNS } from '@constants/team.constants'
import type {
  StaffActivityEntry,
} from '@custom_types/team/staff-activity-entry'
import { brl } from '@utils/money'
import { ticketNumber } from '@utils/order-flow'
import { riseDelay } from '@utils/rise-delay'

import styles from './CollaboratorActivity.module.css'
import motion from '@styles/motion.module.css'

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

type CollaboratorActivityProps = {
  activity: StaffActivityEntry[]
}

export const CollaboratorActivity = ({
  activity,
}: CollaboratorActivityProps) => (
  <section className={styles.activity} aria-label="Atividade recente">
    <div className={styles.activityHead}>
      <h2 className={styles.activityTitle}>Atividade recente</h2>
      <p className={styles.activityHint}>Últimas 30 mudanças</p>
    </div>

    {activity.length === 0 ? (
      <EmptyState className={styles.empty}>
        Nenhum pedido passou pela mão desta pessoa ainda.
      </EmptyState>
    ) : (
      <>
        <div className={`${styles.grid} ${styles.columns}`} aria-hidden>
          {COLLABORATOR_DETAIL_COLUMNS.map((label) => (
            <span key={label} className={styles.columnLabel}>
              {label}
            </span>
          ))}
        </div>

        <ScrollArea className={styles.listScroll}>
          <ul className={styles.entries}>
            {activity.map((entry, index) => (
              <li
                key={entry.id}
                className={`${motion.deal} ${styles.entry}`}
                style={riseDelay(index * 30 + 80)}
                aria-label={activityEntryAriaLabel(entry)}
              >
                <div
                  className={`${styles.grid} ${styles.entryRow}`}
                  aria-hidden
                >
                  <span className={styles.entryTicket}>
                    #{ticketNumber(entry.orderId)}
                  </span>

                  <span className={styles.entryCustomer}>
                    {entry.customerName ?? 'Visitante'}
                  </span>

                  <div className={styles.entryMeta}>
                    <span className={styles.entryChannel}>
                      {CHANNEL_LABEL[entry.channel]}
                    </span>
                    <span className={styles.entryDot}>·</span>
                    <span className={styles.entryStatus}>
                      {STATUS_LABEL[entry.status]}
                    </span>
                    <span className={styles.entryDot}>·</span>
                    <time className={styles.entryAt} dateTime={entry.createdAt}>
                      {stamp.format(new Date(entry.createdAt))}
                    </time>
                  </div>

                  <span className={styles.entryTotal}>
                    {brl(entry.totalAmount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </>
    )}
  </section>
)
