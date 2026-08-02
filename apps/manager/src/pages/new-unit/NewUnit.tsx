import { Breadcrumb } from '@components/Breadcrumb'
import { PageHeader } from '@nino/ds/components/PageHeader'
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
    <Breadcrumb
      trail={[
        { label: 'Configurações', to: '../../configuracoes/empresa' },
        { label: 'Unidades', to: '../../configuracoes/unidade' },
        { label: 'Nova unidade' },
      ]}
    />

    <PageHeader
      className={`${motion.deal} ${styles.header}`}
      title="Abrir nova unidade"
      accent="unidade"
      description="Cada unidade tem cardápio, horário e zonas próprios. Equipe e assinatura continuam da empresa."
    />

    <div className={`${motion.settle} ${styles.form}`}>
      <FirstStoreForm
        submitLabel="Abrir unidade"
        onCreated={({ id }) => `/${id}/configuracoes/unidade`}
      />
    </div>
  </div>
)
