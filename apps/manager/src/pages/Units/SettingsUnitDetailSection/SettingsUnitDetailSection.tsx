import { Box } from '@nino/ds/components/Box'
import { UnitInfo } from '@pages/Units/UnitInfo/UnitInfo'

import local from './SettingsUnitDetailSection.module.css'

export const SettingsUnitDetailSection = () => {
  return (
    <Box className={local.panel}>
      <UnitInfo />
    </Box>
  )
}
