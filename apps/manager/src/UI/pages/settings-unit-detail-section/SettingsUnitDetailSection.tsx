import { Box } from '@nino/ds/components/Box'
import { Breadcrumb } from '@atoms/Breadcrumb/Breadcrumb'
import { UnitCard } from '@organisms/UnitCard/UnitCard'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSaveTenant } from '@hooks/store/useSaveTenant'
import { useSetMainTenant } from '@hooks/store/useSetMainTenant'
import { useTenantDetail } from '@hooks/store/useTenantDetail'

export const SettingsUnitDetailSection = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null
  const tenantName = tenant?.tenantName ?? 'Unidade'
  const { data: unit, isPending } = useTenantDetail(tenantId)
  const { mutate: save, isPending: isSaving } = useSaveTenant(tenantId)
  const { mutate: setMain, isPending: isPromoting } = useSetMainTenant(tenantId)

  return (
    <Box direction="column" gap={2}>
      <Breadcrumb trail={[{ label: 'Unidades', to: '..' }, { label: tenantName }]} />

      <UnitCard
        unit={unit}
        isPending={isPending}
        isSaving={isSaving}
        isMain={unit?.isMain ?? false}
        isPromoting={isPromoting}
        onSetMain={() => unit && setMain(unit.id)}
        onSave={save}
      />
    </Box>
  )
}
