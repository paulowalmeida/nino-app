import { Flexbox } from '@nino/ds/components/Flexbox'
import { useState } from 'react'
import { Link } from 'react-router'

import { Badge } from '@nino/ds/components/Badge'
import { Button } from '@nino/ds/components/Button'
import { Skeleton } from '@nino/ds/components/Skeleton'
import { useSubscription } from '@hooks/account/useSubscription'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { RemoveUnitModal } from '@compositions/RemoveUnitModal/RemoveUnitModal'
import { useRemoveTenant } from '@hooks/store/useRemoveTenant'
import { useTenantDetail } from '@hooks/store/useTenantDetail'
import { riseDelay } from '@utils/rise-delay'

import styles from './SettingsUnitSection.module.css'
import motion from '@styles/motion.module.css'
import card from '@styles/settingsCard.module.css'

/**
 * A lista das lojas, não o formulário de uma delas: a linha leva ao detalhe
 * e a tela cabe de uma vez. O plano diz quantas cabem, então o limite
 * aparece antes de virar erro da API.
 */
export const SettingsUnitSection = () => {
  const current = useCurrentTenant()
  const tenantId = current?.tenantId ?? null

  const { data: unit } = useTenantDetail(tenantId)
  const { mutate: removeUnit, isPending: isRemoving } = useRemoveTenant()
  const { data: subscription, isPending: isSubscriptionPending } =
    useSubscription()

  /* a loja escolhida vive aqui até a modal confirmar: o nome vai junto do id
     porque é ele que a pessoa vai ter de digitar para fechar */
  const [confirming, setConfirming] = useState<{
    id: string
    name: string
  } | null>(null)

  const units = useCompanyGroups().flatMap(({ units: list }) => list)
  const limit = subscription?.plan.maxTenants ?? null
  const isFull = limit !== null && units.length >= limit

  if (isSubscriptionPending) return <Skeleton className={styles.skeleton} />

  return (
    <section className={card.panel}>
      <Flexbox as="header" gap={3} align="start" justify="between" wrap mb={4} className={motion.unroll}>
        <div>
          <h2 className={card.title}>Lojas da empresa</h2>
          <p className={card.hint}>
            {limit === null
              ? `${units.length} em operação, sem limite no seu plano.`
              : `${units.length} de ${limit} inclusas no plano ${
                  subscription?.plan.name ?? ''
                }.`}
          </p>
        </div>

        {!isFull && (
          <Button asChild className={`${motion.press} ${styles.add}`}>
            <Link to="../../unidades/nova" relative="path">
              Abrir unidade
            </Link>
          </Button>
        )}
      </Flexbox>

      <Flexbox as="ul" direction="column">
        {units.map(({ tenantId: id, tenantName, companyName }, index) => {
          const isHere = id === tenantId

          return (
            <li
              key={id}
              className={`${motion.deal} ${styles.item}`}
              style={riseDelay(index * 40 + 60)}
            >
              <Link
                to={isHere ? 'detalhe' : `/${id}/configuracoes/unidade/detalhe`}
                className={`${motion.lift} ${styles.unit}`}
              >
                <span className={styles.name}>
                  {tenantName}
                  {isHere && (
                    <Badge variant="brand" size="sm">
                      aqui
                    </Badge>
                  )}
                  {isHere && unit?.isMain && (
                    <Badge size="sm">matriz</Badge>
                  )}
                </span>
                <span className={styles.company}>{companyName}</span>
              </Link>

              {!isHere && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${motion.press} ${styles.remove}`}
                  onClick={() => setConfirming({ id, name: tenantName })}
                >
                  Excluir
                </Button>
              )}
            </li>
          )
        })}
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
        <p className={styles.full}>
          O plano {subscription?.plan.name} cobre {limit}{' '}
          {limit === 1 ? 'unidade' : 'unidades'}. Para abrir outra, fale com a
          gente sobre a próxima faixa.
        </p>
      )}
    </section>
  )
}
