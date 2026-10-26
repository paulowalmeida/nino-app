import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { Header } from '@nino/ds/components/Header'
import { HoverCard } from '@nino/ds/components/HoverCard'
import { Icon } from '@nino/ds/components/Icon'
import { Text } from '@nino/ds/components/Text'
import { useSettingsFacade } from '@pages/Settings/facades/useSettingsFacade/useSettingsFacade'

import { DiningTables, DiningTablesList } from '../DiningTables/DiningTables'

import local from './SettingsTablesTab.module.css'

export const SettingsTablesTab = () => {
  const { unit, diningTables } = useSettingsFacade()
  const { tables, isPending } = diningTables.query
  const { add, toggle, drop } = diningTables.mutations

  return (
    <Box className={local.settingsTablesTabContent}>
      <Box className={local.intro}>
        <Header
          level={2}
          size="lg"
          title="Mesas e QR Codes"
          actions={
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
          }
        />
      </Box>

      <DiningTables
        tables={tables}
        unitSlug={unit?.unitSlug ?? ''}
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
        unitSlug={unit?.unitSlug ?? ''}
        isPending={isPending}
        togglingId={toggle.isPending ? toggle.variables?.id : undefined}
        onToggle={toggle.mutate}
        onRemove={drop.mutate}
        removingId={drop.isPending ? drop.variables : undefined}
      />
    </Box>
  )
}
