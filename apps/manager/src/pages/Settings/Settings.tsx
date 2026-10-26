import { Outlet, useLocation } from 'react-router'

import { Box } from '@nino/ds/components/Box'

import motion from '@styles/motion.module.css'
import styles from './Settings.module.css'

const FLOW_SCROLL_ROUTES = [
  '/atendimento',
  '/pagamento',
  '/salao-comandas',
  '/entrega',
  '/informacoes',
  '/horarios',
  '/personalizar',
]

export const Settings = () => {
  const { pathname } = useLocation()
  const isFlowScroll = FLOW_SCROLL_ROUTES.some((route) =>
    pathname.endsWith(route)
  )

  return (
    <Box
      className={`${styles.settingsPage} ${isFlowScroll ? styles.pageFlow : ''}`}
    >
      <Box
        key={pathname}
        className={`${motion.deal} ${styles.settingsPanel} ${
          isFlowScroll ? styles.panelFlow : ''
        }`}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
