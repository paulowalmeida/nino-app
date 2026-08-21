import type { Profile } from '@custom_types/account/profile'
import { useAccountForm } from '@hooks/account/useAccountForm'
import { AccountProfileForm } from '@organisms/AccountProfileForm/AccountProfileForm'

type AccountProfileContainerProps = {
  profile: Profile | undefined
}

export const AccountProfileContainer = ({
  profile,
}: AccountProfileContainerProps) => {
  const form = useAccountForm(profile)

  return (
    <AccountProfileForm
      draft={form.draft}
      isDirty={form.isDirty}
      isSaving={form.isSaving}
      emailError={form.emailError}
      saveError={form.saveError}
      onDraftChange={form.change}
      onSave={form.handleSave}
    />
  )
}
