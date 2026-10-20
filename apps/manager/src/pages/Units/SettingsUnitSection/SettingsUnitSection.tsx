import { useState } from 'react'
import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Header } from '@nino/ds/components/Header'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { useUnitsFacade } from '@pages/Units/facades/useUnitsFacade/useUnitsFacade'
import { SettingsUnitSkeleton } from '@pages/Units/skeletons/SettingsUnitSkeleton/SettingsUnitSkeleton'
import { riseDelay } from '@shared/utils/rise-delay/rise-delay'

import { RemoveUnitModal } from './RemoveUnitModal/RemoveUnitModal'
import { UnitRow } from './UnitRow/UnitRow'

import motion from '@styles/motion.module.css'
import local from './SettingsUnitSection.module.css'

export const SettingsUnitSection = () => {
  const { unit: currentUnit, units: unitsDomain } = useUnitsFacade()
  const unitId = currentUnit?.unitId ?? null
  const { data: unitDetail } = unitsDomain.detail
  const { mutate: removeUnit, isPending: isRemoving } = unitsDomain.remove
  const [confirming, setConfirming] = useState<{
    id: string
    name: string
  } | null>(null)
  const units = unitsDomain.groups.flatMap(({ units: list }) => list)
  const { limit, planName, isFull, isPending } = unitsDomain.limit

  const unitDetailTo = (targetUnitId: string) =>
    `/${targetUnitId}/unidade/informacoes`

  if (isPending) return <SettingsUnitSkeleton />

  return (
    <Box as="section" className={local.settingsUnitSectionPanel}>
      <Header
        className={motion.deal}
        level={2}
        size="xl"
        mb={4}
        title="Unidades"
        description={
          limit === null
            ? `${units.length} em operação, sem limite no seu plano.`
            : `${units.length} de ${limit} inclusas no plano ${planName}.`
        }
        actions={
          !isFull && (
            <Button asChild className={mergeClasses(motion.press, local.add)}>
              <Link to={`/${unitId}/empresa/unidades/nova`}>Abrir unidade</Link>
            </Button>
          )
        }
      />

      {units.length === 0 && <EmptyState>Nenhuma loja cadastrada.</EmptyState>}

      <Box as="ul" direction="column">
        {units.map(({ unitId: id, unitName, companyName }, index) => (
          <UnitRow
            key={id}
            name={unitName}
            companyName={companyName}
            to={unitDetailTo(id)}
            isCurrent={id === unitId}
            isMain={id === unitId && (unitDetail?.isMain ?? false)}
            delay={riseDelay(index * 40 + 60)}
            onRemove={() => setConfirming({ id, name: unitName })}
          />
        ))}
      </Box>

      <RemoveUnitModal
        open={confirming !== null}
        onOpenChange={(open) => !open && setConfirming(null)}
        unitName={confirming?.name ?? ''}
        loading={isRemoving}
        onConfirm={() =>
          confirming &&
          removeUnit(confirming.id, { onSuccess: () => setConfirming(null) })
        }
      />

      {isFull && (
        <Text size="sm" className={local.full}>
          O plano {planName} cobre {limit}{' '}
          {limit === 1 ? 'unidade' : 'unidades'}. Para abrir outra, fale com a
          gente sobre a próxima faixa.
        </Text>
      )}
    </Box>
  )
}
