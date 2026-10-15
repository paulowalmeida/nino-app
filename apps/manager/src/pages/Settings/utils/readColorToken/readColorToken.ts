export const readColorToken = (token: string): string =>
  getComputedStyle(document.documentElement).getPropertyValue(token).trim()
