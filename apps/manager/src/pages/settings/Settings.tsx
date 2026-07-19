import { Eyebrow } from '@components/Eyebrow'
import { PageTitle } from '@components/PageTitle'
import { PhoneList } from '@compositions/PhoneList'
import { ServiceRules } from '@compositions/ServiceRules'
import { WeekSchedule } from '@compositions/WeekSchedule'
import { ZoneList } from '@compositions/ZoneList'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import {
  useDeliveryZones,
  useZoneMutations,
} from '@hooks/settings/useDeliveryZones'
import {
  useOpeningHours,
  useSaveOpeningHours,
} from '@hooks/settings/useOpeningHours'
import { usePhoneMutations, usePhones } from '@hooks/settings/usePhones'
import { useSaveSettings, useSettings } from '@hooks/settings/useSettings'

import styles from './Settings.module.css'

export const Settings = () => {
  const tenant = useCurrentTenant()
  const tenantId = tenant?.tenantId ?? null

  const { data: settings, isPending: isSettingsPending } = useSettings(tenantId)
  const { mutate: saveSettings, isPending: isSavingSettings } =
    useSaveSettings(tenantId)

  const { hours, isPending: isHoursPending } = useOpeningHours(tenantId)
  const {
    mutate: saveHours,
    isPending: isSavingHours,
    variables: savingHours,
  } = useSaveOpeningHours(tenantId)

  const { zones, isPending: isZonesPending } = useDeliveryZones(tenantId)
  const { add: addZone, toggle: toggleZone, drop: dropZone } =
    useZoneMutations(tenantId)

  const { phones, isPending: isPhonesPending } = usePhones(tenantId)
  const { add: addPhone, drop: dropPhone } = usePhoneMutations(tenantId)

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Eyebrow>Sua loja</Eyebrow>
        <PageTitle accent="regras">As regras da loja</PageTitle>
        <p className={styles.subtitle}>
          O que você define aqui vale na hora do pedido — no app do cliente e
          no painel.
        </p>
      </header>

      <div className={styles.stack}>
        <ServiceRules
          settings={settings}
          isPending={isSettingsPending}
          isSaving={isSavingSettings}
          onSave={saveSettings}
        />

        <WeekSchedule
          hours={hours}
          isPending={isHoursPending}
          savingDay={
            isSavingHours ? savingHours?.dayOfWeek : undefined
          }
          onSave={saveHours}
        />

        <ZoneList
          zones={zones}
          isPending={isZonesPending}
          isAdding={addZone.isPending}
          onAdd={(data) => addZone.mutate(data)}
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
