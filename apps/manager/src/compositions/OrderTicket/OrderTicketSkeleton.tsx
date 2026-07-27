import { Card } from '@nino/ds/components/Card'
import { Skeleton } from '@nino/ds/components/Skeleton'

import styles from './OrderTicket.module.css'

/** Três linhas de item, o mesmo teto que a comanda mostra antes de resumir. */
const GHOST_ITEMS = ['first', 'second', 'third']

/**
 * A forma da comanda enquanto ela não chega. Divide o módulo com o
 * OrderTicket de propósito: as duas leem as mesmas classes de estrutura, então
 * mudar o cabeçalho ou o rodapé de uma move a outra junto.
 *
 * A lista de itens herda o `hidden sm:flex` da comanda de verdade — no celular
 * ela não existe, e um esqueleto que a desenhasse ficaria mais alto que o
 * cartão que vai ocupar o lugar.
 */
export const OrderTicketSkeleton = () => (
  <Card asChild className={styles.ticket}>
    <article>
      <header className={styles.head}>
        <Skeleton className={styles.ghostNumber} />
        <Skeleton className={styles.ghostWaited} />
        <Skeleton className={styles.ghostStatus} />
      </header>

      <div className={styles.body}>
        <Skeleton className={styles.ghostCustomer} />
        <Skeleton className={styles.ghostMeta} />
        <Skeleton className={styles.ghostSummary} />

        <div className={styles.items}>
          {GHOST_ITEMS.map((item) => (
            <div key={item} className={styles.item}>
              <Skeleton className={styles.ghostQuantity} />
              <Skeleton className={styles.ghostItemName} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.foot}>
        <div className={styles.money}>
          <Skeleton className={styles.ghostTotal} />
          <Skeleton className={styles.ghostPayment} />
        </div>
        <Skeleton className={styles.ghostAction} />
      </div>
    </article>
  </Card>
)
