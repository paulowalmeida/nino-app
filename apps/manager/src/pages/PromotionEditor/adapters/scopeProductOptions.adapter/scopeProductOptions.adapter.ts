import type { MenuItem } from '@shared/types/product/menu-item'

export type ScopeProductOption = { value: string; label: string }

export const toScopeProductOptions = (
  items: MenuItem[] = []
): ScopeProductOption[] =>
  items
    .filter(({ isActive }) => isActive)
    .map(({ id, name }) => ({ value: id, label: name }))
    .sort((first, second) => first.label.localeCompare(second.label, 'pt-BR'))
