import { useSettingsFacade } from '../../facades/useSettingsFacade/useSettingsFacade'
import { ZoneList } from './ZoneList/ZoneList'

export const SettingsDeliverySection = () => {
  const { delivery } = useSettingsFacade()
  const { zones, isPending } = delivery.query
  const { add, edit, toggle, drop } = delivery.mutations

  return (
    <ZoneList
      zones={zones}
      isPending={isPending}
      isAdding={add.isPending}
      onAdd={(data) => add.mutate(data)}
      onEdit={(id, data) => edit.mutate({ id, ...data })}
      onToggle={(id, isActive) => toggle.mutate({ id, isActive })}
      onRemove={(id) => drop.mutate(id)}
    />
  )
}
