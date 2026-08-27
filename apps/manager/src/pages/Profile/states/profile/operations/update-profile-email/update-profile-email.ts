import { toast } from '@nino/ds/components/Toast'
import { ProfileService } from '@pages/Profile/services/profile/profile.service'

import type { GetProfile, SetProfile } from '../../profile.state'

export const updateProfileEmail = async (
  set: SetProfile,
  get: GetProfile,
  email: string
) => {
  set({ isUpdatingEmail: true })
  try {
    const credential = await ProfileService.updateMyEmail(email)
    const profile = get().profile
    set({
      profile: profile
        ? {
            ...profile,
            credentials: profile.credentials.map((item, index) =>
              index === 0 ? credential : item
            ),
          }
        : profile,
      isUpdatingEmail: false,
    })
    toast.success('E-mail de login atualizado')
    return credential
  } catch (error) {
    set({ isUpdatingEmail: false })
    throw error
  }
}
