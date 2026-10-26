import { localPoint } from '@visx/event'

type TimeScale = { invert: (x: number) => Date }

export const toPointerTime = (
  event: React.PointerEvent,
  xScale: TimeScale,
  marginLeft: number
): number | null => {
  const point = localPoint(event)
  return point ? xScale.invert(point.x - marginLeft).getTime() : null
}
