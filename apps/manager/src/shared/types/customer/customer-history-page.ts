import type { CustomerHistoryEntry } from './customer-history-entry'

export type CustomerHistoryPage = {
  data: CustomerHistoryEntry[]
  pagination: {
    total: number
    page: number
    size: number
  }
}
