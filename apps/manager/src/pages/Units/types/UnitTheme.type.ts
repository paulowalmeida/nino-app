import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'

/** Uma versão do tema: o rascunho, a publicada ou uma do histórico. */
export type UnitTheme = {
  id: string
  unitId: string
  version: number
  config: ThemeConfig
  configVersion: number
  templateId: string
  templateVersion: number
  isDraft: boolean | null
  isPublished: boolean | null
  publishedAt: string | null
  publishedById: string | null
}
