import Image from "next/image"

import styles from "./GetStarted.module.css"

import { CADASTRO_URL } from "@/config"

export function GetStarted() {
  return (
    <section id="comecar" className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.card}>
          <div className={styles.inner}>
            <span className={styles.pill}>🎁 30 dias grátis</span>

            <h2 className={styles.title}>
              Comece hoje,
              <br />
              de graça
            </h2>

            <p className={styles.lead}>
              30 dias grátis pra testar tudo — o dobro do que a maioria
              oferece. Sem cartão, sem compromisso.
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
          src="/mascot.svg"
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
