import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { useNavigate } from 'react-router'

import { useProductDetailFacade } from '@pages/Storefront/ProductDetail/facades/useProductDetailFacade/useProductDetailFacade'
import { resolveBackHref } from '@utils/resolve-back-href'

import styles from './ProductUnavailable.module.css'

export const ProductUnavailable = () => {
  const { slug } = useProductDetailFacade()
  const navigate = useNavigate()

  return (
    <Box className={styles.wrapper}>
      <EmptyState
        size="md"
        title="Este item saiu do cardápio"
        action={
          <Button onClick={() => navigate(resolveBackHref(slug))}>
            Voltar ao cardápio
          </Button>
        }
      >
        A loja pode ter tirado o produto do ar enquanto você navegava.
      </EmptyState>
    </Box>
  )
}
