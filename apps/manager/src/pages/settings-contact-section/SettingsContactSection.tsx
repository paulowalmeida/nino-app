import { PhoneList } from '@compositions/PhoneList/PhoneList'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { usePhoneMutations } from '@hooks/settings/usePhoneMutations'
import { usePhones } from '@hooks/settings/usePhones'

export const SettingsContactSection = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const { phones, isPending } = usePhones(tenantId)
  const { add, edit, drop } = usePhoneMutations(tenantId)

  return (
    <PhoneList
      phones={phones}
      isPending={isPending}
      isAdding={add.isPending}
      onAdd={(phone) => add.mutate(phone)}
      onEdit={(id, phone) => edit.mutate({ id, phone })}
      onRemove={(id) => drop.mutate(id)}
    />
  )
}
