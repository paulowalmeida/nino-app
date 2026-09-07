import { toast } from '@nino/ds/components/Toast'
import { ProfileService } from '@pages/Profile/services/profile/profile.service'
import type { SetProfile } from '@pages/Profile/types/SetProfile.type'
import type { UpdateProfileRequest } from '@shared/types/profile/update-profile-request'

export const saveProfile = async (set: SetProfile, data: UpdateProfileRequest) => {
  set({ isSaving: true, error: null })
  try {
    const profile = await ProfileService.updateProfile(data)
    set({ profile, status: 'success', isSaving: false })
    toast.success('Perfil salvo')
    return profile
  } catch (error) {
    set({ isSaving: false, error: 'O perfil não foi salvo' })
    toast.error('O perfil não foi salvo', 'Tente de novo em instantes.')
    throw error
  }
}
