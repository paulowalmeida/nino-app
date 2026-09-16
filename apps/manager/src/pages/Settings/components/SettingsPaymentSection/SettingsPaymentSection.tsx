import { useSettingsFacade } from '../../facades/useSettingsFacade/useSettingsFacade'
import { PaymentRules } from './PaymentRules/PaymentRules'

export const SettingsPaymentSection = () => {
  const { service } = useSettingsFacade()
  const { data: settings, isPending } = service.query
  const { mutate: save, isPending: isSaving } = service.save

  return (
    <PaymentRules
      settings={settings}
      isPending={isPending}
      isSaving={isSaving}
      onSave={save}
    />
  )
}
