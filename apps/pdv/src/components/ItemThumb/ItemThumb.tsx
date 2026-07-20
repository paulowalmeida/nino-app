import type { ItemThumbProps } from './ItemThumb.types'

import styles from './ItemThumb.module.css'

/**
 * Six warm tones that sit next to the brand orange without competing with it.
 * The tone comes from the name, so an item keeps its colour across sessions
 * and the owner learns to spot it by colour before reading the row.
 */
const TONES = 6

const toneOf = (name: string): number => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0
  return Math.abs(hash) % TONES
}

const monogramOf = (name: string): string => {
  const words = name.replace(/^[^\p{L}\p{N}]+/u, '').split(/\s+/)
  const first = words[0]?.[0] ?? '?'
  const second = words[1]?.[0] ?? ''
  return (first + second).toUpperCase()
}

export const ItemThumb = ({ name, imageUrl, className }: ItemThumbProps) => {
  const classes = className ? `${styles.thumb} ${className}` : styles.thumb

  if (imageUrl) {
    return <img src={imageUrl} alt="" aria-hidden="true" className={classes} />
  }

  return (
    <span
      className={`${classes} ${styles[`tone${toneOf(name)}`]}`}
      aria-hidden="true"
    >
      {monogramOf(name)}
    </span>
  )
}
