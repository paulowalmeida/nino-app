import { Box } from '@nino/ds/components/Box'
import { CategoriesHeaderContainer } from '@containers/CategoriesHeaderContainer/CategoriesHeaderContainer'
import { CategoriesListContainer } from '@containers/CategoriesListContainer/CategoriesListContainer'

import styles from './Categories.module.css'

export const Categories = () => (
  <Box className={styles.page}>
    <CategoriesHeaderContainer />
    <CategoriesListContainer />
  </Box>
)
