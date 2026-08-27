import { create } from 'zustand'

import type { Profile } from '@shared/types/profile/profile'

import { changeProfileForm } from './operations/change-profile-form/change-profile-form'
import { initializeProfileForm } from './operations/initialize-profile-form/initialize-profile-form'
import { saveProfileForm } from './operations/save-profile-form/save-profile-form'

export type ProfileDraft = { name: string; phone: string; email: string }

export type ProfileFormState = {
  draft: ProfileDraft
  isDirty: boolean
  isSaving: boolean
  emailError: string | null
  saveError: string | null
  initializedProfileId: string | null
  initialize: (profile: Profile) => void
  change: (patch: Partial<ProfileDraft>) => void
  save: () => Promise<void>
}

const EMPTY_DRAFT: ProfileDraft = { name: '', phone: '', email: '' }

export type SetForm = (
  partial:
    | Partial<ProfileFormState>
    | ((state: ProfileFormState) => Partial<ProfileFormState>)
) => void
export type GetForm = () => ProfileFormState

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
