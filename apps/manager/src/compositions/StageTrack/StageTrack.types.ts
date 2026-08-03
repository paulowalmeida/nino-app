import type { IconName } from '@nino/ds/components/Icon'
import type { OrderStage } from '@custom_types/order'

export type StageOption = {
  id: OrderStage
  label: string
  count: number
  icon: IconName
}

export type StageTrackProps = {
  stages: StageOption[]
  value: OrderStage
  onChange: (stage: OrderStage) => void
}
