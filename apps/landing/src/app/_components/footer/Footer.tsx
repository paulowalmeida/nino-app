import { FooterColumn } from "@footer/_components/footer-column/FooterColumn"

import { columns } from "./footer.constants"
import styles from "./Footer.module.css"

export function Footer() {
  return (
    <footer className={styles.landingFooter}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <span className={styles.footerLogo}>
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
        <div className={styles.footerBottom}>
          <p>© 2026 Nino Delivery</p>
          <p>Privacidade · Termos · Cookies</p>
        </div>
      </div>
    </footer>
  )
}
