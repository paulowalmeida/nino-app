import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import { NinoLogo } from '@shared/components/NinoLogo/NinoLogo'

import styles from './UnitsTopBar.module.css'

export const UnitsTopBar = () => {
  const { logout } = useUnitsFacade()

  return (
    <Box as="header" className={styles.bar}>
      <NinoLogo size="sm" />
      <Button variant="ghost" className={styles.action} onClick={() => void logout()}>
        Sair
      </Button>
    </Box>
  )
}
