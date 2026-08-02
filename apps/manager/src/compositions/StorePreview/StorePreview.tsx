import { slugify } from '@utils/slugify'

import type { StorePreviewProps } from './StorePreview.types'

import styles from './StorePreview.module.css'

/**
 * A loja como o cliente vai vê-la, montando enquanto se digita. Serve de
 * confirmação antes do envio: o nome cabe, o link ficou legível, a inicial é a
 * esperada. Decorativa por definição — o formulário abaixo é quem manda.
 */
export const StorePreview = ({
  name,
  placeholder = 'O nome da sua loja',
  placeholderSlug = 'sua-loja',
}: StorePreviewProps) => {
  const typed = name.trim()
  const lit = typed.length > 0

  return (
    <div className={styles.preview} data-lit={lit} aria-hidden="true">
      <span className={styles.tile}>
        {(typed || placeholder).charAt(0).toUpperCase()}
      </span>

      <span className={styles.text}>
        <span className={styles.name}>{typed || placeholder}</span>
        <span className={styles.link}>
          nino.delivery/{typed ? slugify(typed) : placeholderSlug}
        </span>
      </span>
    </div>
  )
}
