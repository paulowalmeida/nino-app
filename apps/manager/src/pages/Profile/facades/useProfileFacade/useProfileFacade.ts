import { useEffect } from 'react'

import { useProfileStore } from '@pages/Profile/states/profile/profile.state'
import { useProfileFormStore } from '@pages/Profile/states/profile-form/profile-form.state'

export const useProfileFacade = () => {
  const profile = useProfileStore((state) => state.profile)
  const status = useProfileStore((state) => state.status)
  const error = useProfileStore((state) => state.error)
  const load = useProfileStore((state) => state.load)
  const form = useProfileFormStore((state) => state)
  const initialize = useProfileFormStore((state) => state.initialize)

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (profile) initialize(profile)
  }, [initialize, profile])

  return { profile, status, error, form }
}
