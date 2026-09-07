import type { CashbackDraft } from '@shared/types/settings/cashback-draft'
import type { TenantSettings } from '@shared/types/settings/tenant-settings'
import { maskMoneyAmount } from '@shared/utils/money/money'

/*
 * WHY: o saldo mínimo usa a máscara de dinheiro do balcão, digitada da direita
 * para a esquerda; o percentual é número solto e não passa por ela.
 */
export const toCashbackDraft = (settings: TenantSettings): CashbackDraft => ({
  cashbackEnabled: settings.cashbackEnabled,
  cashbackPercent: String(settings.cashbackPercent).replace('.', ','),
  cashbackMinRedeem: maskMoneyAmount(Number(settings.cashbackMinRedeem)),
})
