import { Link } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { CartEmptyIllustration } from '@shared/components/Illustrations/CartEmptyIllustration/CartEmptyIllustration'

import styles from './CheckoutEmptyCart.module.css'

type CheckoutEmptyCartProps = { backHref: string }

export const CheckoutEmptyCart = ({ backHref }: CheckoutEmptyCartProps) => (
  <EmptyState
    size="md"
    className={styles.checkoutEmptyCartEmpty}
    illustration={<CartEmptyIllustration />}
    title="Sua sacola está vazia"
    action={
      <Link to={backHref} className={styles.emptyLink}>
        Voltar para o cardápio
      </Link>
    }
  />
)
