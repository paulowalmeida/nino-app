import { Flexbox } from '@nino/ds/components/Flexbox'
import { Header } from '@nino/ds/components/Header'
import { CatalogWorkspace } from '@templates/CatalogWorkspace/CatalogWorkspace'

import styles from './Catalog.module.css'

const DESCRIPTION =
  'Desligue o que acabou — o item some do app do cliente na hora.'

export const Catalog = () => {
  return (
    <Flexbox className={styles.page}>
      <Header
        mb={{ mobile: 3, desktop: 4 }}
        className={styles.header}
        title="Cardápio"
        accent="Cardápio"
        description={DESCRIPTION}
      />

      <CatalogWorkspace />
    </Flexbox>
  )
}
