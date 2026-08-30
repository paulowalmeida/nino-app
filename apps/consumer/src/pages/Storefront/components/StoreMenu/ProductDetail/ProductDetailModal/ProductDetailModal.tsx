import type { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import type { MenuItem } from '@custom_types/menu/menu-item'

import styles from '../ProductDetail.module.css'
import motion from '@styles/motion.module.css'
import { riseDelay } from '@utils/rise-delay'

type ProductDetailModalProps = {
  item: MenuItem | null
  isOpen: boolean
  media: ReactNode
  stepper: ReactNode
  confirmButton: ReactNode
  onClose: () => void
}

export const ProductDetailModal = ({
  item,
  isOpen,
  media,
  stepper,
  confirmButton,
  onClose,
}: ProductDetailModalProps) => (
  <Modal
    open={isOpen}
    onOpenChange={(open) => !open && onClose()}
    size="md"
    ariaLabel={item?.name ?? ''}
    header={
      item ? (
        <Heading level={2} className={styles.modalTitle}>
          {item.name}
        </Heading>
      ) : null
    }
    body={
      item ? (
        <Box key={item.id}>
          <Box className={`${motion.riseIn} ${styles.modalMedia}`}>{media}</Box>
          {item.description && (
            <Text
              className={`${motion.riseIn} ${styles.description}`}
              style={riseDelay(70)}
            >
              {item.description}
            </Text>
          )}
        </Box>
      ) : null
    }
    footer={
      <Box className={styles.modalFooter}>
        {stepper}
        {confirmButton}
      </Box>
    }
  />
)
