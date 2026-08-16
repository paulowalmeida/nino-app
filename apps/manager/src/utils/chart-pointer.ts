import { localPoint } from '@visx/event'

type TimeScale = { invert: (x: number) => Date }

/** Pointer x, translated through the scale into a timestamp. */
export const pointerTime = (
  event: React.PointerEvent,
  xScale: TimeScale,
  marginLeft: number
): number | null => {
  const point = localPoint(event)
  return point ? xScale.invert(point.x - marginLeft).getTime() : null
}

type Timestamped = { at: Date }

export const nearestIndexByTime = (
  items: Timestamped[],
  time: number
): number =>
  items.reduce(
    (best, current, index) =>
      Math.abs(current.at.getTime() - time) <
      Math.abs(items[best].at.getTime() - time)
        ? index
        : best,
    0
  )
