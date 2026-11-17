export type TextSegment = { text: string; isMatch: boolean }

/** Sem acento e sem caixa: "Pão" e "pao" são o mesmo termo para quem busca. */
export const foldSearch = (text: string): string =>
  text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()

export const matchesQuery = (text: string | null, query: string): boolean => {
  const needle = foldSearch(query.trim())
  return needle.length > 0 && !!text && foldSearch(text).includes(needle)
}

/**
 * Parte o texto em trechos para destacar o primeiro que casou com a busca. O
 * casamento ignora acento e caixa, mas o trecho devolvido é o original.
 */
export const highlightMatch = (text: string, query: string): TextSegment[] => {
  const needle = foldSearch(query.trim())
  if (!needle) return [{ text, isMatch: false }]

  let folded = ''
  const originIndex: number[] = []
  Array.from(text).forEach((_, index) => {
    const piece = foldSearch(text[index])
    folded += piece
    for (let step = 0; step < piece.length; step += 1) originIndex.push(index)
  })

  const found = folded.indexOf(needle)
  if (found < 0) return [{ text, isMatch: false }]

  const start = originIndex[found]
  let end = originIndex[found + needle.length - 1] + 1
  while (end < text.length && /\p{M}/u.test(text[end])) end += 1

  return [
    { text: text.slice(0, start), isMatch: false },
    { text: text.slice(start, end), isMatch: true },
    { text: text.slice(end), isMatch: false },
  ].filter((segment) => segment.text.length > 0)
}
