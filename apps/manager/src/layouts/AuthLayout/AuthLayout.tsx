import { Outlet } from 'react-router'

import { Box } from '@nino/ds/components/Box'

import { AuthBrandPanel } from './components/AuthBrandPanel/AuthBrandPanel'
import { AuthFormPanel } from './components/AuthFormPanel/AuthFormPanel'

import styles from './AuthLayout.module.css'

export const AuthLayout = () => (
  <Box className={styles.authShell}>
    <AuthBrandPanel />
    <AuthFormPanel>
      <Outlet />
    </AuthFormPanel>
  </Box>
)
