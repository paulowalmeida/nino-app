import { savedSettingsMock } from '@pages/Settings/hooks/useSaveCashback/useSaveCashback.mock'

export const settingsServiceFeeTabMock = {
  offSettings: {
    ...savedSettingsMock,
    serviceFeeEnabled: false,
    serviceFeePercent: 10,
  },
  onSettings: {
    ...savedSettingsMock,
    serviceFeeEnabled: true,
    serviceFeePercent: 10,
  },
  percentLabel: 'Porcentagem sobre o consumo',
  switchLabel: 'Cobrar taxa de serviço',
}
