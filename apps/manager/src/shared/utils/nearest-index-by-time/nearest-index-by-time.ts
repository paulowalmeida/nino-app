type Timestamped = { at: Date }

export const nearestIndexByTime = (
  items: Timestamped[],
  time: number
): number | null =>
  items.length === 0
    ? null
    :
  items.reduce(
    (best, current, index) =>
      Math.abs(current.at.getTime() - time) <
      Math.abs(items[best].at.getTime() - time)
        ? index
        : best,
    0
  )
