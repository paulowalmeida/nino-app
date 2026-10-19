import type { Tab } from '@shared/types/tab/tab'

const normalize = (value: string): string =>
  value.trim().toLocaleLowerCase('pt-BR')

export const filterTableTabs = <T extends Pick<Tab, 'label'>>(
  tabs: T[],
  term: string
): T[] => {
  const search = normalize(term)

  if (!search) return tabs

  return tabs.filter(({ label }) => normalize(label).includes(search))
}
