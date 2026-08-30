import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'

import local from './SettingsPhysicalTab.module.css'

export const SettingsPhysicalTab = () => (
  <Card variant="flat" className={local.option} padding="lg">
    <Box className={local.body}>
      <Box className={local.copy}>
        <Box
          direction="row"
          align="center"
          justify="between"
          className={local.title}
        >
          <Icon name="radio" aria-hidden="true" />
          <Badge size="sm">Em breve</Badge>
        </Box>
        <Heading level={3} size="md">
          Comandas físicas
        </Heading>
        <Text size="sm" color="subtle">
          Vincule cartões, pulseiras ou chaveiros NFC/RFID quando houver um
          leitor conectado à operação.
        </Text>
      </Box>
      <Text size="sm" color="muted" className={local.next}>
        Estamos preparando essa integração para a operação do salão.
      </Text>
    </Box>
  </Card>
)
