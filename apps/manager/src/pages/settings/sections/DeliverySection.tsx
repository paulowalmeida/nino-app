import { ZoneList } from '@compositions/ZoneList'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import {
  useDeliveryZones,
  useZoneMutations,
} from '@hooks/settings/useDeliveryZones'

export const DeliverySection = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const { zones, isPending } = useDeliveryZones(tenantId)
  const { add, edit, toggle, drop } = useZoneMutations(tenantId)

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
