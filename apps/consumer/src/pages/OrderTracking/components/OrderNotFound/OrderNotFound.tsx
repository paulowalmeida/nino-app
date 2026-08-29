import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'

import styles from './OrderNotFound.module.css'

type OrderNotFoundProps = {
  backHref: string
  children: ReactNode
}

export const OrderNotFound = ({ backHref, children }: OrderNotFoundProps) => (
  <EmptyState
    size="md"
    className={styles.notFound}
    illustration={<img src="/mascot-consumer-sad.svg" alt="" />}
    title="Pedido não encontrado"
    action={
      <Link to={backHref} className={styles.backLink}>
        Voltar para a loja
      </Link>
    }
  >
    {children}
  </EmptyState>
)
