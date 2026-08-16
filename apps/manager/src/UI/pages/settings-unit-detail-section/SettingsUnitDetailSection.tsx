import { Flexbox } from '@nino/ds/components/Flexbox'
import { Breadcrumb } from '@atoms/Breadcrumb/Breadcrumb'
import { UnitCard } from '@organisms/UnitCard/UnitCard'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSaveTenant } from '@hooks/store/useSaveTenant'
import { useSetMainTenant } from '@hooks/store/useSetMainTenant'
import { useTenantDetail } from '@hooks/store/useTenantDetail'

/** Uma loja por vez: os dados dela e o posto de matriz. */
export const SettingsUnitDetailSection = () => {
  const current = useCurrentTenant()
  const tenantId = current?.tenantId ?? null

  const { data: unit, isPending } = useTenantDetail(tenantId)
  const { mutate: save, isPending: isSaving } = useSaveTenant(tenantId)
  const { mutate: setMain, isPending: isPromoting } = useSetMainTenant(tenantId)

  return (
    <Flexbox direction="column" gap={2}>
      <Breadcrumb
        trail={[
          { label: 'Unidades', to: '..' },
          { label: current?.tenantName ?? 'Unidade' },
        ]}
      />

      <UnitCard
        unit={unit}
        isPending={isPending}
        isSaving={isSaving}
        isMain={unit?.isMain ?? false}
        isPromoting={isPromoting}
        onSetMain={() => unit && setMain(unit.id)}
        onSave={save}
      />
    </Flexbox>
  )
}
