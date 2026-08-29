import { Alert } from '@nino/ds/components/Alert'
import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'

import { DiningTables } from './DiningTables/DiningTables'

import motion from '@styles/motion.module.css'
import local from './SettingsTableSection.module.css'

export const SettingsTableSection = () => {
  const { tenant, diningTables } = useSettingsFacade()
  const { tables, isPending } = diningTables.query
  const { add, toggle } = diningTables.mutations

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

      <Alert variant="info">
        Esta área concentra a operação de mesas: cadastro, QR Codes e, depois,
        integração com comandas físicas.
      </Alert>

      <Box className={local.options} mt={5}>
        <Card variant="flat" className={local.option} padding="lg">
          <Box className={local.optionBody}>
            <Box className={local.optionCopy}>
              <Box
                direction="row"
                align="center"
                justify="between"
                className={local.optionTitle}
              >
                <Icon name="table" aria-hidden="true" />
                <Badge variant="brand" size="sm">
                  QR Code
                </Badge>
              </Box>
              <Heading level={3} size="md">
                Mesas e QR Codes
              </Heading>
              <Text size="sm" color="subtle">
                Cadastre as mesas da unidade e gere um código para o cliente
                iniciar ou consultar a comanda.
              </Text>
            </Box>
            <Text size="sm" color="muted" className={local.next}>
              Cadastre as mesas logo abaixo para começar.
            </Text>
          </Box>
        </Card>

        <Card variant="flat" className={local.option} padding="lg">
          <Box className={local.optionBody}>
            <Box className={local.optionCopy}>
              <Box
                direction="row"
                align="center"
                justify="between"
                className={local.optionTitle}
              >
                <Icon name="radio" aria-hidden="true" />
                <Badge size="sm">Futuro</Badge>
              </Box>
              <Heading level={3} size="md">
                Comandas físicas
              </Heading>
              <Text size="sm" color="subtle">
                Vincule cartões, pulseiras ou chaveiros NFC/RFID quando houver
                um leitor conectado à operação.
              </Text>
            </Box>
            <Text size="sm" color="muted" className={local.next}>
              Depende de hardware e integração com o dispositivo.
            </Text>
          </Box>
        </Card>
      </Box>

      <DiningTables
        tables={tables}
        tenantSlug={tenant?.tenantSlug ?? ''}
        isPending={isPending}
        isAdding={add.isPending}
        togglingId={toggle.isPending ? toggle.variables?.id : undefined}
        onAdd={add.mutate}
        onToggle={toggle.mutate}
      />
    </Box>
  )
}
