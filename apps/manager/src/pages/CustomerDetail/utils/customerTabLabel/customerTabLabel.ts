export const customerTabLabel = (
  name: string,
  count: number | undefined
): string => (count === undefined ? name : `${name} · ${count}`)
