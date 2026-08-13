import type { ReactNode } from 'react'

import { Flexbox } from '@nino/ds/components/Flexbox'
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
    <Flexbox direction="row" className={styles.bar}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.dot} aria-hidden="true" />
      <Text as="span" className={styles.name}>
        {screen}
      </Text>
    </Flexbox>

    <div className={styles.body}>
      <div className={styles.preview} aria-hidden="true" inert>
        {children}
      </div>
    </div>
  </div>
)
