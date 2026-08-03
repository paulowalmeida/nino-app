import { Icon } from '@nino/ds/components/Icon'
import { brl } from '@utils/money'

import type { CouponTabProps } from './CouponTab.types'

import styles from './CouponTab.module.css'

/**
 * A ponta do cupom saindo da impressora, presa no rodapé.
 *
 * No balcão o total é metade do trabalho: quem atende precisa saber quanto
 * já deu sem sair do cardápio. A comanda inteira mora atrás desta aba — puxa
 * para conferir, solta e continua vendendo.
 *
 * Só existe no celular. No desktop a comanda já fica na coluna ao lado.
 */
export const CouponTab = ({ count, total, onOpen }: CouponTabProps) => (
  <button type="button" className={styles.tab} onClick={onOpen}>
    <span className={styles.perforation} aria-hidden="true" />

    <span className={styles.body}>
      <span className={styles.count}>
        {count} {count === 1 ? 'item' : 'itens'}
      </span>
      <span className={styles.total}>{brl(total)}</span>
      <span className={styles.hint} aria-hidden="true">
        <Icon name="chevron-up" />
      </span>
    </span>
  </button>
)
