import { Flexbox } from '@nino/ds/components/Flexbox'
import { Header } from '@nino/ds/components/Header'
import { BackLink } from '@atoms/BackLink/BackLink'
import { CategoryManagement } from '@templates/CategoryManagement/CategoryManagement'

import styles from './Categories.module.css'
import motion from '@styles/motion.module.css'

const DESCRIPTION =
  'As categorias agrupam os itens no app do cliente. Arraste para mudar ' +
  'a ordem em que aparecem lá.'

export const Categories = () => {
  return (
    <Flexbox className={styles.page}>
      <BackLink>Cardápio</BackLink>

      <Header
        mb={{ mobile: 5, desktop: 8 }}
        mt={2}
        className={motion.deal}
        title="Como o cardápio se organiza"
        accent="organiza"
        description={DESCRIPTION}
      />

      <CategoryManagement />
    </Flexbox>
  )
}
