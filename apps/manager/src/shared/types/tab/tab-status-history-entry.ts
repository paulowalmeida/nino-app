import type { TabStatus } from './tab-status'

export type TabStatusHistoryEntry = {
  status: TabStatus
  changedById: string | null
  createdAt: string
}
