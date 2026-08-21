import { Flexbox } from '@nino/ds/components/Flexbox'
import { CategoriesHeaderContainer } from '@containers/CategoriesHeaderContainer/CategoriesHeaderContainer'
import { CategoriesListContainer } from '@containers/CategoriesListContainer/CategoriesListContainer'

import styles from './Categories.module.css'

export const Categories = () => (
  <Flexbox className={styles.page}>
    <CategoriesHeaderContainer />
    <CategoriesListContainer />
  </Flexbox>
)
