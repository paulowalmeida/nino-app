import type { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { Icon } from '@nino/ds/components/Icon'

import motion from '@styles/motion.module.css'
import styles from './PersonalizeHeader.module.css'

export type PersonalizeHeaderProps = {
  storeUrl?: string
  actions?: ReactNode
}

export const PersonalizeHeader = ({
  storeUrl,
  actions,
}: PersonalizeHeaderProps) => (
  <Box as="header" className={styles.headerContainer}>
    <Box className={styles.personalizeHeader}>
      <Header
        className={`${motion.deal} ${styles.copy}`}
        size="xl"
        title="Personalizar"
        description="Cor, logo e banner do cardápio que o cliente abre. A prévia acompanha cada alteração — nada vai pro ar antes de você publicar."
      />
      {(storeUrl || actions) && (
        <Box
          direction="row"
          align="center"
          justify="end"
          gap={2}
          wrap
          className={styles.personalizeHeaderActions}
        >
          {storeUrl && (
            <Button asChild variant="outline" size="sm">
              <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                Ver na loja
                <Icon name="arrow-up-right" size="xs" />
              </a>
            </Button>
          )}
          {actions}
        </Box>
      )}
    </Box>
  </Box>
)
