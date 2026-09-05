import type { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'
import type { MenuItem } from '@custom_types/menu/menu-item'
import { brl } from '@utils/money'

import styles from './ProductDetailModal.module.css'
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

/**
 * A folha do produto abre pela imagem: o X flutua sobre ela e o nome vem
 * abaixo, junto da descrição e do preço. Sem barra de título, o nome do
 * produto aparece uma vez só — `ariaLabel` é quem nomeia o diálogo para o
 * leitor de tela.
 *
 * WHY: o X é nosso, não o do Modal. O do Modal é tinta apagada e desaparece
 * sobre a foto do produto; este tem disco próprio para se ler sobre qualquer
 * imagem.
 */
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
    dismissible={false}
    body={
      item ? (
        <Box key={item.id}>
          <Box className={`${motion.riseIn} ${styles.media}`}>
            {media}
            <Button
              variant="ghost"
              size="icon"
              className={styles.close}
              onClick={onClose}
              aria-label="Fechar"
            >
              <Icon name="x" />
            </Button>
          </Box>

          <Box className={styles.content}>
            <Heading level={2} className={styles.name}>
              {item.name}
            </Heading>
            {item.description && (
              <Text
                as="p"
                className={`${motion.riseIn} ${styles.description}`}
                style={riseDelay(70)}
              >
                {item.description}
              </Text>
            )}
            <Text as="span" className={styles.price}>
              {brl(Number(item.price))}
            </Text>
          </Box>
        </Box>
      ) : null
    }
    footer={
      <Box direction="row" className={styles.modalFooter}>
        {stepper}
        {confirmButton}
      </Box>
    }
  />
)
