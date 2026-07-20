import { Breadcrumb } from '@components/Breadcrumb'
import { UnitCard } from '@compositions/UnitCard'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import {
  useSaveTenant,
  useSetMainTenant,
  useTenantDetail,
} from '@hooks/store/useTenantDetail'

import styles from './UnitDetailSection.module.css'

/** Uma loja por vez: os dados dela e o posto de matriz. */
export const UnitDetailSection = () => {
  const current = useCurrentTenant()
  const tenantId = current?.tenantId ?? null

  const { data: unit, isPending } = useTenantDetail(tenantId)
  const { mutate: save, isPending: isSaving } = useSaveTenant(tenantId)
  const { mutate: setMain, isPending: isPromoting } = useSetMainTenant(tenantId)

  return (
    <div className={styles.stack}>
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
    </div>
  )
}
