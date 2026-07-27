import { isTerminal, journeyFor } from '@utils/order-journey'

import type { OrderRailProps } from './OrderRail.types'

import styles from './OrderRail.module.css'

/**
 * A barra do toast, repartida: uma fatia por passo, colada na borda de baixo
 * da peça que a hospeda. O que passou fica laranja cheio, o que falta fica
 * quase apagado, e a fatia de agora tem um brilho atravessando de ponta a
 * ponta — é essa varredura que diz "isto está acontecendo", sem texto.
 *
 * Vive fora do cartão de status porque a vitrine mostra a mesma coisa em
 * miniatura: é o trilho que faz o banner da loja e a tela de acompanhamento
 * lerem como o mesmo objeto.
 */
export const OrderRail = ({ order, className }: OrderRailProps) => {
  const journey = journeyFor(order.channel)

  /* Pedido encerrado preenche o trilho inteiro: o último passo não fica
     "em andamento" piscando depois que a comida já chegou. */
  const index = isTerminal(order.status)
    ? journey.length
    : journey.indexOf(order.status)

  return (
    <div className={`${styles.rail} ${className ?? ''}`} aria-hidden="true">
      {journey.map((step, i) => (
        <span
          key={step}
          className={
            i < index
              ? styles.done
              : i === index
                ? styles.current
                : styles.ahead
          }
        />
      ))}
    </div>
  )
}
