import { FooterColumn } from "@footer/_components/footer-column/FooterColumn"

import { columns } from "./footer.constants"
import styles from "./Footer.module.css"

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>
              nino<i>.</i>
            </span>
            <p className={styles.tagline}>
              Delivery com a sua cara, sem comissão abusiva.
            </p>
          </div>
          {columns.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}
        </div>
        <div className={styles.bottom}>
          <p>© 2026 Nino Delivery</p>
          <p>Privacidade · Termos · Cookies</p>
        </div>
      </div>
    </footer>
  )
}
