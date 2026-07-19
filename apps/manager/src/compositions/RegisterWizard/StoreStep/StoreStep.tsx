import { FirstStoreForm } from '@compositions/FirstStoreForm'

import { riseDelay } from '@utils/rise-delay'

import type { StoreStepProps } from './StoreStep.types'

import styles from '@layouts/AuthLayout/authForm.module.css'
import motion from '@layouts/AuthLayout/motion.module.css'

/**
 * Last step, already authenticated: signup created the account and set the
 * cookies, so the store goes up with a live session. Leaving here is safe —
 * the root route sends whoever has no store back to `/criar-loja`.
 */
export const StoreStep = ({ firstName }: StoreStepProps) => (
  <div>
    <header className={`${motion.rise} ${styles.header}`} style={riseDelay(0)}>
      <p className={styles.step}>Passo 3 de 3</p>

      <h1 className={styles.title}>Sua primeira loja</h1>

      <p className={styles.subtitle}>
        Conta criada, {firstName}. Falta cadastrar a loja que recebe os pedidos.
      </p>
    </header>

    <FirstStoreForm />
  </div>
)
