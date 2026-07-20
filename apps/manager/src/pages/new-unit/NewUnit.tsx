import { BackLink } from '@components/BackLink'
import { Eyebrow } from '@components/Eyebrow'
import { PageTitle } from '@components/PageTitle'
import { FirstStoreForm } from '@compositions/FirstStoreForm'

import styles from './NewUnit.module.css'
import motion from '@styles/motion.module.css'

/**
 * Abrir unidade acontece dentro do painel: quem já opera não sai do
 * ambiente para cadastrar a próxima loja. Ao terminar, o painel abre
 * direto na unidade nova.
 */
export const NewUnit = () => (
  <div className={styles.page}>
    <BackLink to="../../configuracoes/unidade">Unidades</BackLink>

    <header className={`${motion.deal} ${styles.header}`}>
      <Eyebrow>Sua empresa</Eyebrow>
      <PageTitle accent="unidade">Abrir nova unidade</PageTitle>
      <p className={styles.subtitle}>
        Cada unidade tem cardápio, horário e zonas próprios. Equipe e
        assinatura continuam da empresa.
      </p>
    </header>

    <div className={`${motion.settle} ${styles.form}`}>
      <FirstStoreForm
        onCreated={({ id }) => `/${id}/configuracoes/unidade`}
      />
    </div>
  </div>
)
