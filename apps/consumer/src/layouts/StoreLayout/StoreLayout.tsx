import { Outlet } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { useStoreTint } from '@shared/hooks/useStoreTint/useStoreTint'

import styles from './StoreLayout.module.css'

export const StoreLayout = () => {
  const tint = useStoreTint()

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
