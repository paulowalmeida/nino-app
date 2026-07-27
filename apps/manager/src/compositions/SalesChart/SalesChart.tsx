import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { AxisBottom, AxisLeft } from '@visx/axis'
import { localPoint } from '@visx/event'
import { Group } from '@visx/group'
import { scaleLinear, scaleTime } from '@visx/scale'
import { AreaClosed, Bar, LinePath } from '@visx/shape'
import { useTooltip, useTooltipInPortal } from '@visx/tooltip'
import { curveMonotoneX } from '@visx/curve'

import { brl } from '@utils/money'

import type { SalesChartProps, SalesMetric } from './SalesChart.types'

import styles from './SalesChart.module.css'

/*
 * Sobra para os eixos respirarem, em duas medidas: no celular o rótulo do eixo
 * Y é mais curto e a margem larga comeria a área de desenho.
 */
const MARGIN = { top: 12, right: 20, bottom: 32, left: 52 }
/* A direita segura o último rótulo do eixo: com 8px, a data final saía
   cortada na borda do cartão. */
const NARROW_MARGIN = { top: 8, right: 20, bottom: 28, left: 38 }

/* Abaixo disso o gráfico é estreito: menos marcas no eixo e margem menor. */
const NARROW_WIDTH = 420

const STROKE = 2
const DOT_RADIUS = 4

const hourLabel = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const dayLabel = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
})

const fullLabel = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
})

const compact = new Intl.NumberFormat('pt-BR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

type Datum = { at: Date; value: number }

const valueOf = (value: number, metric: SalesMetric): string =>
  metric === 'revenue' ? brl(value) : String(value)

/**
 * Evolução da venda no período: área fechada com linha por cima, uma série só.
 *
 * Sem legenda de propósito — uma série é nomeada pelo título do bloco, e uma
 * caixa com um quadradinho repetiria o que já está escrito acima dela.
 *
 * A área existe para dar corpo à linha sem inventar uma segunda cor; fica em
 * gradiente fraco para não competir com o traço, que é o que se lê.
 */
export const SalesChart = ({
  points,
  granularity,
  metric = 'revenue',
  height = 240,
  label,
}: SalesChartProps) => {
  const [width, setWidth] = useState(0)
  const holder = useRef<HTMLElement | null>(null)

  /*
   * Medir uma vez não basta: a largura muda ao girar o celular, ao recolher a
   * sidebar e quando a fonte termina de carregar. Sem observar, o desenho fica
   * preso no tamanho do primeiro render.
   */
  useEffect(() => {
    const node = holder.current
    if (!node) return

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width)
    })

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    showTooltip,
    hideTooltip,
    tooltipOpen,
  } = useTooltip<Datum>()

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: true,
  })

  const data = useMemo<Datum[]>(
    () =>
      points.map((point) => ({
        at: new Date(point.at),
        value: metric === 'revenue' ? point.revenue : point.orderCount,
      })),
    [points, metric]
  )

  const isNarrow = width > 0 && width < NARROW_WIDTH
  const margin = isNarrow ? NARROW_MARGIN : MARGIN
  const drawHeight = isNarrow ? Math.min(height, 180) : height

  const innerWidth = Math.max(width - margin.left - margin.right, 0)
  const innerHeight = Math.max(drawHeight - margin.top - margin.bottom, 0)

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [data[0]?.at ?? new Date(), data[data.length - 1]?.at ?? new Date()],
        range: [0, innerWidth],
      }),
    [data, innerWidth]
  )

  /* O eixo começa no zero mesmo quando a série não chega perto dele: partir do
     mínimo faria uma variação de centavos parecer um salto. */
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.value), 1) * 1.1],
        range: [innerHeight, 0],
        nice: true,
      }),
    [data, innerHeight]
  )

  const handleMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      const point = localPoint(event)
      if (!point || data.length === 0) return

      const x = point.x - margin.left
      const time = xScale.invert(x).getTime()

      const nearest = data.reduce((best, current) =>
        Math.abs(current.at.getTime() - time) < Math.abs(best.at.getTime() - time)
          ? current
          : best
      )

      showTooltip({
        tooltipData: nearest,
        tooltipLeft: margin.left + (xScale(nearest.at) ?? 0),
        tooltipTop: margin.top + (yScale(nearest.value) ?? 0),
      })
    },
    [data, xScale, yScale, showTooltip, margin]
  )

  if (data.length < 2) return null

  return (
    <figure className={styles.figure} ref={holder}>
      <div ref={containerRef} className={styles.canvas}>
        <svg width={width} height={drawHeight} role="img" aria-label={label}>
          <defs>
            <linearGradient id="salesArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" className={styles.areaTop} />
              <stop offset="100%" className={styles.areaBottom} />
            </linearGradient>
          </defs>

          <Group left={margin.left} top={margin.top}>
            {yScale.ticks(isNarrow ? 3 : 4).map((tick) => (
              <line
                key={tick}
                x1={0}
                x2={innerWidth}
                y1={yScale(tick)}
                y2={yScale(tick)}
                className={styles.grid}
              />
            ))}

            <AreaClosed<Datum>
              data={data}
              x={(d) => xScale(d.at) ?? 0}
              y={(d) => yScale(d.value) ?? 0}
              yScale={yScale}
              curve={curveMonotoneX}
              fill="url(#salesArea)"
            />

            <LinePath<Datum>
              data={data}
              x={(d) => xScale(d.at) ?? 0}
              y={(d) => yScale(d.value) ?? 0}
              curve={curveMonotoneX}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.line}
            />

            {data.map((d) => (
              <circle
                key={d.at.toISOString()}
                cx={xScale(d.at)}
                cy={yScale(d.value)}
                r={DOT_RADIUS}
                strokeWidth={2}
                className={styles.dot}
              />
            ))}

            <AxisLeft
              scale={yScale}
              numTicks={isNarrow ? 3 : 4}
              hideAxisLine
              hideTicks
              tickFormat={(value) =>
                metric === 'revenue'
                  ? compact.format(Number(value))
                  : String(value)
              }
              tickLabelProps={() => ({ className: styles.tickText, dx: -8 })}
            />

            <AxisBottom
              scale={xScale}
              top={innerHeight}
              numTicks={Math.min(data.length, isNarrow ? 3 : 6)}
              hideTicks
              tickFormat={(value) =>
                (granularity === 'hour' ? hourLabel : dayLabel).format(
                  value as Date
                )
              }
              axisLineClassName={styles.axisLine}
              tickLabelProps={() => ({ className: styles.tickText, dy: 4 })}
            />

            {tooltipOpen && tooltipData && (
              <circle
                cx={xScale(tooltipData.at)}
                cy={yScale(tooltipData.value)}
                r={DOT_RADIUS + 2}
                strokeWidth={2}
                className={styles.dotActive}
              />
            )}

            {/* Alvo de mouse sobre a área inteira: mirar no ponto exigiria
                precisão que ninguém tem no celular. */}
            <Bar
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              onMouseMove={handleMove}
              onTouchMove={handleMove}
              onMouseLeave={hideTooltip}
              onTouchEnd={hideTooltip}
            />
          </Group>
        </svg>

        {tooltipOpen && tooltipData && (
          <TooltipInPortal
            left={tooltipLeft}
            top={tooltipTop}
            className={styles.tooltip}
          >
            <p className={styles.tooltipLabel}>
              {fullLabel.format(tooltipData.at)}
            </p>
            <p className={styles.tooltipValue}>
              {valueOf(tooltipData.value, metric)}
            </p>
          </TooltipInPortal>
        )}
      </div>
    </figure>
  )
}
