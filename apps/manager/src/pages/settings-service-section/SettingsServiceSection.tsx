import { ServiceRules } from '@compositions/ServiceRules/ServiceRules'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSaveSettings } from '@hooks/settings/useSaveSettings'
import { useSettings } from '@hooks/settings/useSettings'

export const SettingsServiceSection = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const { data: settings, isPending } = useSettings(tenantId)
  const { mutate: save, isPending: isSaving } = useSaveSettings(tenantId)

  return (
    <ServiceRules
      settings={settings}
      isPending={isPending}
      isSaving={isSaving}
      onSave={save}
    />
  )
}
