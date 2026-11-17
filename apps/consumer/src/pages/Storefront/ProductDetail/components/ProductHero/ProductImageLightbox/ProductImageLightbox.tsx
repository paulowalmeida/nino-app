import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { Modal } from '@nino/ds/components/Modal'
import { Text } from '@nino/ds/components/Text'

import styles from './ProductImageLightbox.module.css'

type ProductImageLightboxProps = {
  src: string | null
  title?: string
  description?: string | null
  onClose: () => void
}

export const ProductImageLightbox = ({
  src,
  title,
  description,
  onClose,
}: ProductImageLightboxProps) => (
  <Modal
    open={src !== null}
    onOpenChange={(open) => {
      if (!open) onClose()
    }}
    ariaLabel="Imagem ampliada"
    size="full"
    dismissible={false}
    contentClassName={styles.panel}
    bodyClassName={styles.body}
    body={
      <>
        <Button
          variant="ghost"
          size="icon"
          className={styles.close}
          aria-label="Fechar"
          onClick={onClose}
        >
          <Icon name="x" />
        </Button>
        <button
          type="button"
          className={styles.imageButton}
          aria-label="Fechar imagem"
          onClick={onClose}
        >
          <Image
            src={src}
            alt=""
            className={styles.image}
            wrapperClassName={styles.imageWrap}
          />
        </button>
        {title && (
          <div className={styles.caption}>
            <Text as="p" className={styles.captionTitle}>
              {title}
            </Text>
            {description && (
              <Text as="p" className={styles.captionDescription}>
                {description}
              </Text>
            )}
          </div>
        )}
      </>
    }
  />
)
