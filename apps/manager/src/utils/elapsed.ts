/** A partir daqui o pedido está demorando o bastante para incomodar. */
const LATE_MINUTES = 20

export type Elapsed = {
  label: string
  isLate: boolean
}

/** Quanto tempo passou, em linguagem de cozinha: minutos até virar hora. */
export const elapsedSince = (iso: string): Elapsed => {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
  )

  if (minutes < 60) {
    return { label: `${minutes} min`, isLate: minutes >= LATE_MINUTES }
  }

  const hours = Math.floor(minutes / 60)
  return { label: `${hours}h${String(minutes % 60).padStart(2, '0')}`, isLate: true }
}
