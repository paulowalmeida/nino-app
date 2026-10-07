import type { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import styles from './PersonalizeHeader.module.css'

export type PersonalizeHeaderProps = {
  storeUrl?: string
  actions?: ReactNode
}

export const PersonalizeHeader = ({ storeUrl, actions }: PersonalizeHeaderProps) => (
  <Box as="header" className={styles.headerContainer}>
    <Box className={styles.personalizeHeader}>
      <Box className={styles.copy}>
        <Heading level={1} size="2xl">
          Personalizar loja
        </Heading>
        <Text as="p" size="sm" color="subtle" className={styles.personalizeHeaderSubtitle}>
          Cor, logo e banner do cardápio que o cliente abre. A prévia acompanha
          cada alteração — nada vai pro ar antes de você publicar.
        </Text>
      </Box>
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
