import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import {
  PRODUCT_CATEGORY_ICONS,
  type ProductCategoryIcon,
  productCategoryIconEmoji,
} from '@nino/lib/types/product/product-category-icon'

import styles from './CategoryIconPicker.module.css'

type CategoryIconPickerProps = {
  value: ProductCategoryIcon | null | undefined
  onChange: (value: ProductCategoryIcon | null) => void
  disabled?: boolean
  singleRowAt4k?: boolean
}

export const CategoryIconPicker = ({
  value,
  onChange,
  disabled = false,
  singleRowAt4k = false,
}: CategoryIconPickerProps) => (
  <fieldset className={styles.fieldset} disabled={disabled}>
    <legend className={styles.legend}>Ícone da categoria</legend>
    <Box
      className={
        singleRowAt4k
          ? `${styles.options} ${styles.singleRowAt4k}`
          : styles.options
      }
    >
      <Button
        type="button"
        className={`${styles.option} ${!value ? styles.selected : ''}`}
        aria-label="Escolher ícone automático"
        aria-pressed={!value}
        onClick={() => onChange(null)}
      >
        <span aria-hidden="true">✨</span>
      </Button>
      {PRODUCT_CATEGORY_ICONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
          aria-label={option.label}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          <span aria-hidden="true">
            {productCategoryIconEmoji(option.value)}
          </span>
        </Button>
      ))}
    </Box>
  </fieldset>
)
