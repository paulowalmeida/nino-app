import type { ConsumerOrderRowModel } from '@pages/ConsumerDetail/types/ConsumerOrderRowModel.type'
import { toOrderBadgeVariant } from '@shared/adapters/order-badge.adapter/order-badge.adapter'
import { STATUS_LABEL } from '@shared/constants/order.constants'
import type { ConsumerHistoryEntry } from '@shared/types/consumer/consumer-history-entry'
import { brl } from '@shared/utils/money/money'
import { ticketNumber } from '@shared/utils/order-ticket/order-ticket'

const stamp = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export const toConsumerOrderRows = (
  entries: ConsumerHistoryEntry[]
): ConsumerOrderRowModel[] =>
  entries.map((entry) => ({
    href: `../../pedidos/${entry.id}`,
    number: ticketNumber(entry.orderNumber),
    statusLabel: STATUS_LABEL[entry.status],
    statusVariant: toOrderBadgeVariant(entry.status),
    createdAt: entry.createdAt,
    createdAtLabel: stamp.format(new Date(entry.createdAt)),
    total: brl(entry.totalAmount),
  }))
