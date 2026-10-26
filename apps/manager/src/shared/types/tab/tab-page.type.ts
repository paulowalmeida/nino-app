import type { Tab } from './tab.type'

export type TabPage = {
  data: Tab[]
  pagination: {
    total: number
    page: number
    size: number
  }
}
