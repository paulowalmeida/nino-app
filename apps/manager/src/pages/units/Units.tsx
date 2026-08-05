import { useCallback, useState } from 'react'
import { Link } from 'react-router'

import { BrandTopBar } from '@components/BrandTopBar/BrandTopBar'
import { FirstStoreForm } from '@compositions/FirstStoreForm/FirstStoreForm'
import { StorePreview } from '@compositions/StorePreview/StorePreview'
import { AuthService } from '@services/auth.service'
import { useSessionStore } from '@states/useSessionStore'
import { endSession } from '@utils/end-session'

import styles from './Units.module.css'

/**
 * A primeira loja da conta. Quem já tem alguma nunca chega aqui — o
 * `FirstStoreGuard` manda de volta pro painel, onde a segunda unidade nasce
 * em Configurações › Unidades, com a navegação por perto.
 */
export const Units = () => {
  const user = useSessionStore((state) => state.user)
  const [storeName, setStoreName] = useState('')

  const firstName = user?.name?.split(' ')[0]
  const title = firstName
    ? `Sua primeira loja, ${firstName}`
    : 'Sua primeira loja'

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
      <BrandTopBar actionLabel="Sair" onAction={() => void handleLogout()} />

      <main className={styles.page}>
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>Unidades</p>
            <h1 className={styles.title}>{title}</h1>
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
