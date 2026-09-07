import { useState } from 'react'
import { Link } from 'react-router'

import { Box } from '@nino/ds/components/Box'
import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Heading } from '@nino/ds/components/Heading'
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
  const { tenant, units: unitsDomain } = useUnitsFacade()
  const tenantId = tenant?.tenantId ?? null
  const { data: unit } = unitsDomain.detail
  const { mutate: removeUnit, isPending: isRemoving } = unitsDomain.remove
  const [confirming, setConfirming] = useState<{
    id: string
    name: string
  } | null>(null)
  const units = unitsDomain.groups.flatMap(({ units: list }) => list)
  const { limit, planName, isFull, isPending } = unitsDomain.limit

  const unitDetailTo = (unitTenantId: string) =>
    unitTenantId === tenantId
      ? 'informacoes'
      : `/${unitTenantId}/unidade/informacoes`

  if (isPending) return <SettingsUnitSkeleton />

  return (
    <Box as="section" className={local.panel}>
      <Box
        as="header"
        gap={3}
        align="start"
        justify="between"
        wrap
        mb={4}
        className={motion.unroll}
      >
        <Box direction="column">
          <Heading level={2} size="xl">
            Lojas da empresa
          </Heading>

          <Text size="sm" color="subtle" mt={1}>
            {limit === null
              ? `${units.length} em operação, sem limite no seu plano.`
              : `${units.length} de ${limit} inclusas no plano ${planName}.`}
          </Text>
        </Box>

        {!isFull && (
          <Button asChild className={mergeClasses(motion.press, local.add)}>
            <Link to={`/${tenantId}/unidade/nova`}>Abrir unidade</Link>
          </Button>
        )}
      </Box>

      {units.length === 0 && <EmptyState>Nenhuma loja cadastrada.</EmptyState>}

      <Box as="ul" direction="column">
        {units.map(({ tenantId: id, tenantName, companyName }, index) => (
          <UnitRow
            key={id}
            name={tenantName}
            companyName={companyName}
            to={unitDetailTo(id)}
            isCurrent={id === tenantId}
            isMain={id === tenantId && (unit?.isMain ?? false)}
            delay={riseDelay(index * 40 + 60)}
            onRemove={() => setConfirming({ id, name: tenantName })}
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
