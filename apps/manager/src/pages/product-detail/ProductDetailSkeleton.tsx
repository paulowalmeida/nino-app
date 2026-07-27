import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { BackLink } from '@components/BackLink'

import styles from './ProductDetail.module.css'

/**
 * Espelha a ficha carregada bloco a bloco: cabeçalho, fio, foto, campos e a
 * barra de ações. O `BackLink` não é osso — ele já funciona enquanto o item
 * chega, e some da tela se virar barra cinza.
 */
export const ProductDetailSkeleton = () => (
  <div className={styles.page}>
    <BackLink>Cardápio</BackLink>

    <Card className={styles.sheet}>
      <header className={styles.head}>
        <div className={styles.headText}>
          <Skeleton className={styles.boneCategory} />
          <Skeleton className={styles.boneName} />
          <Skeleton className={styles.bonePrice} />
        </div>
        <Skeleton className={styles.boneBadge} />
      </header>

      <div className={styles.form}>
        <Skeleton className={styles.bonePhoto} />

        <div className={styles.field}>
          <Skeleton className={styles.boneLabel} />
          <Skeleton className={styles.boneInput} />
        </div>

        <div className={styles.field}>
          <Skeleton className={styles.boneLabel} />
          <Skeleton className={styles.boneTextarea} />
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

        <div className={styles.actions}>
          <Skeleton className={styles.boneButton} />
          <Skeleton className={styles.boneButton} />
        </div>
      </div>
    </Card>
  </div>
)
