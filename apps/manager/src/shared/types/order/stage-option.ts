import type { IconName } from '@nino/ds/components/Icon'

import type { OrderStage } from './order-stage'

export type StageOption = {
  id: OrderStage
  label: string
  count: number
  icon: IconName
}
