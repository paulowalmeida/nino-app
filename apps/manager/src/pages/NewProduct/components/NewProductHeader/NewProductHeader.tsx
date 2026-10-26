import { Header } from '@nino/ds/components/Header'
import { BackLink } from '@shared/components/BackLink/BackLink'

import motion from '@styles/motion.module.css'
import styles from './NewProductHeader.module.css'

const DESCRIPTION = 'O que o cliente vê no cardápio, tudo em um lugar só.'

export const NewProductHeader = () => (
  <>
    <BackLink>Cardápio</BackLink>

    <Header
      className={`${motion.deal} ${styles.newProductHeader}`}
      mb={5}
      title="Novo item"
      accent="item"
      description={DESCRIPTION}
    />
  </>
)
