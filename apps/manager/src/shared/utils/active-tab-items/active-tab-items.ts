import type { Tab } from '@shared/types/tab/tab'
import type { TabItem } from '@shared/types/tab/tab-item'

export const activeTabItems = ({ items }: Pick<Tab, 'items'>): TabItem[] =>
  items.filter(({ isCancelled }) => !isCancelled)
