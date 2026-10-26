import { useSettingsFacade } from '../../facades/useSettingsFacade/useSettingsFacade'
import { CashbackRules } from './CashbackRules/CashbackRules'
import { PaymentRules } from './PaymentRules/PaymentRules'

export const SettingsPaymentSection = () => {
  const { service, cashback } = useSettingsFacade()
  const { data: settings, isPending } = service.query
  const { mutate: save, isPending: isSaving } = service.save

  return (
    <>
      <PaymentRules
        settings={settings}
        isPending={isPending}
        isSaving={isSaving}
        onSave={save}
      />
      <CashbackRules
        settings={settings}
        isPending={isPending}
        isSaving={cashback.save.isPending}
        onSave={cashback.save.mutate}
      />
    </>
  )
}
