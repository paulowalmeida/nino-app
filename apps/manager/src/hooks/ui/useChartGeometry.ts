import {
  SALES_CHART_MARGIN,
  SALES_CHART_NARROW_MARGIN,
} from '@constants/order.constants'

const NARROW_WIDTH = 420

export const useChartGeometry = (width: number, height: number) => {
  const isNarrow = width > 0 && width < NARROW_WIDTH
  const margin = isNarrow ? SALES_CHART_NARROW_MARGIN : SALES_CHART_MARGIN
  const drawHeight = isNarrow ? Math.min(height, 180) : height
  const innerWidth = Math.max(width - margin.left - margin.right, 0)
  const innerHeight = Math.max(drawHeight - margin.top - margin.bottom, 0)

  return { isNarrow, margin, drawHeight, innerWidth, innerHeight }
}
