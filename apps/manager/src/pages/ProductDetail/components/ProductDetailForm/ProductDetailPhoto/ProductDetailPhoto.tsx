import { Box } from '@nino/ds/components/Box'
import { useProductDetailFacade } from '@pages/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { ItemPhoto } from '@shared/components/ItemPhoto/ItemPhoto'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import motion from '@styles/motion.module.css'
import styles from './ProductDetailPhoto.module.css'

export const ProductDetailPhoto = () => {
  const {
    item,
    uploadImage,
    removeImage,
    isUploadingImage,
    isRemovingImage,
  } = useProductDetailFacade()

  if (!item) return null

  return (
    <Box className={`${motion.deal} ${styles.photoCol}`} style={riseDelay(80)}>
      <ItemPhoto
        productId={item.id}
        name={item.name}
        images={item.images}
        isUploading={isUploadingImage}
        isRemoving={isRemovingImage}
        onUpload={(file, callbacks) => uploadImage(file, callbacks)}
        onRemove={(imageId) => removeImage(imageId)}
      />
    </Box>
  )
}
