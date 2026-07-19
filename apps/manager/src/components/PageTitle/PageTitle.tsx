import type { PageTitleProps } from './PageTitle.types'

import styles from './PageTitle.module.css'

/**
 * Título com o sublinhado peach da landing sob a palavra que carrega o
 * assunto. O traço fica atrás do texto, como lá.
 */
export const PageTitle = ({ accent, children, className }: PageTitleProps) => (
  <h1 className={className ? `${styles.title} ${className}` : styles.title}>
    {accent ? (
      <>
        {children.replace(accent, '').trimEnd()}{' '}
        <span className={styles.accent}>{accent}</span>
      </>
    ) : (
      children
    )}
  </h1>
)
