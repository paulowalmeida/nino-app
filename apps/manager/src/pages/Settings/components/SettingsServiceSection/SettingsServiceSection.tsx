import { useSettingsFacade } from '../../facades/useSettingsFacade/useSettingsFacade'
import { ServiceRules } from './ServiceRules/ServiceRules'

export const SettingsServiceSection = () => {
  const { service } = useSettingsFacade()
  const { data: settings, isPending } = service.query
  const { mutate: save, isPending: isSaving } = service.save

  return (
    <ServiceRules
      settings={settings}
      isPending={isPending}
      isSaving={isSaving}
      onSave={save}
    />
  )
}
