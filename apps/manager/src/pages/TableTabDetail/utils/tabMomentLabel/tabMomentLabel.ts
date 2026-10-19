const momentFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
})

export const tabMomentLabel = (isoMoment: string): string =>
  momentFormatter.format(new Date(isoMoment))
