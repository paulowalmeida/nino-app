import { useId } from 'react'

import styles from './DiscountTagArt.module.css'

type DiscountTagArtProps = {
  /** O que vai impresso na etiqueta: `%`, `R$`, `+1`. */
  glyph: string
  className?: string
}

const TAG_PATH =
  'M110 30 L166 80 Q172 85 172 93 L172 222 Q172 236 158 236 L62 236 Q48 236 48 222 L48 93 Q48 85 54 80 Z'

const SPARKLE_PATH =
  'M0 -14 Q2 -2 14 0 Q2 2 0 14 Q-2 2 -14 0 Q-2 -2 0 -14 Z'

/**
 * WHY: a arte do desconto precisava de um personagem como o entregador do
 * frete grátis — traço escuro, cor chapada, uma luz e uma sombra. Uma
 * etiqueta de preço pendurada é o objeto que todo cliente lê como "oferta",
 * e pinta com a cor da loja.
 */
export const DiscountTagArt = ({ glyph, className }: DiscountTagArtProps) => {
  const clipId = `discount-tag-${useId()}`

  return (
    <svg
      viewBox="0 0 220 260"
      className={`${styles.discountTagArt} ${className ?? ''}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={TAG_PATH} />
        </clipPath>
      </defs>

      <path className={styles.string} d="M110 -10 C 96 20, 124 40, 110 72" />

      <g className={styles.backTag} transform="rotate(16 110 72)">
        <path d={TAG_PATH} />
      </g>

      <g className={styles.frontTag}>
        <path className={styles.body} d={TAG_PATH} />
        <g clipPath={`url(#${clipId})`}>
          <rect className={styles.shade} x="138" y="20" width="40" height="230" />
          <rect className={styles.light} x="58" y="96" width="8" height="122" rx="4" />
        </g>
        <line className={styles.perforation} x1="56" y1="116" x2="164" y2="116" />
        <path className={styles.outline} d={TAG_PATH} />
        <circle className={styles.hole} cx="110" cy="72" r="10" />
        <text className={styles.glyph} x="110" y="186" textAnchor="middle">
          {glyph}
        </text>
      </g>

      <path className={styles.sparkle} d={SPARKLE_PATH} transform="translate(190 64)" />
      <path
        className={styles.sparkle}
        d={SPARKLE_PATH}
        transform="translate(28 196) scale(0.7)"
      />
    </svg>
  )
}
