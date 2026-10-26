import type { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { NinoMascot } from '@nino/ds/components/NinoMascot'
import { NinoLogo } from '@shared/components/NinoLogo/NinoLogo'

import styles from './AuthFormPanel.module.css'

type AuthFormPanelProps = {
  children: ReactNode
}

export const AuthFormPanel = ({ children }: AuthFormPanelProps) => (
  <Box
    as="main"
    align="center"
    justify="center"
    className={styles.formPanel}
  >
    <Box direction="column" className={styles.formCard}>
      <Box direction="row" justify="center" className={styles.mobileBrand}>
        <NinoLogo
          size="md"
          mark={<NinoMascot className={styles.mobileMascot} />}
        />
      </Box>
      {children}
    </Box>
  </Box>
)
