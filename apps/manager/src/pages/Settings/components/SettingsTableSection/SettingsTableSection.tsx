import { Box } from '@nino/ds/components/Box'
import { Heading } from '@nino/ds/components/Heading'
import { Tabs } from '@nino/ds/components/Tabs'
import { Text } from '@nino/ds/components/Text'

import { SettingsPhysicalTab } from './SettingsPhysicalTab/SettingsPhysicalTab'
import { SettingsTablesTab } from './SettingsTablesTab/SettingsTablesTab'

import motion from '@styles/motion.module.css'
import local from './SettingsTableSection.module.css'

export const SettingsTableSection = () => {
  return (
    <Box as="section" className={local.panel}>
      <Box as="header" className={`${motion.unroll} ${local.head}`}>
        <Heading level={2} size="xl">
          Salão e comandas
        </Heading>
        <Text size="sm" color="subtle" mt={1}>
          Organize as mesas da unidade e escolha como cada comanda será
          identificada.
        </Text>
      </Box>

      <Tabs
        className={local.tabs}
        tabs={[
          {
            value: 'tables',
            label: 'Mesas e QR Codes',
            content: <SettingsTablesTab />,
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
