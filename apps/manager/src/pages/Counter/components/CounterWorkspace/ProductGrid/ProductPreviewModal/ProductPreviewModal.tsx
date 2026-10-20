import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import { ItemThumb } from '@shared/components/ItemThumb/ItemThumb'
import type { MenuItem } from '@shared/types/product/menu-item'
import { brl } from '@shared/utils/money/money'

import styles from './ProductPreviewModal.module.css'

type ProductPreviewModalProps = {
  item: MenuItem | null
  onOpenChange: (open: boolean) => void
}

export const ProductPreviewModal = ({
  item,
  onOpenChange,
}: ProductPreviewModalProps) => (
  <Modal
    open={!!item}
    onOpenChange={onOpenChange}
    dismissible={false}
    size="lg"
    ariaLabel={item ? `Prévia de ${item.name}` : 'Prévia do produto'}
    backdropClassName={styles.backdrop}
    body={
      item && (
        <Box direction="column" gap={2}>
          <ItemThumb
            name={item.name}
            imageUrl={item.images[0]?.url}
            fallbackUrl={item.fallbackUrl}
            className={styles.photo}
          />
          <Heading level={2} size="lg" className={styles.name}>
            {item.name}
          </Heading>
          {item.description && (
            <Text
              size="sm"
              color="muted"
              className={styles.productPreviewModalDescription}
            >
              {item.description}
            </Text>
          )}
          <Text size="lg" weight="bold" color="brand" className={styles.price}>
            {brl(item.price)}
          </Text>
        </Box>
      )
    }
  />
)
