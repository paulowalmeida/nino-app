import type { Tab } from './tab'

export type TabPage = {
  data: Tab[]
  pagination: {
    total: number
    page: number
    size: number
  }
}
