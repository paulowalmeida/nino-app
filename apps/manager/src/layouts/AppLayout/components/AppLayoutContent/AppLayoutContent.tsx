import { Outlet } from 'react-router'

import styles from './AppLayoutContent.module.css'

type AppLayoutContentProps = {
  collapsed: boolean
}

export const AppLayoutContent = ({ collapsed }: AppLayoutContentProps) => (
  <main
    className={
      collapsed ? `${styles.main} ${styles.mainCollapsed}` : styles.main
    }
  >
    <Outlet />
  </main>
)
