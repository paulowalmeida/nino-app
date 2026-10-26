import type { ThemeConfig } from '@pages/Units/types/ThemeConfig.type'
import type { ThemeEditorState } from '@pages/Units/types/ThemeEditorState.type'
import type { UnitTheme } from '@pages/Units/types/UnitTheme.type'
import { api } from '@shared/services/http/http.service'

type SaveThemeDraftRequest = ThemeConfig & { templateId?: string }

export const UnitThemeService = {
  getEditorState: (unitId: string): Promise<ThemeEditorState> =>
    api.get<ThemeEditorState>(`units/${unitId}/theme`),

  saveDraft: (
    unitId: string,
    draft: SaveThemeDraftRequest
  ): Promise<UnitTheme> =>
    api.update<SaveThemeDraftRequest, UnitTheme>(
      `units/${unitId}/theme/draft`,
      draft
    ),

  publishDraft: (unitId: string): Promise<UnitTheme> =>
    api.create<undefined, UnitTheme>(
      `units/${unitId}/theme/publish`,
      undefined
    ),

  restoreVersion: (unitId: string, version: number): Promise<UnitTheme> =>
    api.create<undefined, UnitTheme>(
      `units/${unitId}/theme/versions/${version}/restore`,
      undefined
    ),
}
