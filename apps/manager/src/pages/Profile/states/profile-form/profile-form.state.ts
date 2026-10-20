import { create } from 'zustand'

import type { ProfileDraft } from '@pages/Profile/types/ProfileDraft.type'
import type { ProfileFormState } from '@pages/Profile/types/ProfileFormState.type'

import { changeProfileForm } from './operations/change-profile-form/change-profile-form'
import { initializeProfileForm } from './operations/initialize-profile-form/initialize-profile-form'
import { saveProfileForm } from './operations/save-profile-form/save-profile-form'

const EMPTY_DRAFT: ProfileDraft = { name: '', phone: '', email: '' }

export const useProfileFormStore = create<ProfileFormState>((set, get) => ({
  draft: EMPTY_DRAFT,
  isDirty: false,
  isSaving: false,
  emailError: null,
  saveError: null,
  initializedProfileId: null,
  initialize: (profile) => initializeProfileForm(set, get, profile),
  change: (patch) => changeProfileForm(set, patch),
  save: () => saveProfileForm(set, get),
}))
