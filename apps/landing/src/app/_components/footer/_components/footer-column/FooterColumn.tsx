import type { FooterColumnProps } from "./FooterColumn.types"
import styles from "./FooterColumn.module.css"

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className={styles.columnTitle}>{title}</h4>
      {links.map((link) => (
        <a key={link.label} href={link.href} className={styles.columnLink}>
          {link.label}
        </a>
      ))}
    </div>
  )
}
