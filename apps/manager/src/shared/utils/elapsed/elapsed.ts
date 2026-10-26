import type { Elapsed } from '@shared/types/ui/elapsed'
import type { ElapsedPace } from '@shared/types/ui/elapsed-pace'

/** Piso de quem não configurou prazo — o antigo limite fixo da parede. */
const DEFAULT_DUE_MINUTES = 20

/**
 * WHY: a régua muda de cor em degraus, não num gradiente — na parede a
 * cozinha precisa bater o olho e nomear ("aquela está vermelha"), e um tom
 * intermediário não se nomeia a três metros.
 */
const CLOSING_RATIO = 0.5
const DUE_RATIO = 0.75

const paceOf = (ratio: number, isLate: boolean): ElapsedPace => {
  if (isLate) return 'late'
  if (ratio >= DUE_RATIO) return 'due'
  if (ratio >= CLOSING_RATIO) return 'closing'

  return 'fresh'
}

/** Minutos em linguagem de cozinha: minutos até virar hora. */
const clockLabel = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`

  const rest = String(minutes % 60).padStart(2, '0')

  return `${Math.floor(minutes / 60)}h${rest}`
}

/** Quanto tempo passou desde que o pedido entrou no prazo de preparo. */
export const elapsedSince = (
  iso: string,
  dueMinutes = DEFAULT_DUE_MINUTES
): Elapsed => {
  const timestamp = new Date(iso).getTime()
  if (Number.isNaN(timestamp)) {
    return {
      label: '—',
      remaining: '—',
      isLate: false,
      pace: 'fresh',
      ratio: 0,
      overdueRatio: 0,
    }
  }

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - timestamp) / 60_000)
  )

  const isLate = minutes >= dueMinutes
  const ratio = Math.min(1, minutes / dueMinutes)
  const left = dueMinutes - minutes

  return {
    label: clockLabel(minutes),
    remaining: isLate ? `-${clockLabel(-left)}` : clockLabel(left),
    isLate,
    pace: paceOf(ratio, isLate),
    ratio,
    overdueRatio: 0,
  }
}
