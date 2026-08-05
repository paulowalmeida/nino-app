import { Link } from 'react-router'

import { Icon } from '@nino/ds/components/Icon'

import styles from './CheckoutHeader.module.css'

type CheckoutHeaderProps = {
  backHref: string
  storeName: string
}

export const CheckoutHeader = ({ backHref, storeName }: CheckoutHeaderProps) => (
  <header className={styles.header}>
    <Link to={backHref} className={styles.back} aria-label="Voltar">
      <Icon name="arrow-left" />
    </Link>
    <div className={styles.headText}>
      <h1 className={styles.title}>Finalizar pedido</h1>
      <p className={styles.storeLine}>{storeName}</p>
    </div>
  </header>
)
