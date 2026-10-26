import { DEFAULT_CATALOG_DRAFT } from '@pages/Units/constants/catalog.constants'
import type { CatalogDraft } from '@pages/Units/types/CatalogDraft.type'
import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'

/** O documento vira os controles do cardápio, com o padrão do nino no vazio. */
export const toCatalogDraft = (config: ThemeConfig): CatalogDraft =>
  config.catalog ?? DEFAULT_CATALOG_DRAFT
