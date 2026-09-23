import { useNavigate } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Carousel } from '@nino/ds/components/Carousel'
import { Icon } from '@nino/ds/components/Icon'
import { Image } from '@nino/ds/components/Image'
import { Text } from '@nino/ds/components/Text'
import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { categoryIcon } from '@utils/category-icon'
import { resolveBackHref } from '@utils/resolve-back-href'

import styles from './ProductHero.module.css'

export const ProductHero = () => {
  const { product, slug } = useProductDetailFacade()
  const navigate = useNavigate()

  const fallback = (
    <Box className={styles.fallback} aria-hidden="true">
      <Text as="span" className={styles.glyph}>
        {(product ? categoryIcon(product.name) : null) ?? '🍽️'}
      </Text>
    </Box>
  )

  const images = product?.images ?? []
  const fallbackUrl = product?.fallbackUrl

  return (
    <Box className={styles.hero}>
      {images.length > 0 ? (
        <Carousel
          slides={images.map((image) => (
            <Image
              key={image.id}
              src={image.url}
              alt=""
              className={styles.photo}
              wrapperClassName={styles.photoWrap}
              placeholder={fallback}
            />
          ))}
        />
      ) : fallbackUrl ? (
        <Image
          src={fallbackUrl}
          alt=""
          className={styles.photo}
          wrapperClassName={styles.photoWrap}
          placeholder={fallback}
        />
      ) : (
        fallback
      )}

      <Button
        variant="ghost"
        size="icon"
        className={styles.back}
        aria-label="Voltar ao cardápio"
        onClick={() => navigate(resolveBackHref(slug))}
      >
        <Icon name="arrow-left" />
      </Button>
    </Box>
  )
}
