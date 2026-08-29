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
      powered by <span className={styles.mark}>nino</span>
    </a>
  </footer>
)
