const day = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

export const orderDateLabel = (createdAt: string) =>
  day.format(new Date(createdAt))
