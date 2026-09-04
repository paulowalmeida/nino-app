import { Text } from '@nino/ds/components/Text'

import styles from './PoweredBy.module.css'

const LANDING_URL = 'https://dev.nino.delivery'

export const PoweredBy = () => (
  <footer className={styles.footer}>
    <a
      href={LANDING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      powered by{' '}
      <Text as="span" className={styles.mark}>
        nino
      </Text>
    </a>
  </footer>
)
