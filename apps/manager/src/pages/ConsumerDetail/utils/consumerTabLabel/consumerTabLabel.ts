export const consumerTabLabel = (
  name: string,
  count: number | undefined
): string => (count === undefined ? name : `${name} · ${count}`)
