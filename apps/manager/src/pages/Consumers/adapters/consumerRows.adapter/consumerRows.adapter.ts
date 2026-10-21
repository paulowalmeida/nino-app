import type { ConsumerRowModel } from '@pages/Consumers/types/ConsumerRowModel.type'
import type { UnitConsumer } from '@shared/types/consumer/unit-consumer'
import { brl } from '@shared/utils/money/money'
import { formatPhone } from '@shared/utils/phone/phone'

const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: '2-digit',
})

export const toConsumerRows = (consumers: UnitConsumer[]): ConsumerRowModel[] =>
  consumers.map((consumer) => ({
    id: consumer.id,
    name: consumer.name,
    phoneLabel: formatPhone(consumer.phone),
    spentLabel: brl(consumer.spent),
    ordersCount: String(consumer.orders),
    ordersLabel: consumer.orders === 1 ? ' pedido' : ' pedidos',
    cashbackLabel: brl(consumer.cashbackBalance),
    sinceLabel: day.format(new Date(consumer.since)),
  }))
