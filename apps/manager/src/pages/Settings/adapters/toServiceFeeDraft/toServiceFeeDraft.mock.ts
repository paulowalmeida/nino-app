import { savedSettingsMock } from '@pages/Settings/hooks/useSaveCashback/useSaveCashback.mock'

export const toServiceFeeDraftMock = {
  settings: {
    ...savedSettingsMock,
    serviceFeeEnabled: true,
    serviceFeePercent: 12.5,
  },
}
