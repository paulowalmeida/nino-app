import { Outlet } from 'react-router'

import styles from './AppLayoutContent.module.css'

export const AppLayoutContent = () => (
  <main className={styles.main}>
    <Outlet />
  </main>
)
