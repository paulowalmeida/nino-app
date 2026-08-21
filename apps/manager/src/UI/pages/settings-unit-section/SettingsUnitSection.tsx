import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@nino/ds/components/Button'
import { EmptyState } from '@nino/ds/components/EmptyState'
import { Flexbox } from '@nino/ds/components/Flexbox'
import { Heading } from '@nino/ds/components/Heading'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { Text } from '@nino/ds/components/Text'
import { mergeClasses } from '@nino/ds/mergeClasses'
import { RemoveUnitModal } from '@organisms/RemoveUnitModal/RemoveUnitModal'
import { UnitRow } from '@organisms/UnitRow/UnitRow'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useRemoveTenant } from '@hooks/store/useRemoveTenant'
import { useTenantDetail } from '@hooks/store/useTenantDetail'
import { useUnitLimit } from '@hooks/store/useUnitLimit'
import { riseDelay } from '@utils/rise-delay'

import styles from './SettingsUnitSection.module.css'
import motion from '@styles/motion.module.css'
import card from '@styles/settingsCard.module.css'

export const SettingsUnitSection = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const { data: unit } = useTenantDetail(tenantId)
  const { mutate: removeUnit, isPending: isRemoving } = useRemoveTenant()
  const [confirming, setConfirming] = useState<{
    id: string
    name: string
  } | null>(null)
  const units = useCompanyGroups().flatMap(({ units: list }) => list)
  const { limit, planName, isFull, isPending } = useUnitLimit(units.length)
  const unitDetailTo = (unitTenantId: string) =>
    unitTenantId === tenantId
      ? 'detalhe'
      : `/${unitTenantId}/configuracoes/unidade/detalhe`

  if (isPending) return <Skeleton className={styles.skeleton} />

  return (
    <section className={card.panel}>
      <Flexbox
        as="header"
        gap={3}
        align="start"
        justify="between"
        wrap
        mb={4}
        className={motion.unroll}
      >
        <Flexbox direction="column">
          <Heading level={2} size="xl">
            Lojas da empresa
          </Heading>

          <Text size="sm" color="subtle" mt={1}>
            {limit === null
              ? `${units.length} em operação, sem limite no seu plano.`
              : `${units.length} de ${limit} inclusas no plano ${planName}.`}
          </Text>
        </Flexbox>

        {!isFull && (
          <Button asChild className={mergeClasses(motion.press, styles.add)}>
            <Link to={`/${tenantId}/unidades/nova`}>Abrir unidade</Link>
          </Button>
        )}
      </Flexbox>

      {units.length === 0 && (
        <EmptyState>Nenhuma loja cadastrada.</EmptyState>
      )}

      <Flexbox as="ul" direction="column">
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
      </Flexbox>

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
        <Text size="sm" className={styles.full}>
          O plano {planName} cobre {limit}{' '}
          {limit === 1 ? 'unidade' : 'unidades'}. Para abrir outra, fale com a
          gente sobre a próxima faixa.
        </Text>
      )}
    </section>
  )
}
