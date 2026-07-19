import { FirstStoreForm } from '@compositions/FirstStoreForm'

import { NinoMascot } from '@components/NinoMascot'

import styles from './FirstStore.module.css'

export const CreateStore = () => (
  <div className={styles.shell}>
    <div className={styles.panel}>
      <NinoMascot className={styles.mascot} />
      <h1 className={styles.title}>Crie sua loja</h1>
      <p className={styles.subtitle}>
        Sua conta está pronta. Cadastre a loja para começar a receber pedidos.
      </p>
      <FirstStoreForm />
    </div>
  </div>
)
