import { Outlet, useLocation } from 'react-router'

import { Box } from '@nino/ds/components/Box'

import motion from '@styles/motion.module.css'
import styles from './Settings.module.css'

export const Settings = () => {
  const { pathname } = useLocation()

  return (
    <Box className={styles.page}>
      <Box key={pathname} className={`${motion.settle} ${styles.panel}`}>
        <Outlet />
      </Box>
    </Box>
  )
}
