import Image from "next/image"

import styles from "./GetStarted.module.css"

import { CADASTRO_URL } from "@/config"

export function GetStarted() {
  return (
    <section id="comecar" className={styles.getStartedSection}>
      <div className={styles.wrap}>
        <div className={styles.getStartedCard}>
          <div className={styles.getStartedInner}>
            <span className={styles.pill}>🎁 30 dias grátis no Pro</span>

            <h2 className={styles.getStartedTitle}>
              Comece hoje,
              <br />
              de graça
            </h2>

            <p className={styles.lead}>
              Você começa no Pro, o plano completo, por 30 dias — o dobro do
              que a maioria oferece. Depois escolhe a faixa sabendo o que usa.
            </p>

            <a className={styles.btn} href={CADASTRO_URL}>
              Criar minha loja grátis →
            </a>

            <p className={styles.fine}>
              Sem cartão. Sem contrato. Cancela quando quiser.
            </p>
          </div>
        </div>

        <Image
          src="/nino_com_sacolinha.svg"
          alt="Nino"
          width={220}
          height={220}
          className={styles.mascot}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
