import type { ReactNode } from 'react'

import { Box } from '@nino/ds/components/Box'
import { Text } from '@nino/ds/components/Text'

import styles from './ScreenPreviewFrame.module.css'

type ScreenPreviewFrameProps = {
  screen: string
  children: ReactNode
}

export const ScreenPreviewFrame = ({
  screen,
  children,
}: ScreenPreviewFrameProps) => (
  <div className={styles.frame}>
    <Box direction="row" className={styles.bar}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.dot} aria-hidden="true" />
      <Text as="span" className={styles.name}>
        {screen}
      </Text>
    </Box>

    <div className={styles.body}>
      <div className={styles.preview} aria-hidden="true" inert>
        {children}
      </div>
    </div>
  </div>
)
