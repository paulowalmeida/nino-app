import type { OrderStage } from '@shared/types/order/order-stage'

export const stageTitleCasesMock: { stage: OrderStage; title: string }[] = [
  { stage: 'incoming', title: 'esperando aceite' },
  { stage: 'kitchen', title: 'na cozinha' },
  { stage: 'counter', title: 'no balcão' },
]
