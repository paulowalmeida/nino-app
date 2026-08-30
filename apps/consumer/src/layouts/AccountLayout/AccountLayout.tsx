import { Outlet, useLocation, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { useScrollProgress } from '@hooks/useScrollProgress/useScrollProgress'
import { AccountHeader } from './components/AccountHeader/AccountHeader'
import { AccountNav } from './components/AccountNav/AccountNav'
import { PoweredBy } from '@shared/components/PoweredBy/PoweredBy'
import { TabBar } from '@shared/components/TabBar/TabBar/TabBar'
import { riseDelay } from '@utils/rise-delay'

import motion from '@styles/motion.module.css'

import styles from './AccountLayout.module.css'

export const AccountLayout = () => {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const progress = useScrollProgress(60)

  return (
    <Box
      className={styles.page}
      style={
        {
          '--p': progress,
        } as React.CSSProperties
      }
    >
      <Box className={styles.shell}>
        <AccountHeader />

        <Box className={styles.body}>
          <AccountNav />

          <Box
            key={pathname}
            className={`${motion.settle} ${styles.panel}`}
            style={riseDelay(60)}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      <PoweredBy />
      <TabBar base={slug ? `/${slug}` : ''} />
    </Box>
  )
}
