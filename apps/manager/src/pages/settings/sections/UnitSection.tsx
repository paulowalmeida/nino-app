import { UnitCard } from '@compositions/UnitCard'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSaveTenant, useTenantDetail } from '@hooks/store/useTenantDetail'

export const UnitSection = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const { data: unit, isPending } = useTenantDetail(tenantId)
  const { mutate: save, isPending: isSaving } = useSaveTenant(tenantId)

  return (
    <UnitCard
      unit={unit}
      isPending={isPending}
      isSaving={isSaving}
      onSave={save}
    />
  )
}
