import { Box } from '@nino/ds/components/Box'

import headerStyles from '@pages/account/components/AccountHeader/AccountHeader.module.css'
import navStyles from '@pages/account/components/AccountNav/AccountNav.module.css'
import styles from '@pages/account/Account.module.css'

const NAV_ITEMS = Array.from({ length: 4 })

export const AccountSkeleton = () => (
  <Box className={styles.page} aria-busy="true" aria-label="Carregando a conta">
    <Box className={styles.shell}>
      <Box as="header" className={headerStyles.header}>
        <Box className={headerStyles.skBack} />
        <Box className={headerStyles.identity}>
          <Box className={headerStyles.skTitle} />
          <Box className={headerStyles.skSince} />
        </Box>
      </Box>

      <Box className={styles.body}>
        <Box as="nav" className={navStyles.nav}>
          <Box className={navStyles.list}>
            {NAV_ITEMS.map((_, index) => (
              <Box key={index} className={styles.skNavItem} />
            ))}
          </Box>
        </Box>

        <Box className={styles.panel}>
          <Box className={styles.skPanelTitle} />
          <Box className={styles.skPanelLine} />
          <Box className={styles.skPanelCard} />
        </Box>
      </Box>
    </Box>
  </Box>
)
