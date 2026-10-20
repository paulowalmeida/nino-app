import { Box } from '@nino/ds/components/Box'
import { Header } from '@nino/ds/components/Header'
import { Tabs } from '@nino/ds/components/Tabs'

import { SettingsPhysicalTab } from './SettingsPhysicalTab/SettingsPhysicalTab'
import { SettingsServiceFeeTab } from './SettingsServiceFeeTab/SettingsServiceFeeTab'
import { SettingsTablesTab } from './SettingsTablesTab/SettingsTablesTab'

import motion from '@styles/motion.module.css'
import local from './SettingsTableSection.module.css'

export const SettingsTableSection = () => {
  return (
    <Box as="section" className={local.settingsTableSectionPanel}>
      <Header
        className={`${motion.deal} ${local.head}`}
        level={2}
        size="xl"
        title="Salão e comandas"
        description="Organize as mesas da unidade e a taxa de serviço que entra na conta da comanda."
      />

      <Tabs
        className={local.settingsTableSectionTabs}
        tabs={[
          {
            value: 'tables',
            label: 'Mesas e QR Codes',
            content: <SettingsTablesTab />,
          },
          {
            value: 'service-fee',
            label: 'Taxa de serviço',
            content: <SettingsServiceFeeTab />,
          },
          {
            value: 'physical',
            label: 'Comandas físicas',
            content: <SettingsPhysicalTab />,
          },
        ]}
      />
    </Box>
  )
}
