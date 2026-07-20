import { Eyebrow } from '@components/Eyebrow'
import { PageTitle } from '@components/PageTitle'
import { CompanyCard } from '@compositions/CompanyCard'
import { PhoneList } from '@compositions/PhoneList'
import { ServiceRules } from '@compositions/ServiceRules'
import { WeekSchedule } from '@compositions/WeekSchedule'
import { UnitCard } from '@compositions/UnitCard'
import { ZoneList } from '@compositions/ZoneList'
import { useCompany, useSaveCompany } from '@hooks/company/useCompany'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import {
  useSaveTenant,
  useTenantDetail,
} from '@hooks/store/useTenantDetail'
import {
  useDeliveryZones,
  useZoneMutations,
} from '@hooks/settings/useDeliveryZones'
import { useOpeningHours, useSaveWeek } from '@hooks/settings/useOpeningHours'
import { usePhoneMutations, usePhones } from '@hooks/settings/usePhones'
import { useSaveSettings, useSettings } from '@hooks/settings/useSettings'

import styles from './Settings.module.css'

export const Settings = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { data: company, isPending: isCompanyPending } = useCompany()
  const { mutate: saveCompany, isPending: isSavingCompany } = useSaveCompany()

  const { data: unit, isPending: isUnitPending } = useTenantDetail(tenantId)
  const { mutate: saveUnit, isPending: isSavingUnit } = useSaveTenant(tenantId)

  const { data: settings, isPending: isSettingsPending } = useSettings(tenantId)
  const { mutate: saveSettings, isPending: isSavingSettings } =
    useSaveSettings(tenantId)

  const { hours, isPending: isHoursPending } = useOpeningHours(tenantId)
  const { mutate: saveWeek, isPending: isSavingHours } = useSaveWeek(tenantId)

  const { zones, isPending: isZonesPending } = useDeliveryZones(tenantId)
  const {
    add: addZone,
    edit: editZone,
    toggle: toggleZone,
    drop: dropZone,
  } = useZoneMutations(tenantId)

  const { phones, isPending: isPhonesPending } = usePhones(tenantId)
  const { add: addPhone, drop: dropPhone } = usePhoneMutations(tenantId)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Eyebrow>Sua loja</Eyebrow>
        <PageTitle accent="loja">As regras da loja</PageTitle>
        <p className={styles.subtitle}>
          O que você define aqui vale na hora do pedido — no app do cliente e
          no painel.
        </p>
      </header>

      <div className={styles.stack}>
        <CompanyCard
          company={company}
          isPending={isCompanyPending}
          isSaving={isSavingCompany}
          onSave={saveCompany}
        />

        <UnitCard
          unit={unit}
          isPending={isUnitPending}
          isSaving={isSavingUnit}
          onSave={saveUnit}
        />

        <ServiceRules
          settings={settings}
          isPending={isSettingsPending}
          isSaving={isSavingSettings}
          onSave={saveSettings}
        />

        <WeekSchedule
          hours={hours}
          isPending={isHoursPending}
          isSaving={isSavingHours}
          onSave={saveWeek}
        />

        <ZoneList
          zones={zones}
          isPending={isZonesPending}
          isAdding={addZone.isPending}
          onAdd={(data) => addZone.mutate(data)}
          onEdit={(id, data) => editZone.mutate({ id, ...data })}
          onToggle={(id, isActive) => toggleZone.mutate({ id, isActive })}
          onRemove={(id) => dropZone.mutate(id)}
        />

        <PhoneList
          phones={phones}
          isPending={isPhonesPending}
          isAdding={addPhone.isPending}
          onAdd={(phone) => addPhone.mutate(phone)}
          onRemove={(id) => dropPhone.mutate(id)}
        />
      </div>
    </div>
  )
}
