import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { shortcutLabel } from '@layouts/AppLayout/utils/shortcut-label/shortcut-label'
import { NinoLogo } from '@shared/components/NinoLogo/NinoLogo'

import { NotificationBell } from './NotificationBell/NotificationBell'
import { StoreSwitcher } from './StoreSwitcher/StoreSwitcher'
import { UserMenu } from './UserMenu/UserMenu'

import styles from './AppLayoutHeader.module.css'

const SEARCH_SHORTCUT = shortcutLabel('K')

type AppLayoutHeaderProps = {
  unitId: string | null
  unitName?: string
  positionName?: string
  userName: string
  userEmail?: string
  onOpenMenu: () => void
  onOpenCommandPalette: () => void
}

export const AppLayoutHeader = ({
  unitId,
  unitName,
  positionName,
  userName,
  userEmail,
  onOpenMenu,
  onOpenCommandPalette,
}: AppLayoutHeaderProps) => (
  <Box as="header" direction="row" className={styles.appLayoutHeader}>
    <Button
      size="icon"
      variant="ghost"
      className={styles.hamburger}
      onClick={onOpenMenu}
      aria-label="Abrir menu"
    >
      <Icon name="menu" size="md" />
    </Button>

    <Box direction="row" className={styles.brand}>
      <NinoLogo size="sm" tone="light" to={`/${unitId}/visao-geral`} />
    </Box>

    <Box direction="row" className={styles.switcherSlot}>
      <StoreSwitcher currentUnitId={unitId} />
    </Box>

    <Box direction="row" className={styles.actions}>
      <Button
        variant="ghost"
        className={styles.searchButton}
        onClick={onOpenCommandPalette}
        aria-label="Buscar funcionalidade"
      >
        <Icon name="search" size="sm" />
        <Text as="span" className={styles.searchLabel}>
          Buscar funcionalidade
        </Text>
        <Text as="span" className={styles.searchShortcut} aria-hidden="true">
          {SEARCH_SHORTCUT}
        </Text>
      </Button>
      <NotificationBell unitId={unitId} />
      <UserMenu
        name={userName}
        email={userEmail}
        positionName={positionName}
        unitName={unitName}
        unitId={unitId}
      />
    </Box>
  </Box>
)
