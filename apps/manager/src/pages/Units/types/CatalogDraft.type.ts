/** Como o cardápio se apresenta na vitrine, enquanto o lojista decide. */
export type CatalogDraft = {
  itemStyle: 'side-image' | 'big-image' | 'condensed' | 'text-only'
  imageRatio: '1:1' | '4:3' | '16:9'
  density: 'compact' | 'comfortable'
  showDescription: boolean
}
