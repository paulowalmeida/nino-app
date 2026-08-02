import { Outlet, useLocation } from 'react-router'

import styles from './Settings.module.css'
import motion from '@styles/motion.module.css'

/**
 * Casca das configurações: só a seção aberta. Sem cabeçalho próprio — ele
 * seria o mesmo em todas as seções, repetindo o que o menu lateral já marca e
 * empurrando o título da seção (e o formulário inteiro) para baixo da dobra.
 */
export const Settings = () => {
  const { pathname } = useLocation()

  return (
    <div className={styles.page}>
      {/* a key reanima a seção a cada troca, como uma tela nova */}
      <div key={pathname} className={`${motion.settle} ${styles.panel}`}>
        <Outlet />
      </div>
    </div>
  )
}
