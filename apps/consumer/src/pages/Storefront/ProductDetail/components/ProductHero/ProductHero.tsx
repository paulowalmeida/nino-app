import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Carousel } from '@nino/ds/components/Carousel'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { useIsDesktop } from '@pages/Storefront/hooks/useIsDesktop/useIsDesktop'
import { resolveApiAssetUrl } from '@utils/api-asset-url/api-asset-url'
import { resolveBackHref } from '@utils/resolve-back-href'

import styles from './ProductHero.module.css'
import { ProductImageLightbox } from './ProductImageLightbox/ProductImageLightbox'

export const ProductHero = () => {
  const { product, slug } = useProductDetailFacade()
  const navigate = useNavigate()
  const isDesktop = useIsDesktop()

  const [zoomedUrl, setZoomedUrl] = useState<string | null>(null)

  const fallback = <Skeleton className={styles.fallback} />

  const images = product?.images ?? []
  const fallbackUrl = resolveApiAssetUrl(product?.fallbackUrl)

  return (
    <Box className={styles.hero}>
      {images.length > 0 ? (
        <Carousel
          slides={images.map((image) => (
            <button
              key={image.id}
              type="button"
              className={styles.zoom}
              aria-label="Ampliar imagem"
              onClick={() => setZoomedUrl(image.url)}
            >
              <Image
                src={image.url}
                alt=""
                className={styles.photo}
                wrapperClassName={styles.photoWrap}
                placeholder={fallback}
              />
            </button>
          ))}
        />
      ) : fallbackUrl ? (
        <button
          type="button"
          className={styles.zoom}
          aria-label="Ampliar imagem"
          onClick={() => setZoomedUrl(fallbackUrl)}
        >
          <Image
            src={fallbackUrl}
            alt=""
            className={styles.photo}
            wrapperClassName={styles.photoWrap}
            placeholder={fallback}
          />
        </button>
      ) : (
        fallback
      )}

      {!isDesktop && (
        <Button
          variant="ghost"
          size="icon"
          className={styles.back}
          aria-label="Voltar ao cardápio"
          onClick={() => navigate(resolveBackHref(slug))}
        >
          <Icon name="arrow-left" />
        </Button>
      )}

      <ProductImageLightbox
        src={zoomedUrl}
        title={product?.name}
        description={product?.description}
        onClose={() => setZoomedUrl(null)}
      />
    </Box>
  )
}
