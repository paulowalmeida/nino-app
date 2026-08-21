import { HTMLAttributes, ReactNode } from 'react'

import { Box } from '@ds/components/Box/Box'
import { Text } from '@ds/components/Text/Text'

import styles from './BarList.module.css'

type BarListItem = {
  /** Chave estável — o nome pode repetir. */
  id: string
  label: string
  /** Grandeza que desenha a barra. Negativo não é suportado. */
  value: number
  /** O que aparece à direita. Ausente, mostra o próprio `value`. */
  display?: ReactNode
}

type BarListProps = Omit<HTMLAttributes<HTMLOListElement>, 'children'> & {
  /** Linhas do ranking, na ordem em que devem aparecer */
  items: BarListItem[]
  /**
   * Teto da escala. Ausente, é o maior valor da lista — a barra do topo
   * enche, e as outras se leem em relação a ela.
   */
  max?: number
}

/**
 * Ranking por grandeza — barra horizontal, a forma que compara magnitude sem
 * pedir eixo.
 *
 * Uma cor só, de propósito: as fatias não são identidades para distinguir,
 * são o mesmo dado em tamanhos diferentes. Cor por item viraria decoração e
 * esconderia o que a ordem já diz.
 *
 * ```tsx
 * <BarList
 *   className="text-brand"
 *   items={[{ id: '1', label: 'X-Burguer', value: 42, display: 'R$ 420' }]}
 * />
 *
 * - `max` — Teto da escala. Default: o maior valor da lista
 * ```
 */
export function BarList({ items, max, className, ...props }: BarListProps) {
  if (items.length === 0) return null

  const ceiling = max ?? Math.max(...items.map(({ value }) => value))

  return (
    <Box as="ol" gap={2} className={className} {...props}>
      {items.map(({ id, label, value, display }) => (
        <Box
          as="li"
          key={id}
          direction="row"
          align="center"
          gap={3}
          className={styles.row}
        >
          <span
            aria-hidden="true"
            className={styles.fillBar}
            style={{
              width: ceiling > 0 ? `${(value / ceiling) * 100}%` : 0,
            }}
          />
          <Text as="span" size="sm" color="strong" className={styles.label}>
            {label}
          </Text>
          <Text
            as="span"
            size="sm"
            weight="semibold"
            color="subtle"
            className={styles.value}
          >
            {display ?? value}
          </Text>
        </Box>
      ))}
    </Box>
  )
}
