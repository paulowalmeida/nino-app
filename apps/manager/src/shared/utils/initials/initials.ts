/** First letter of the first two words — enough to tell people apart. */
export const initialsOf = (name: string): string =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
