import { QueueOrder } from "@demo/_tabs/counter/_components/queue-order/QueueOrder"

import { queueOrders, queueTiles } from "./counterTab.constants"
import styles from "./CounterTab.module.css"

export function CounterTab() {
  const tileClass = (urgent: boolean) =>
    `${styles.tile}${urgent ? ` ${styles.urgent}` : ""}`

  return (
    <div>
      <header className={styles.counterTabHeader}>
        <div>
          <p className={styles.greeting}>Boa noite</p>

          <p className={styles.owner}>Zé</p>

          <p className={styles.date}>domingo, 19 de julho · Burgão do Zé</p>
        </div>

        <span className={styles.openBadge}>Aberto até 23h</span>
      </header>

      <div className={styles.counterTabBody}>
        <p className={styles.eyebrow}>Agora na loja</p>

        <div className={styles.board}>
          {queueTiles.map(({ value, label, urgent }) => (
            <article key={label} className={tileClass(urgent)}>
              <span className={styles.counterTabValue}>{value}</span>

              <span className={styles.counterTabLabel}>{label}</span>
            </article>
          ))}
        </div>

        <section className={styles.queue}>
          <div className={styles.queueHeader}>
            <span className={styles.queueTitle}>Fila de pedidos</span>

            <span className={styles.queueHint}>
              atualiza sozinho, sem F5
            </span>
          </div>

          {queueOrders.map((order) => (
            <QueueOrder key={order.code} {...order} />
          ))}
        </section>

        <p className={styles.audit}>
          🔒 Cada mudança de status fica registrada com quem fez — é assim que
          se resolve o &ldquo;quem cancelou o pedido do cliente?&rdquo;
        </p>
      </div>
    </div>
  )
}
