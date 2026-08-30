import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Heading } from '@nino/ds/components/Heading'
import { HoverCard } from '@nino/ds/components/HoverCard'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'

import { DiningTables, DiningTablesList } from '../DiningTables/DiningTables'

import local from './SettingsTablesTab.module.css'

export const SettingsTablesTab = () => {
  const { tenant, diningTables } = useSettingsFacade()
  const { tables, isPending } = diningTables.query
  const { add, toggle, drop } = diningTables.mutations

  return (
    <Box className={local.content}>
      <Box className={local.intro}>
        <Box direction="row" align="center" gap={1}>
          <Heading level={2} size="lg">
            Mesas e QR Codes
          </Heading>
          <HoverCard
            trigger={
              <Button
                size="icon"
                variant="ghost"
                className="-my-3 h-11 w-11"
                aria-label="Mais informações sobre Mesas e QR Codes"
              >
                <Icon name="info" size="sm" />
              </Button>
            }
          >
            <Text size="sm">
              Cadastre as mesas da unidade, de uma vez ou aos poucos — o Nino
              numera e gera o QR Code de cada uma para o cliente iniciar ou
              consultar a comanda.
            </Text>
          </HoverCard>
        </Box>
      </Box>

      <DiningTables
        tables={tables}
        tenantSlug={tenant?.tenantSlug ?? ''}
        isPending={isPending}
        isAdding={add.isPending}
        togglingId={toggle.isPending ? toggle.variables?.id : undefined}
        onAdd={add.mutate}
        onToggle={toggle.mutate}
        onRemove={drop.mutate}
        removingId={drop.isPending ? drop.variables : undefined}
        showList={false}
      />

      <DiningTablesList
        tables={tables}
        tenantSlug={tenant?.tenantSlug ?? ''}
        isPending={isPending}
        togglingId={toggle.isPending ? toggle.variables?.id : undefined}
        onToggle={toggle.mutate}
        onRemove={drop.mutate}
        removingId={drop.isPending ? drop.variables : undefined}
      />
    </Box>
  )
}
