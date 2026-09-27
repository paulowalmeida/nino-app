import { api } from '@shared/services/http/http.service'
import type { CreateStoreRequest } from '@shared/types/store/create-store-request'
import type { CreatedStore } from '@shared/types/store/created-store'
import type { PauseRequest } from '@shared/types/store/pause-request'
import type { StoreTypeOption } from '@shared/types/store/store-type-option'
import type { UnitDetail } from '@shared/types/store/unit-detail'
import type { UnitDraft } from '@shared/types/store/unit-draft'
import type { UnitMapLocation } from '@shared/types/store/unit-map-location'
import type { UnitPause } from '@shared/types/store/unit-pause'
import type { UpdateUnitRequest } from '@shared/types/store/update-unit-request'

export const UnitService = {
  uploadBrandAsset: async (
    unitId: string,
    asset: 'logo' | 'banner',
    file: File
  ): Promise<UnitDetail> => {
    const body = new FormData()
    body.append('file', file)
    return api.createFormData<UnitDetail>(
      `units/${unitId}/branding/${asset}`,
      body
    )
  },

  saveUnit: async (unitId: string, draft: UnitDraft): Promise<UnitDetail> => {
    const { logoFile, bannerFile, logoUrl, bannerUrl, ...data } = draft
    let nextLogoUrl = logoUrl
    let nextBannerUrl = bannerUrl

    if (logoFile)
      nextLogoUrl = (
        await UnitService.uploadBrandAsset(unitId, 'logo', logoFile)
      ).logoUrl
    if (bannerFile)
      nextBannerUrl = (
        await UnitService.uploadBrandAsset(unitId, 'banner', bannerFile)
      ).bannerUrl

    return UnitService.updateUnit(unitId, {
      ...data,
      ...(nextLogoUrl !== undefined ? { logoUrl: nextLogoUrl } : {}),
      ...(nextBannerUrl !== undefined ? { bannerUrl: nextBannerUrl } : {}),
    })
  },

  createStore: (data: CreateStoreRequest): Promise<CreatedStore> =>
    api.create<CreateStoreRequest, CreatedStore>('my/company/units', data),

  listStoreTypes: (): Promise<StoreTypeOption[]> =>
    api.get<StoreTypeOption[]>('my/company/units/types'),

  getById: (unitId: string): Promise<UnitDetail> =>
    api.get<UnitDetail>(`units/${unitId}`),

  getMapLocation: (unitId: string): Promise<UnitMapLocation | null> =>
    api.get<UnitMapLocation | null>(`units/${unitId}/map-location`),

  updateUnit: (unitId: string, data: UpdateUnitRequest): Promise<UnitDetail> =>
    api.patch<UpdateUnitRequest, UnitDetail>(`units/${unitId}`, data),

  getPause: (unitId: string): Promise<UnitPause> =>
    api.get<UnitPause>(`units/${unitId}/pause`),

  pauseStore: (unitId: string, data: PauseRequest): Promise<UnitPause> =>
    api.patch<PauseRequest, UnitPause>(`units/${unitId}/pause`, data),

  resumeStore: (unitId: string): Promise<UnitPause> =>
    api.patch<Record<string, never>, UnitPause>(`units/${unitId}/resume`, {}),

  removeUnit: (unitId: string): Promise<{ message: string }> =>
    api.remove<{ message: string }>(`units/${unitId}`),

  setMainUnit: (unitId: string): Promise<UnitDetail> =>
    api.patch<Record<string, never>, UnitDetail>(`units/${unitId}/main`, {}),
}
