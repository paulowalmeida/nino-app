import { Badge } from '@nino/ds/components/Badge'
import { Box } from '@nino/ds/components/Box'
import { Card } from '@nino/ds/components/Card'
import { Heading } from '@nino/ds/components/Heading'
import { Icon } from '@nino/ds/components/Icon'
import { Tabs } from '@nino/ds/components/Tabs'
import { Text } from '@nino/ds/components/Text'
import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'

import { DiningTables, DiningTablesList } from './DiningTables/DiningTables'

import motion from '@styles/motion.module.css'
import local from './SettingsTableSection.module.css'

export const SettingsTableSection = () => {
  const { tenant, diningTables } = useSettingsFacade()
  const { tables, isPending } = diningTables.query
  const { add, toggle, drop } = diningTables.mutations

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
            content: (
              <Box className={local.tabContent}>
                <Box className={local.tabIntro}>
                  <Heading level={2} size="lg">
                    Mesas e QR Codes
                  </Heading>
                  <Text size="sm" color="subtle">
                    Cadastre as mesas da unidade e gere um código para o cliente
                    iniciar ou consultar a comanda.
                  </Text>
                  <Text size="sm" color="muted">
                    Gere várias mesas de uma vez. O Nino numera cada mesa e cria
                    seu QR Code automaticamente.
                  </Text>
                </Box>
                <Box>
                  <DiningTables
                    tables={tables}
                    tenantSlug={tenant?.tenantSlug ?? ''}
                    isPending={isPending}
                    isAdding={add.isPending}
                    togglingId={
                      toggle.isPending ? toggle.variables?.id : undefined
                    }
                    onAdd={add.mutate}
                    onToggle={toggle.mutate}
                    onRemove={drop.mutate}
                    removingId={drop.isPending ? drop.variables : undefined}
                    showList={false}
                  />
                </Box>
                <DiningTablesList
                  tables={tables}
                  tenantSlug={tenant?.tenantSlug ?? ''}
                  isPending={isPending}
                  togglingId={
                    toggle.isPending ? toggle.variables?.id : undefined
                  }
                  onToggle={toggle.mutate}
                  onRemove={drop.mutate}
                  removingId={drop.isPending ? drop.variables : undefined}
                />
              </Box>
            ),
          },
          {
            value: 'physical',
            label: 'Comandas físicas',
            content: (
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
                      <Badge size="sm">Em breve</Badge>
                    </Box>
                    <Heading level={3} size="md">
                      Comandas físicas
                    </Heading>
                    <Text size="sm" color="subtle">
                      Vincule cartões, pulseiras ou chaveiros NFC/RFID quando
                      houver um leitor conectado à operação.
                    </Text>
                  </Box>
                  <Text size="sm" color="muted" className={local.next}>
                    Estamos preparando essa integração para a operação do salão.
                  </Text>
                </Box>
              </Card>
            ),
          },
        ]}
      />
    </Box>
  )
}
