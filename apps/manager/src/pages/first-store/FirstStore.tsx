import { Button } from '@nino/ds'

import { NinoMascot } from '@components/NinoMascot'

import styles from './FirstStore.module.css'

/**
 * Placeholder for the zero-membership arm of the root route. Creating the
 * tenant is its own phase — the CTA is inert until then.
 */
export const FirstStore = () => (
  <div className={styles.shell}>
    <div className={styles.panel}>
      <NinoMascot className={styles.mascot} />
      <h1 className={styles.title}>Crie sua primeira loja</h1>
      <p className={styles.subtitle}>
        Sua conta está pronta. Falta cadastrar a loja para começar a receber
        pedidos.
      </p>
      <Button className={styles.cta} disabled>
        Criar loja
      </Button>
    </div>
  </div>
)
