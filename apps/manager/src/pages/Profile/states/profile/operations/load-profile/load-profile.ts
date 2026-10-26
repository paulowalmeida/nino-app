import { ProfileService } from '@pages/Profile/services/profile/profile.service'
import type { GetProfile } from '@pages/Profile/types/GetProfile.type'
import type { SetProfile } from '@pages/Profile/types/SetProfile.type'

export const loadProfile = async (set: SetProfile, get: GetProfile) => {
  const current = get()
  if (current.status === 'loading') return current.profile
  if (current.status === 'success' && current.profile) return current.profile

  set({ status: 'loading', error: null })
  try {
    const profile = await ProfileService.getProfile()
    set({ profile, status: 'success', error: null })
    return profile
  } catch {
    set({ status: 'error', error: 'Não foi possível carregar seu perfil.' })
    return null
  }
}
