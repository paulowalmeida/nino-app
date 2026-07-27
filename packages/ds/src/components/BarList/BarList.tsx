import { mergeClasses } from '@ds/lib/mergeClasses'

import { BarListProps } from './BarList.types'

const baseRoot = 'flex flex-col gap-2'

/* O rótulo fica sobre a barra, não numa coluna à esquerda: nome de produto é
 * longo e uma coluna de rótulo comeria a largura que a comparação precisa. */
const baseRow = 'relative flex items-center gap-3 overflow-hidden rounded-[4px]'

/*
 * Trilho e barra na mesma altura da linha de texto. A ponta do dado é
 * arredondada e a base fica reta — a barra cresce de uma origem só, e
 * arredondar os dois lados faria a origem parecer flutuar.
 */
const baseTrack = 'absolute inset-y-0 left-0 rounded-r-[4px] bg-current'

const baseLabel = 'relative min-w-0 flex-1 truncate py-1.5 pl-2 text-sm'

const baseValue = 'relative shrink-0 pr-2 text-sm font-semibold tabular-nums'

/**
 * Ranking por grandeza — barra horizontal, a forma que compara magnitude sem
 * pedir eixo.
 *
 * Uma cor só, de propósito: as fatias não são identidades para distinguir,
 * são o mesmo dado em tamanhos diferentes. Cor por item viraria decoração e
 * esconderia o que a ordem já diz.
 *
 * @param items - Linhas do ranking, na ordem em que devem aparecer
 *
 * @param max - Teto da escala. Default: o maior valor da lista
 *
 * @example
 * <BarList
 *   className="text-brand"
 *   items={[{ id: '1', label: 'X-Burguer', value: 42, display: 'R$ 420' }]}
 * />
 */
export function BarList({ items, max, className, ...props }: BarListProps) {
  if (items.length === 0) return null

  const ceiling = max ?? Math.max(...items.map(({ value }) => value))

  return (
    <ol className={mergeClasses(baseRoot, className)} {...props}>
      {items.map(({ id, label, value, display }) => (
        <li key={id} className={baseRow}>
          <span
            aria-hidden="true"
            className={baseTrack}
            style={{
              width: ceiling > 0 ? `${(value / ceiling) * 100}%` : 0,
              opacity: 0.16,
            }}
          />
          <span className={mergeClasses(baseLabel, 'text-ink')}>{label}</span>
          <span className={mergeClasses(baseValue, 'text-subtle')}>
            {display ?? value}
          </span>
        </li>
      ))}
    </ol>
  )
}

BarList.displayName = 'BarList'
