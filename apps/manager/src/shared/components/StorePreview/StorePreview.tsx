import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'
import { toStoreSlug } from '@shared/adapters/store-slug.adapter/store-slug.adapter'

import styles from './StorePreview.module.css'

export type StorePreviewProps = {
  name: string
  placeholder?: string
  placeholderSlug?: string
}

export const StorePreview = ({
  name,
  placeholder = 'O nome da sua loja',
  placeholderSlug = 'sua-loja',
}: StorePreviewProps) => {
  const typed = name.trim()
  const isLit = typed.length > 0

  return (
    <Box className={styles.preview} data-lit={isLit} aria-hidden="true">
      <Box className={styles.tile}>
        <Text as="span" className={styles.initial}>
          {(typed || placeholder).charAt(0).toUpperCase()}
        </Text>
      </Box>

      <Box className={styles.text}>
        <Text as="span" className={styles.name}>
          {typed || placeholder}
        </Text>
        <Text as="span" className={styles.link}>
          {typed ? toStoreSlug(typed) : placeholderSlug}.dev.nino.delivery
        </Text>
      </Box>
    </Box>
  )
}
