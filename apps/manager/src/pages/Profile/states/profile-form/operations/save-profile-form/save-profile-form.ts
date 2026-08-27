import { EMAIL_PATTERN } from '@shared/constants/auth.constants'
import { toE164 } from '@shared/utils/phone/phone'

import { useProfileStore } from '../../../profile/profile.state'
import type { GetForm, SetForm } from '../../profile-form.state'
import { draftFromProfile } from '../initialize-profile-form/initialize-profile-form'

export const saveProfileForm = async (set: SetForm, get: GetForm) => {
  const { draft } = get()
  if (draft.email && !EMAIL_PATTERN.test(draft.email)) {
    set({ emailError: 'E-mail inválido' })
    return
  }

  const profile = useProfileStore.getState().profile
  const emailChanged = draft.email !== (profile?.credentials[0]?.email ?? '')
  set({ isSaving: true, saveError: null })

  try {
    await useProfileStore.getState().save({
      name: draft.name,
      phone: draft.phone ? toE164(draft.phone) : undefined,
    })
    if (emailChanged && draft.email) {
      await useProfileStore.getState().updateEmail(draft.email)
    }
    const updated = useProfileStore.getState().profile
    set({
      draft: updated ? draftFromProfile(updated) : draft,
      isDirty: false,
      isSaving: false,
      emailError: null,
      saveError: null,
      initializedProfileId: updated?.id ?? null,
    })
  } catch {
    set({
      isSaving: false,
      saveError: 'Não foi possível salvar. Confira os dados e tente de novo.',
    })
  }
}
