import { useCallback, useState } from 'react'
import { Link } from 'react-router'

import { FirstStoreForm } from '@compositions/FirstStoreForm'

import { NinoLogo } from '@components/NinoLogo'
import { logout } from '@services/auth/auth.service'
import { useSessionStore } from '@states/useSessionStore'
import { endSession } from '@utils/end-session'
import { slugify } from '@utils/slugify'

import styles from './Units.module.css'

const PLACEHOLDER = { name: 'O nome da sua loja', slug: 'sua-loja' }

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
      await logout()
    } catch {
      // a sessão local é encerrada mesmo se a API não responder
    }
    endSession()
  }

  const typed = storeName.trim()
  const lit = typed.length > 0

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

        {/* O cartão que o cliente vai ver, montando enquanto se digita */}
        <div className={styles.preview} data-lit={lit} aria-hidden="true">
          <span className={styles.tile}>
            {(typed || PLACEHOLDER.name).charAt(0).toUpperCase()}
          </span>

          <span className={styles.previewText}>
            <span className={styles.previewName}>
              {typed || PLACEHOLDER.name}
            </span>
            <span className={styles.previewLink}>
              nino.delivery/{typed ? slugify(typed) : PLACEHOLDER.slug}
            </span>
          </span>
        </div>

        <div className={styles.form}>
          <FirstStoreForm onChange={handleFormChange} submitLabel="Criar loja" />
        </div>
      </main>
    </div>
  )
}
