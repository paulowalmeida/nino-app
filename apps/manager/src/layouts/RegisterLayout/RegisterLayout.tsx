import { Link, Outlet } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { NinoLogo } from '@shared/components/NinoLogo/NinoLogo'

import styles from './RegisterLayout.module.css'

export const RegisterLayout = () => (
  <Box className={styles.shell}>
    <Box
      as="header"
      direction="row"
      align="center"
      justify="between"
      className={styles.header}
    >
      <NinoLogo size="md" to="/entrar" />
      <Link to="/entrar" className={styles.exitLink}>
        Sair
      </Link>
    </Box>
    <Box as="main" align="center" className={styles.main}>
      <Box direction="column" className={styles.content}>
        <Outlet />
      </Box>
    </Box>
  </Box>
)
