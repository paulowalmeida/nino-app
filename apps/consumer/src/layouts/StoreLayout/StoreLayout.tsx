import { Outlet } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { useStoreTheme } from '@shared/hooks/useStoreTheme/useStoreTheme'

import styles from './StoreLayout.module.css'

export const StoreLayout = () => {
  const tint = useStoreTheme()

  return (
    <Box
      className={styles.page}
      style={
        tint ? ({ '--store-tint': tint } as React.CSSProperties) : undefined
      }
    >
      <Outlet />
    </Box>
  )
}
