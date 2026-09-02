import { Link } from 'react-router'

import { EmptyState } from '@nino/ds/components/EmptyState'
import { Image } from '@nino/ds/components/Image'

import styles from './OrderNotFound.module.css'

type OrderNotFoundProps = {
  backHref: string
  reason: 'access' | 'invalid-link'
}

export const OrderNotFound = ({ backHref, reason }: OrderNotFoundProps) => {
  const message =
    reason === 'access'
      ? 'Abra pelo link que apareceu na hora do pedido, ou entre na sua conta ' +
        'para ver seus pedidos.'
      : 'Confira o link — ele é o mesmo que apareceu na hora do pedido.'

  return (
    <EmptyState
      size="md"
      className={styles.notFound}
      illustration={<Image src="/mascot-consumer-sad.svg" alt="" />}
      title="Pedido não encontrado"
      action={
        <Link to={backHref} className={styles.backLink}>
          Voltar para a loja
        </Link>
      }
    >
      {message}
    </EmptyState>
  )
}
