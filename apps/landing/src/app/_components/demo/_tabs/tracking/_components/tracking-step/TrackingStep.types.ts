import type { StepStatus } from "../../trackingTab.constants"

export type TrackingStepProps = {
  icon: string
  label: string
  time: string
  status: StepStatus
  isLast?: boolean
}
