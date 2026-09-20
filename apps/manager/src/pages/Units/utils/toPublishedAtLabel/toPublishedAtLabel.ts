const FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Data de publicação de uma versão do tema, na locale do lojista. */
export const toPublishedAtLabel = (publishedAt: string | null): string => {
  if (!publishedAt) return 'Sem data de publicação'

  const published = new Date(publishedAt)

  return Number.isNaN(published.getTime())
    ? 'Sem data de publicação'
    : FORMATTER.format(published)
}
