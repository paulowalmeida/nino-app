import type { ReportPeriod, ReportRange } from '@custom_types/ui'

const DAYS_BACK: Record<ReportPeriod, number> = {
  today: 0,
  week: 6,
  month: 29,
}

/**
 * Janela do relatório a partir de um preset: do início do dia N dias atrás
 * até agora. `today` cobre só o dia corrente. As bordas viram ISO para o
 * endpoint, que espera `from`/`to` em ISO-8601.
 */
export const rangeOf = (period: ReportPeriod): ReportRange => {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - DAYS_BACK[period])
  from.setHours(0, 0, 0, 0)

  return { from: from.toISOString(), to: to.toISOString() }
}

/**
 * Janela a partir de duas datas `YYYY-MM-DD` (inputs de data): pega o dia
 * inteiro — do primeiro instante de `fromDay` ao último de `toDay`. Retorna
 * `null` enquanto uma das pontas falta ou a ordem está invertida, para o
 * hook não disparar com intervalo inválido.
 */
export const customRange = (
  fromDay: string,
  toDay: string
): ReportRange | null => {
  if (!fromDay || !toDay || fromDay > toDay) return null

  const from = new Date(`${fromDay}T00:00:00`)
  const to = new Date(`${toDay}T23:59:59.999`)

  return { from: from.toISOString(), to: to.toISOString() }
}

/** Hoje em `YYYY-MM-DD` local, para limitar os inputs de data a não-futuro. */
export const todayInput = (): string => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60_000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

/** `YYYY-MM-DD` local para `Date`, na mesma âncora de meia-noite do `customRange`. */
export const parseInputDate = (day: string): Date => new Date(`${day}T00:00:00`)

/** `Date` para `YYYY-MM-DD` local, inverso do `todayInput`. */
export const dateToInput = (date: Date): string => {
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}
