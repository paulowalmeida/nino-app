import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'

import { PhoneList } from './PhoneList/PhoneList'

export const SettingsContactSection = () => {
  const { contact } = useSettingsFacade()
  const { phones, isPending } = contact.query
  const { add, edit, drop } = contact.mutations

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
