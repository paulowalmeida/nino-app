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
  '/cashback',
  '/personalizar',
]

export const Settings = () => {
  const { pathname } = useLocation()
  const isFlowScroll = FLOW_SCROLL_ROUTES.some((route) =>
    pathname.endsWith(route)
  )

  return (
    <Box className={`${styles.page} ${isFlowScroll ? styles.pageFlow : ''}`}>
      <Box
        key={pathname}
        className={`${motion.settle} ${styles.panel} ${
          isFlowScroll ? styles.panelFlow : ''
        }`}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
