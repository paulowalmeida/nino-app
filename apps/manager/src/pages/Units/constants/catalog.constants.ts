import type { CatalogDraft } from '@pages/Units/types/CatalogDraft.type'

export const DEFAULT_CATALOG_DRAFT: CatalogDraft = {
  itemStyle: 'side-image',
  imageRatio: '4:3',
  density: 'comfortable',
  showDescription: true,
}

export const CATALOG_ITEM_STYLE_OPTIONS = [
  { value: 'side-image', label: 'Imagem lateral' },
  { value: 'big-image', label: 'Imagem grande' },
  { value: 'condensed', label: 'Lista condensada' },
  { value: 'text-only', label: 'Só texto' },
]

export const CATALOG_IMAGE_RATIO_OPTIONS = [
  { value: '1:1', label: 'Quadrada (1:1)' },
  { value: '4:3', label: 'Retangular (4:3)' },
  { value: '16:9', label: 'Panorâmica (16:9)' },
]

export const CATALOG_DENSITY_OPTIONS = [
  { value: 'comfortable', label: 'Confortável' },
  { value: 'compact', label: 'Compacta' },
]
