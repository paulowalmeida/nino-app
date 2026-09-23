import { useState } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Image } from '@nino/ds/components/Image'
import { Modal } from '@nino/ds/components/Modal'
import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { ItemPhoto } from '@shared/components/ItemPhoto/ItemPhoto'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './ProductDetailPhoto.module.css'

export const ProductDetailPhoto = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const {
    item,
    uploadImage,
    removeImage,
    isUploadingImage,
    isRemovingImage,
  } = useProductDetailFacade()

  if (!item) return null

  const cover = item.images.find(({ isPrimary }) => isPrimary) ?? item.images[0]
  const previewUrl = cover?.url ?? item.fallbackUrl
  const imageStageClassName = cover
    ? styles.photoWithCover
    : styles.photoWithFallback

  return (
    <Box className={`${motion.deal} ${styles.photoCol}`} style={riseDelay(80)}>
      <Box className={`${styles.photoStage} ${imageStageClassName}`}>
        <ItemPhoto
          productId={item.id}
          name={item.name}
          images={item.images}
          fallbackUrl={item.fallbackUrl}
          isUploading={isUploadingImage}
          isRemoving={isRemovingImage}
          onUpload={(file, callbacks) => uploadImage(file, callbacks)}
          onRemove={(imageId) => removeImage(imageId)}
        />

        {previewUrl && (
          <Button
            variant="ghost"
            size="icon"
            className={styles.previewTrigger}
            aria-label={`Ampliar foto de ${item.name}`}
            onClick={() => setIsPreviewOpen(true)}
          />
        )}
      </Box>

      <Modal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        ariaLabel={`Prévia da foto de ${item.name}`}
        size="lg"
        contentClassName={styles.previewModal}
        body={
          <Box className={styles.previewBody}>
            <Image
              src={previewUrl}
              alt={item.name}
              className={styles.previewImage}
              wrapperClassName={styles.previewImageWrapper}
            />
          </Box>
        }
      />
    </Box>
  )
}
