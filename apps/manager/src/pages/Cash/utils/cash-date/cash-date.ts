export const dateToKey = (date: Date): string =>
  date.toLocaleDateString('sv-SE')

export const todayKey = (): string => dateToKey(new Date())

export const parseKey = (key: string): Date => new Date(`${key}T00:00:00`)
