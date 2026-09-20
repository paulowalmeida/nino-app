import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { toThemeConfig } from '@pages/Units/adapters/toThemeConfig/toThemeConfig'
import { UnitThemeService } from '@pages/Units/services/unit-theme.service/unit-theme.service'
import type { CatalogDraft } from '@pages/Units/types/CatalogDraft.type'
import type { ThemeEditorState } from '@pages/Units/types/ThemeEditorState.type'
import type { TrackingDraft } from '@pages/Units/types/TrackingDraft.type'
import { useCurrentUnit } from '@shared/hooks/session/useCurrentUnit/useCurrentUnit'
import { queryKeys } from '@shared/lib/query-keys/query-keys'
import { UnitService } from '@shared/services/unit/unit.service'
import type { UnitDetail } from '@shared/types/store/unit-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'

type ThemeDraftInput = {
  draft: UnitDraft
  unit?: UnitDetail | null
  tracking?: TrackingDraft
  catalog?: CatalogDraft
}

export const useUnitTheme = () => {
  const unit = useCurrentUnit()
  const unitId = unit?.unitId ?? null
  const queryClient = useQueryClient()
  const themeKey = queryKeys.unit.theme(unitId ?? '')

  const editor = useQuery<ThemeEditorState>({
    queryKey: themeKey,
    queryFn: () => UnitThemeService.getEditorState(unitId as string),
    enabled: !!unitId,
  })

  const refreshEditor = () => {
    void queryClient.invalidateQueries({ queryKey: themeKey })
  }

  /**
   * Logo e banner continuam sendo upload da unidade; o documento de tema
   * guarda a URL resultante. Por isso o rascunho salva os arquivos primeiro e
   * só então monta o config, senão o tema apontaria para a imagem antiga.
   */
  const persistDraft = async ({
    draft,
    unit: detail,
    tracking,
    catalog,
  }: ThemeDraftInput) => {
    const hasNewAsset = !!(draft.logoFile || draft.bannerFile)
    const saved = hasNewAsset
      ? await UnitService.saveUnit(unitId as string, draft)
      : detail

    return UnitThemeService.saveDraft(
      unitId as string,
      toThemeConfig(draft, saved, undefined, tracking, catalog)
    )
  }

  const saveDraft = useMutation({
    meta: {
      success: 'Rascunho salvo',
      errorTitle: 'O rascunho não foi salvo',
    },
    mutationFn: persistDraft,
    onSuccess: refreshEditor,
  })

  const publish = useMutation({
    meta: {
      success: 'Tema publicado na loja',
      errorTitle: 'O tema não foi publicado',
    },
    mutationFn: async (input: ThemeDraftInput) => {
      await persistDraft(input)
      return UnitThemeService.publishDraft(unitId as string)
    },
    onSuccess: refreshEditor,
  })

  const restore = useMutation({
    meta: {
      success: 'Versão restaurada',
      errorTitle: 'A versão não foi restaurada',
    },
    mutationFn: (version: number) =>
      UnitThemeService.restoreVersion(unitId as string, version),
    onSuccess: refreshEditor,
  })

  return { editor, saveDraft, publish, restore }
}
