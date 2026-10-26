/**
 * Derives the store address from its display name: "Lanchonete do Zé" becomes
 * "lanchonete-do-ze". Accents are stripped rather than transliterated, since
 * the slug ends up in a URL.
 */
export const toStoreSlug = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
