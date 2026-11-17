import type { ProductCategoryIcon } from '@nino/lib/types/product/product-category-icon'
import { categoryGlyph } from '@pages/Storefront/utils/category-glyph/category-glyph'

import styles from './CategoryGlyph.module.css'

type CategoryGlyphProps = {
  name: string
  icon?: ProductCategoryIcon | null
  className?: string
}

/** Ilustração da categoria no chip; decorativa, o nome já está ao lado. */
export const CategoryGlyph = ({ name, icon, className }: CategoryGlyphProps) => (
  <img
    src={`/category-icons/${categoryGlyph(name, icon)}.svg`}
    alt=""
    aria-hidden="true"
    className={`${styles.categoryGlyph} ${className ?? ''}`}
  />
)
