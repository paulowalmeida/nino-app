import { slugify } from '@utils/slugify'

import styles from './StorePreview.module.css'

export type StorePreviewProps = {
  /** Typed name. Empty keeps the sign dark, showing the placeholder text. */
  name: string
  /** Placeholder text while no one has typed anything. */
  placeholder?: string
  /** Placeholder slug, shown next to the domain while the sign is dark. */
  placeholderSlug?: string
}

/**
 * The store as the customer will see it, assembling itself as it's typed.
 * Serves as confirmation before submitting: the name fits, the link reads
 * clearly, the initial is the one expected. Decorative by definition — the
 * form below is the one in charge.
 */
export const StorePreview = ({
  name,
  placeholder = 'O nome da sua loja',
  placeholderSlug = 'sua-loja',
}: StorePreviewProps) => {
  const typed = name.trim()
  const isLit = typed.length > 0

  return (
    <div className={styles.preview} data-lit={isLit} aria-hidden="true">
      <span className={styles.tile}>
        {(typed || placeholder).charAt(0).toUpperCase()}
      </span>

      <span className={styles.text}>
        <span className={styles.name}>{typed || placeholder}</span>
        <span className={styles.link}>
          {typed ? slugify(typed) : placeholderSlug}.dev.nino.delivery
        </span>
      </span>
    </div>
  )
}
