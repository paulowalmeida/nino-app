import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Header } from '@nino/ds/components/Header'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import local from './SettingsPhysicalTab.module.css'

export const SettingsPhysicalTab = () => (
  <Card variant="flat" className={local.option} padding="lg">
    <Box className={local.settingsPhysicalTabBody}>
      <Box className={local.copy}>
        <Box
          direction="row"
          align="center"
          justify="between"
          className={local.settingsPhysicalTabTitle}
        >
          <Icon name="radio" aria-hidden="true" />
          <Badge size="sm">Em breve</Badge>
        </Box>
        <Header
          level={3}
          size="md"
          title="Comandas físicas"
          description="Vincule cartões, pulseiras ou chaveiros NFC/RFID quando houver um leitor conectado à operação."
        />
      </Box>
      <Text size="sm" color="muted" className={local.next}>
        Estamos preparando essa integração para a operação do salão.
      </Text>
    </Box>
  </Card>
)
