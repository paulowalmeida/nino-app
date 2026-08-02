import { Link } from 'react-router'

import { FirstStoreForm } from '@compositions/FirstStoreForm'

import { NinoMascot } from '@components/NinoMascot'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'

import styles from './FirstStore.module.css'

/**
 * Mesma tela para a primeira loja e para a segunda: o que muda é a
 * conversa. Quem já opera não está criando conta, está abrindo unidade.
 */
export const CreateStore = () => {
  const units = useCompanyGroups().flatMap(({ units: list }) => list)
  const current = useCurrentTenant() ?? units[0]
  const isFirst = units.length === 0

  return (
    <div className={styles.shell}>
      <div className={styles.panel}>
        <NinoMascot className={styles.mascot} />
        <h1 className={styles.title}>
          {isFirst ? 'Crie sua loja' : 'Abrir nova unidade'}
        </h1>
        <p className={styles.subtitle}>
          {isFirst
            ? 'Sua conta está pronta. Cadastre a loja para começar a receber pedidos.'
            : 'Cada unidade tem cardápio, horário e zonas próprios. A equipe e a assinatura continuam da empresa.'}
        </p>
        <div className={styles.form}>
          <FirstStoreForm
            submitLabel={isFirst ? 'Criar loja' : 'Abrir unidade'}
          />
        </div>

        {!isFirst && current && (
          <Link
            to={`/${current.tenantId}/configuracoes/unidade`}
            className={styles.back}
          >
            Voltar sem abrir
          </Link>
        )}
      </div>
    </div>
  )
}
