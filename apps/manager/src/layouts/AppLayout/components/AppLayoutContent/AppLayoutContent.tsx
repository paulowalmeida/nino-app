import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'

import styles from './AppLayoutContent.module.css'

export const AppLayoutContent = () => {
  const { hash, pathname, search } = useLocation()

  useEffect(() => {
    if (!hash) return

    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })

    return () => cancelAnimationFrame(frame)
  }, [hash, pathname, search])

  return (
    <main className={styles.main}>
      <Outlet />
    </main>
  )
}
