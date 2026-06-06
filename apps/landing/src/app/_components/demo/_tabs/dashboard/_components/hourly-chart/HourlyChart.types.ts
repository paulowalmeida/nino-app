export type ChartBar = {
  x: number
  h: number
  color: string
}

export type ChartLabel = {
  x: number
  label: string
  peak: boolean
}

export type HourlyChartProps = {
  bars: ChartBar[]
  labels: ChartLabel[]
  peakRange?: string
}
