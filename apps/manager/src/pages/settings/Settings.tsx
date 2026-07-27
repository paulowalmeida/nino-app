import { Outlet, useLocation } from 'react-router'


import { PageHeader } from '@nino/ds/components/PageHeader'
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
      <PageHeader
        className={`${motion.deal} ${styles.header}`}
        title="As regras da loja"
        accent="loja"
        description="O que você define aqui vale na hora do pedido — no app do cliente e no painel."
      />

      {/* a key reanima a seção a cada troca, como uma tela nova */}
      <div key={pathname} className={`${motion.settle} ${styles.panel}`}>
        <Outlet />
      </div>
    </div>
  )
}
