import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import styles from './ProductDetailSkeleton.module.css'
import formStyles from '@pages/ProductDetail/components/ProductDetailForm/ProductDetailForm.module.css'
import photoStyles from '@pages/ProductDetail/components/ProductDetailForm/ProductDetailPhoto/ProductDetailPhoto.module.css'
import headStyles from '@pages/ProductDetail/components/ProductDetailHeader/ProductDetailHeader.module.css'

/* WHY: cada osso tem a altura do elemento que substitui, para a página não
 * pular quando o item chega. O BackLink não é osso — ele já funciona
 * enquanto o item carrega e some da tela se virar barra cinza. */
export const ProductDetailSkeleton = () => (
  <>
    <Text as="p" role="status" className="sr-only">
      Carregando ficha do item
    </Text>

    <Box as="header" className={headStyles.head}>
      <Box className={headStyles.headText}>
        <Skeleton className={styles.ghostName} />
      </Box>
      <Skeleton className={styles.ghostBadge} />
    </Box>

    <Box className={formStyles.productDetailForm}>
      <Box className={photoStyles.photoCol}>
        <Skeleton className={styles.ghostPhoto} />
        <Box gap={2} mt={3}>
          <Skeleton className={styles.ghostPhotoAction} />
        </Box>
      </Box>

      <Box className={formStyles.productDetailFormFields}>
        <Box className={formStyles.productDetailFormField}>
          <Skeleton className={styles.ghostLabel} />
          <Skeleton className={styles.ghostInput} />
        </Box>

        <Box className={formStyles.productDetailFormField}>
          <Skeleton className={styles.ghostLabel} />
          <Skeleton className={styles.ghostTextarea} />
          <Skeleton className={styles.ghostHelper} />
        </Box>

        <Box className={formStyles.productDetailFormRow}>
          <Box className={formStyles.productDetailFormField}>
            <Skeleton className={styles.ghostLabel} />
            <Skeleton className={styles.ghostInput} />
          </Box>
          <Box className={formStyles.productDetailFormField}>
            <Skeleton className={styles.ghostLabel} />
            <Skeleton className={styles.ghostInput} />
          </Box>
        </Box>

        <Box className={formStyles.productDetailFormField}>
          <Skeleton className={styles.ghostLabel} />
          <Skeleton className={styles.ghostInput} />
        </Box>

        <Box className={formStyles.availability}>
          <Skeleton className={styles.ghostSwitch} />
          <Box className={styles.ghostAvailabilityText}>
            <Skeleton className={styles.ghostLabel} />
            <Skeleton className={styles.ghostHint} />
          </Box>
        </Box>
      </Box>

      <Box className={formStyles.productDetailFormActions}>
        <Skeleton className={styles.ghostButton} />
        <Skeleton className={styles.ghostButton} />
        <Skeleton className={styles.ghostButton} />
      </Box>
    </Box>
  </>
)
