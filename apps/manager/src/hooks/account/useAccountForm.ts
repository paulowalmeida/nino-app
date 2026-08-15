import { useState } from 'react'

import type { Profile } from '@custom_types/account/profile'
import { EMAIL_PATTERN } from '@constants/auth.constants'
import { useSaveProfile } from '@hooks/account/useSaveProfile'
import { useUpdateMyEmail } from '@hooks/account/useUpdateMyEmail'
import { formatPhone, toE164 } from '@utils/phone'

type Draft = { name: string; phone: string; email: string }
type DraftPatch = { name?: string; phone?: string; email?: string }

const EMPTY_DRAFT: Draft = { name: '', phone: '', email: '' }

export const useAccountForm = (profile: Profile | undefined) => {
  const { mutateAsync: saveProfile, isPending: isSavingProfile } =
    useSaveProfile()
  const { mutateAsync: saveEmail, isPending: isSavingEmail } =
    useUpdateMyEmail()

  const [draft, setDraft] = useState(EMPTY_DRAFT)
  const [isDirty, setDirty] = useState(false)
  const [seed, setSeed] = useState(undefined as Profile | undefined)
  const [emailError, setEmailError] = useState(null as string | null)
  const [saveError, setSaveError] = useState(null as string | null)

  if (profile && profile !== seed) {
    setSeed(profile)
    setDraft({
      name: profile.name,
      phone: profile.phone ? formatPhone(profile.phone) : '',
      email: profile.credentials[0]?.email ?? '',
    })
    setDirty(false)
  }

  const change = (patch: DraftPatch) => {
    setDraft((current) => ({ ...current, ...patch }))
    setDirty(true)
    setEmailError(null)
    setSaveError(null)
  }

  /*
   * Nome, telefone e e-mail moram no mesmo grupo e saem no mesmo "Salvar":
   * para quem preenche, é um dado só, "meus dados" — mesmo o e-mail vivendo
   * em outra tabela (credencial de login) e outro endpoint por trás. A troca
   * de e-mail aqui não pede senha nem reverificação, então não há razão para
   * um fluxo à parte só porque a API separa os dois.
   */
  const handleSave = async () => {
    if (draft.email && !EMAIL_PATTERN.test(draft.email)) {
      setEmailError('E-mail inválido')
      return
    }

    const emailChanged =
      draft.email !== (profile?.credentials[0]?.email ?? '')

    try {
      await saveProfile({
        name: draft.name,
        phone: draft.phone ? toE164(draft.phone) : undefined,
      })
      if (emailChanged && draft.email) await saveEmail(draft.email)
      setSaveError(null)
    } catch {
      setSaveError('Não foi possível salvar. Confira os dados e tente de novo.')
    }
  }

  return {
    draft,
    isDirty,
    isSaving: isSavingProfile || isSavingEmail,
    emailError,
    saveError,
    change,
    handleSave,
  }
}
