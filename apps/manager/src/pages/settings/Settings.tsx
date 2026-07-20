import { Outlet, useLocation } from 'react-router'

import { Eyebrow } from '@components/Eyebrow'
import { PageTitle } from '@components/PageTitle'

import styles from './Settings.module.css'
import motion from '@styles/motion.module.css'

/**
 * Casca das configurações. A navegação entre seções é uma só — os subitens
 * do menu lateral — então aqui entra o cabeçalho e a seção aberta.
 */
export const Settings = () => {
  const { pathname } = useLocation()

  return (
    <div className={styles.page}>
      <header className={`${motion.deal} ${styles.header}`}>
        <Eyebrow>Sua loja</Eyebrow>
        <PageTitle accent="loja">As regras da loja</PageTitle>
        <p className={styles.subtitle}>
          O que você define aqui vale na hora do pedido — no app do cliente e
          no painel.
        </p>
      </header>

      {/* a key reanima a seção a cada troca, como uma tela nova */}
      <div key={pathname} className={`${motion.settle} ${styles.panel}`}>
        <Outlet />
      </div>
    </div>
  )
}
