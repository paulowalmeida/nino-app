import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'

import motion from '@styles/motion.module.css'
import styles from '@pages/Catalog/components/CatalogHeader/CatalogActions/CatalogActions.module.css'

export const CatalogActions = () => (
  <Box
    direction={{ mobile: 'column', tablet: 'row' }}
    gap={{ mobile: 2, tablet: 3 }}
  >
    <Button
      asChild
      variant="outline"
      className={`${motion.press} ${styles.manageCategories}`}
    >
      <Link to="../categorias-produtos">Gerenciar categorias</Link>
    </Button>
    <Button asChild className={`${motion.press} ${styles.newItem}`}>
      <Link to="novo">Novo item</Link>
    </Button>
  </Box>
)
