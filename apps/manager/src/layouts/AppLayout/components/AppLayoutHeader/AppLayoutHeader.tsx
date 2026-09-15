import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import styles from './AppLayoutHeader.module.css'

type AppLayoutHeaderProps = {
  unitName?: string
  onOpenMenu: () => void
}

export const AppLayoutHeader = ({
  unitName,
  onOpenMenu,
}: AppLayoutHeaderProps) => (
  <Box as="header" direction="row" className={styles.topbar}>
    <Button
      size="icon"
      variant="ghost"
      className={styles.hamburger}
      onClick={onOpenMenu}
      aria-label="Abrir menu"
    >
      <Icon name="menu" size="md" />
    </Button>
    <Text as="span" className={styles.storeName}>
      {unitName}
    </Text>
  </Box>
)
