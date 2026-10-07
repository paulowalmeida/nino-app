import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import {
  useWelcomeFacade,
} from '@pages/Welcome/facades/useWelcomeFacade/useWelcomeFacade'
import { NinoLogo } from '@shared/components/NinoLogo/NinoLogo'

import styles from './BrandTopBar.module.css'

export const BrandTopBar = () => {
  const { leave } = useWelcomeFacade()

  return (
    <Box as="header" className={styles.bar}>
      <NinoLogo size="sm" />

      <Button variant="ghost" className={styles.brandTopBarAction} onClick={leave}>
        Pular
      </Button>
    </Box>
  )
}
