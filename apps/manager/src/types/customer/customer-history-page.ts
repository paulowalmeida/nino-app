import type { CustomerHistoryEntry } from './customer-history-entry'

/** Uma página do histórico do cliente, no mesmo envelope das outras listas. */
export type CustomerHistoryPage = {
  data: CustomerHistoryEntry[]
  pagination: {
    total: number
    page: number
    size: number
  }
}
