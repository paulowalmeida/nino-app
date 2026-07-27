import type { NavIconName } from '@components/NavIcon/NavIcon.types'
import type { OrderStage } from '@custom_types/order'

export type StageOption = {
  id: OrderStage
  label: string
  count: number
  icon: NavIconName
}

export type StageTrackProps = {
  stages: StageOption[]
  value: OrderStage
  onChange: (stage: OrderStage) => void
}
