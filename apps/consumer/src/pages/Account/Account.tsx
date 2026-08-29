import { Navigate, Outlet, useLocation, useParams } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import {
  useAccountFacade,
} from '@pages/account/facades/useAccountFacade/useAccountFacade'
import { useScrollProgress } from '@hooks/useScrollProgress'
import {
  AccountSkeleton,
} from '@pages/account/skeletons/AccountSkeleton/AccountSkeleton'
import { riseDelay } from '@utils/rise-delay'

import { PoweredBy } from '@elements/PoweredBy/PoweredBy'
import { TabBar } from '@compositions/TabBar/TabBar'

import { AccountHeader } from './components/AccountHeader/AccountHeader'
import { AccountNav } from './components/AccountNav/AccountNav'

import styles from './Account.module.css'
import motion from '@styles/motion.module.css'

export const Account = () => {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const signIn = slug ? `/${slug}/entrar` : '/entrar'

  const { customer, isSessionPending, tint } = useAccountFacade()
  const progress = useScrollProgress(60)

  if (isSessionPending) return <AccountSkeleton />

  if (!customer) return <Navigate to={signIn} replace />

  return (
    <Box
      className={styles.page}
      style={
        {
          '--p': progress,
          ...(tint ? { '--store-tint': tint } : {}),
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
