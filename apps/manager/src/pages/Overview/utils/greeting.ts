const resolveZone = (timezone: string | null): string =>
  timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone

/** Time-of-day greeting in the unit's own timezone, not the browser's. */
export const greetingFor = (timezone: string | null): string => {
  const hour = Number(
    new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      hour12: false,
      timeZone: resolveZone(timezone),
    })
  )
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

export const dateFor = (timezone: string | null): string =>
  new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: resolveZone(timezone),
  }).format(new Date())
