import { Fragment } from 'react'

import { Flexbox } from '@nino/ds/components/Flexbox'
import { Text } from '@nino/ds/components/Text'
import type { WelcomePanel } from '@constants/welcome.constants'

import styles from './WelcomeStepTrack.module.css'

type WelcomeStepTrackProps = {
  panels: WelcomePanel[]
  index: number
}

export const WelcomeStepTrack = ({ panels, index }: WelcomeStepTrackProps) => (
  <Flexbox as="ol" direction="row" className={styles.track}>
    {panels.map(({ leg }, position) => (
      <Fragment key={leg}>
        {position > 0 && (
          <span className={styles.stepLine} aria-hidden="true" />
        )}
        <Flexbox
          as="li"
          direction="row"
          className={styles.step}
          data-on={position <= index}
        >
          <span className={styles.stepDot} aria-hidden="true" />
          <Text as="span" className={styles.stepLabel}>
            {leg}
          </Text>
        </Flexbox>
      </Fragment>
    ))}
  </Flexbox>
)
