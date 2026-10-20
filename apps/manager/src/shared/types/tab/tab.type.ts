import type { TabItem } from './tab-item'
import type { TabPayment } from './tab-payment'
import type { TabStatus } from './tab-status'
import type { TabStatusHistoryEntry } from './tab-status-history-entry'

export type Tab = {
  id: string
  unitId: string
  status: TabStatus
  label: string
  diningTableId: string | null
  subtotal: number
  serviceFeePercent: number
  serviceFeeAmount: number
  totalAmount: number
  openedByUserId: string
  closedAt: string | null
  finalizedAt: string | null
  cancelledAt: string | null
  cancelReason: string | null
  createdAt: string
  updatedAt: string
  items: TabItem[]
  paidAmount: number
  remainingAmount: number
  payments: TabPayment[]
  statusHistory: TabStatusHistoryEntry[]
}
