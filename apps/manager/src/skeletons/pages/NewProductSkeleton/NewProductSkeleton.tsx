import { Flexbox } from '@nino/ds/components/Flexbox'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Header } from '@nino/ds/components/Header'
import { BackLink } from '@elements/BackLink/BackLink'

import styles from '@pages/new-product/NewProduct.module.css'
import fieldStyles from '@compositions/NewProductFields/NewProductFields.module.css'

/**
 * Espelha o formulário vazio bloco a bloco: foto, nome, descrição, preço e
 * categoria, ação. O cabeçalho não é osso — o título não depende de nenhum
 * dado, só a categoria espera a API.
 */
export const NewProductSkeleton = () => (
  <div className={styles.page}>
    <BackLink>Cardápio</BackLink>

    <Header
      className={styles.header}
      mb={5}
      title="Novo item"
      accent="item"
      description="O que o cliente vê no cardápio, tudo em um lugar só."
    />

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

        <div className={fieldStyles.category}>
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
