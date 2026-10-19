import type { MenuSection } from '@shared/types/product/menu-section'
import { brl } from '@shared/utils/money/money'

export type TabProductOption = {
  value: string
  label: string
}

export const tabProductOptions = (
  sections: MenuSection[]
): TabProductOption[] =>
  sections.flatMap(({ items }) =>
    items
      .filter(({ isActive }) => isActive)
      .map(({ id, name, price }) => ({
        value: id,
        label: `${name} · ${brl(price)}`,
      }))
  )
