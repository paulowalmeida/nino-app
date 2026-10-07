import { Outlet, useLocation, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { useScrollProgress } from '@hooks/useScrollProgress/useScrollProgress'
import { AccountHeader } from './components/AccountHeader/AccountHeader'
import { AccountNav } from './components/AccountNav/AccountNav'
import { FooterNav } from '@shared/components/FooterNav/FooterNav'
import { riseDelay } from '@utils/rise-delay'

import motion from '@styles/motion.module.css'

import styles from './AccountLayout.module.css'

export const AccountLayout = () => {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const progress = useScrollProgress(60)

  return (
    <Box
      className={styles.accountLayoutPage}
      style={
        {
          '--p': progress,
        } as React.CSSProperties
      }
    >
      <Box className={styles.accountLayoutShell}>
        <AccountHeader />

        <Box className={styles.accountLayoutBody}>
          <AccountNav />

          <Box
            key={pathname}
            className={`${motion.settle} ${styles.accountLayoutPanel}`}
            style={riseDelay(60)}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>

      <FooterNav base={slug ? `/${slug}` : ''} />
    </Box>
  )
}
