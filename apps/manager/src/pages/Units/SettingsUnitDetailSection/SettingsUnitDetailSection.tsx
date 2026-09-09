import { Box } from '@nino/ds/components/Box'
import { useUnitDetailShellFacade } from '@pages/Units/facades/useUnitDetailShellFacade/useUnitDetailShellFacade'
import { UnitInfo } from '@pages/Units/UnitInfo/UnitInfo'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import local from './SettingsUnitDetailSection.module.css'

export const SettingsUnitDetailSection = () => {
  return (
    <Box className={local.panel}>
      <UnitInfo />
    </Box>
  )
}
