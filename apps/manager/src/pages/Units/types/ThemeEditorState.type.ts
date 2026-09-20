import type { UnitTheme } from '@pages/Units/types/UnitTheme.type'

/** O que está no ar, o que está em edição e para onde dá pra voltar. */
export type ThemeEditorState = {
  published: UnitTheme | null
  draft: UnitTheme | null
  history: UnitTheme[]
}
