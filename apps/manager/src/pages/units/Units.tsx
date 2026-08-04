import { useCallback, useState } from 'react'
import { Link } from 'react-router'

import { FirstStoreForm } from '@compositions/FirstStoreForm/FirstStoreForm'
import { StorePreview } from '@compositions/StorePreview/StorePreview'
import { NinoLogo } from '@elements/NinoLogo/NinoLogo'
import { AuthService } from '@services/auth.service'
import { useSessionStore } from '@states/useSessionStore'
import { endSession } from '@utils/end-session'

import styles from './Units.module.css'

/**
 * Unidades de quem ainda não tem nenhuma. A loja nasce aqui, na mesma tela em
 * que a segunda e a décima vão nascer — não numa tela de boas-vindas que só
 * existe uma vez na vida da conta.
 */
export const Units = () => {
  const user = useSessionStore((state) => state.user)
  const [storeName, setStoreName] = useState('')

  /* Referência estável: o formulário chama isto a cada tecla, dentro de um
   * efeito que depende da própria função. */
  const handleFormChange = useCallback(
    (values: { customName?: string }) => setStoreName(values.customName ?? ''),
    []
  )

  const handleLogout = async () => {
    try {
      await AuthService.logout()
    } catch {
      // a sessão local é encerrada mesmo se a API não responder
    }
    endSession()
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <NinoLogo />

        <button
          type="button"
          className={styles.leave}
          onClick={() => void handleLogout()}
        >
          Sair
        </button>
      </header>

      <main className={styles.page}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>Unidades</p>
            <h1 className={styles.title}>
              {user?.name ? `Sua primeira loja, ${user.name.split(' ')[0]}` : 'Sua primeira loja'}
            </h1>
            <p className={styles.subtitle}>
              Cada unidade tem cardápio, horário e zonas próprios. A empresa e a
              assinatura ficam por cima de todas.
            </p>
          </div>

          <Link to="/boas-vindas" className={styles.guideAgain}>
            Ver como funciona
          </Link>
        </div>

        <div className={styles.preview}>
          <StorePreview name={storeName} />
        </div>

        <div className={styles.form}>
          <FirstStoreForm onChange={handleFormChange} submitLabel="Criar loja" />
        </div>
      </main>
    </div>
  )
}
