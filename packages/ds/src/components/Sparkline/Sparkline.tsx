import { mergeClasses } from '@ds/lib/mergeClasses'

import { SparklineProps } from './Sparkline.types'

/* A linha herda `currentColor`: quem usa escolhe o tom pela classe de texto,
 * e o gráfico acompanha o estado do bloco sem prop de cor. */
const baseRoot = 'relative block w-full text-brand'

const baseSvg = 'block w-full overflow-visible'

/*
 * O disco fica em CSS, não no SVG: o desenho estica na largura
 * (`preserveAspectRatio="none"`) para a linha ocupar o bloco, e dentro dessa
 * caixa esticada um `<circle>` viraria elipse.
 *
 * O anel na cor da superfície dá o respiro onde o disco cruza a própria linha.
 * Fundo diferente de branco sobrescreve `--chart-surface`.
 */
const baseDot =
  'absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ' +
  'bg-current ring-2 ring-[var(--chart-surface,#fff)]'

const VIEW_WIDTH = 100
const STROKE = 2
/* Folga em cima e embaixo para o disco não ser cortado na borda. */
const PADDING = 4

/** Achata a série no espaço de desenho. Série reta assenta no meio. */
const toPoints = (values: number[], height: number): [number, number][] => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min
  const usable = height - PADDING * 2
  const step = VIEW_WIDTH / (values.length - 1)

  return values.map((value, index) => [
    index * step,
    span === 0 ? height / 2 : PADDING + (1 - (value - min) / span) * usable,
  ])
}

/**
 * Linha de tendência sem eixo, para sentar ao lado de um número — não é
 * gráfico de leitura, é o formato da série. O valor exato vive no número que
 * ela acompanha.
 *
 * @param values - Série na ordem do tempo
 *
 * @param label - Nome acessível do gráfico
 *
 * @param height - Altura em px. Default: `32`
 *
 * @example
 * <Sparkline values={[3, 8, 5, 12]} label="Faturamento nos últimos 7 dias" />
 */
export function Sparkline({
  values,
  label,
  height = 32,
  showLastPoint = true,
  className,
  ...props
}: SparklineProps) {
  if (values.length < 2) return null

  const points = toPoints(values, height)
  const line = points.map(([x, y]) => `${x},${y}`).join(' ')
  const area = `${line} ${VIEW_WIDTH},${height} 0,${height}`
  const [, lastY] = points[points.length - 1]

  return (
    <span className={mergeClasses(baseRoot, className)} style={{ height }}>
      <svg
        role="img"
        aria-label={label}
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        preserveAspectRatio="none"
        height={height}
        className={baseSvg}
        {...props}
      >
        <polygon points={area} fill="currentColor" opacity={0.1} />
        <polyline
          points={line}
          fill="none"
          stroke="currentColor"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {showLastPoint && (
        <span
          aria-hidden="true"
          className={baseDot}
          style={{ left: '100%', top: `${(lastY / height) * 100}%` }}
        />
      )}
    </span>
  )
}

Sparkline.displayName = 'Sparkline'
