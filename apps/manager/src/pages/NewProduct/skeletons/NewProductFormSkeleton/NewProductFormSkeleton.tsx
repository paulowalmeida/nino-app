import { Box } from '@nino/ds/components/Box'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'

import styles from './NewProductFormSkeleton.module.css'

/* WHY: espelha o formulário vazio bloco a bloco — foto, nome, descrição,
 * preço e categoria, ação — para a tela não pular quando as categorias
 * chegam. O cabeçalho não é osso: o título não depende de nenhum dado.
 */
export const NewProductFormSkeleton = () => (
  <Box className={styles.newProductFormSkeletonForm}>
    <Text as="p" role="status" className="sr-only">
      Carregando formulário do item
    </Text>

    <Box className={styles.photoCol}>
      <Skeleton className={styles.ghostPhoto} />
      <Box gap={2} mt={3}>
        <Skeleton className={styles.ghostPhotoAction} />
      </Box>
    </Box>

    <Box className={styles.newProductFormSkeletonFields}>
      <Box className={styles.newProductFormSkeletonField}>
        <Skeleton className={styles.ghostLabel} />
        <Skeleton className={styles.ghostInput} />
      </Box>

      <Box className={styles.newProductFormSkeletonField}>
        <Skeleton className={styles.ghostLabel} />
        <Skeleton className={styles.ghostTextarea} />
        <Skeleton className={styles.ghostHelper} />
      </Box>

      <Box className={styles.newProductFormSkeletonRow}>
        <Box className={styles.newProductFormSkeletonField}>
          <Skeleton className={styles.ghostLabel} />
          <Skeleton className={styles.ghostInput} />
        </Box>
        <Box className={styles.newProductFormSkeletonField}>
          <Skeleton className={styles.ghostLabel} />
          <Skeleton className={styles.ghostInput} />
        </Box>
      </Box>

      <Box className={styles.category}>
        <Skeleton className={styles.ghostCategoryButton} />
      </Box>
    </Box>

    <Box className={styles.newProductFormSkeletonActions}>
      <Skeleton className={styles.ghostButton} />
      <Skeleton className={styles.ghostButton} />
    </Box>
  </Box>
)
