import { Skeleton } from '@nino/ds/components/Skeleton'
import { PageHeader } from '@nino/ds/components/PageHeader'
import { BackLink } from '@elements/BackLink/BackLink'

import styles from '@pages/new-product/NewProduct.module.css'

/**
 * Espelha o formulário vazio bloco a bloco: foto, nome, descrição, preço e
 * categoria, ação. O cabeçalho não é osso — o título não depende de nenhum
 * dado, só a categoria espera a API.
 */
export const NewProductSkeleton = () => (
  <div className={styles.page}>
    <BackLink>Cardápio</BackLink>

    <PageHeader
      className={styles.header}
      title="Novo item"
      accent="item"
      description="O que o cliente vê no cardápio, tudo em um lugar só."
    />

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

        <div className={styles.category}>
          <Skeleton className={styles.boneCategoryButton} />
        </div>
      </div>

      <div className={styles.actions}>
        <Skeleton className={styles.boneButton} />
        <Skeleton className={styles.boneButton} />
      </div>
    </div>
  </div>
)
