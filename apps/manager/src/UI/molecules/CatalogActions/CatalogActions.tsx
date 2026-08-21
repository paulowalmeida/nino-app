import { Link } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { Box } from '@nino/ds/components/Box'

import styles from './CatalogActions.module.css'
import motion from '@styles/motion.module.css'

export const CatalogActions = () => (
  <Box
    direction={{ mobile: 'column', tablet: 'row' }}
    gap={{ mobile: 2, tablet: 3 }}
    className={styles.actions}
  >
    <Button
      asChild
      variant="outline"
      className={`${motion.press} ${styles.manageCategories}`}
    >
      <Link to="categorias">Gerenciar categorias</Link>
    </Button>
    <Button asChild className={`${motion.press} ${styles.newItem}`}>
      <Link to="novo">Novo item</Link>
    </Button>
  </Box>
)
