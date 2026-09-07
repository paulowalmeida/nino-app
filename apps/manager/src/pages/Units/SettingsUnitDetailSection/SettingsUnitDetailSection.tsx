import { Box } from '@nino/ds/components/Box'
import { useUnitDetailShellFacade } from '@pages/Units/facades/useUnitDetailShellFacade/useUnitDetailShellFacade'
import { Breadcrumb } from '@shared/components/Breadcrumb/Breadcrumb'

import { UnitDetailTabs } from './UnitDetailTabs/UnitDetailTabs'

import local from './SettingsUnitDetailSection.module.css'

export const SettingsUnitDetailSection = () => {
  const { tenant } = useUnitDetailShellFacade()

  return (
    <Box className={local.panel}>
      <Breadcrumb
        trail={[
          { label: 'Unidades', to: '..' },
          { label: tenant?.tenantName ?? 'Unidade' },
        ]}
      />

      <UnitDetailTabs />
    </Box>
  )
}
