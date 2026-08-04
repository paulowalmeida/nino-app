import type { Elapsed } from '@custom_types/ui/elapsed'

/** A partir daqui o pedido está demorando o bastante para incomodar. */
const LATE_MINUTES = 20

/** Quanto tempo passou, em linguagem de cozinha: minutos até virar hora. */
export const elapsedSince = (iso: string): Elapsed => {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  )

  const ratio = Math.min(1, minutes / LATE_MINUTES)

  if (minutes < 60) {
    return { label: `${minutes} min`, isLate: minutes >= LATE_MINUTES, ratio }
  }

  const rest = String(minutes % 60).padStart(2, '0')
  return { label: `${Math.floor(minutes / 60)}h${rest}`, isLate: true, ratio }
}
