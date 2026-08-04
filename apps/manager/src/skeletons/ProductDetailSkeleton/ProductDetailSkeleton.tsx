import { Skeleton } from '@nino/ds/components/Skeleton'
import { BackLink } from '@elements/BackLink/BackLink'

import styles from '@pages/product-detail/ProductDetail.module.css'

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
      <div className={styles.photoCol}>
        <Skeleton className={styles.bonePhoto} />
        <div className={styles.bonePhotoActions}>
          <Skeleton className={styles.bonePhotoAction} />
        </div>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <Skeleton className={styles.boneLabel} />
          <Skeleton className={styles.boneInput} />
        </div>

        <div className={styles.field}>
          <Skeleton className={styles.boneLabel} />
          <Skeleton className={styles.boneTextarea} />
          <Skeleton className={styles.boneHelper} />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <Skeleton className={styles.boneLabel} />
            <Skeleton className={styles.boneInput} />
          </div>
          <div className={styles.field}>
            <Skeleton className={styles.boneLabel} />
            <Skeleton className={styles.boneInput} />
          </div>
        </div>

        <div className={styles.field}>
          <Skeleton className={styles.boneLabel} />
          <Skeleton className={styles.boneInput} />
        </div>

        <div className={styles.availability}>
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
