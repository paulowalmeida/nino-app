import { Flexbox } from '@nino/ds/components/Flexbox'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { BackLink } from '@atoms/BackLink/BackLink'

import styles from '@pages/product-detail/ProductDetail.module.css'
import fieldStyles from '@organisms/ProductDetailFields/ProductDetailFields.module.css'

/**
 * Espelha a ficha carregada bloco a bloco: cabeçalho, fio, foto, campos e a
 * barra de ações. O `BackLink` não é osso — ele já funciona enquanto o item
 * chega, e some da tela se virar barra cinza.
 */
export const ProductDetailSkeleton = () => (
  <div className={styles.page}>
    <BackLink>Cardápio</BackLink>

    <header className={styles.head}>
      <div className={styles.headText}>
        <Skeleton className={styles.boneName} />
      </div>
      <Skeleton className={styles.boneBadge} />
    </header>

    <div className={styles.form}>
      <div className={fieldStyles.photoCol}>
        <Skeleton className={styles.bonePhoto} />
        <Flexbox gap={2} mt={3}>
          <Skeleton className={styles.bonePhotoAction} />
        </Flexbox>
      </div>

      <div className={fieldStyles.fields}>
        <div className={fieldStyles.field}>
          <Skeleton className={styles.boneLabel} />
          <Skeleton className={styles.boneInput} />
        </div>

        <div className={fieldStyles.field}>
          <Skeleton className={styles.boneLabel} />
          <Skeleton className={styles.boneTextarea} />
          <Skeleton className={styles.boneHelper} />
        </div>

        <div className={fieldStyles.row}>
          <div className={fieldStyles.field}>
            <Skeleton className={styles.boneLabel} />
            <Skeleton className={styles.boneInput} />
          </div>
          <div className={fieldStyles.field}>
            <Skeleton className={styles.boneLabel} />
            <Skeleton className={styles.boneInput} />
          </div>
        </div>

        <div className={fieldStyles.field}>
          <Skeleton className={styles.boneLabel} />
          <Skeleton className={styles.boneInput} />
        </div>

        <div className={fieldStyles.availability}>
          <Skeleton className={styles.boneSwitch} />
          <div className={styles.boneAvailabilityText}>
            <Skeleton className={styles.boneLabel} />
            <Skeleton className={styles.boneHint} />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Skeleton className={styles.boneButton} />
        <Skeleton className={styles.boneButton} />
        <Skeleton className={styles.boneButton} />
      </div>
    </div>
  </div>
)
