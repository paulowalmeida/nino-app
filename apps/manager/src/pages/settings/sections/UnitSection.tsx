import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@nino/ds'

import { useSubscription } from '@hooks/account/useSubscription'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useRemoveTenant, useTenantDetail } from '@hooks/store/useTenantDetail'
import { riseDelay } from '@utils/rise-delay'

import styles from './UnitSection.module.css'
import motion from '@styles/motion.module.css'
import card from '@styles/settingsCard.module.css'

/**
 * A lista das lojas, não o formulário de uma delas: a linha leva ao detalhe
 * e a tela cabe de uma vez. O plano diz quantas cabem, então o limite
 * aparece antes de virar erro da API.
 */
export const UnitSection = () => {
  const current = useCurrentTenant()
  const tenantId = current?.tenantId ?? null

  const { data: unit } = useTenantDetail(tenantId)
  const { mutate: removeUnit, isPending: isRemoving } = useRemoveTenant()
  const { data: subscription } = useSubscription()

  const [confirming, setConfirming] = useState<string | null>(null)

  const units = useCompanyGroups().flatMap(({ units: list }) => list)
  const limit = subscription?.plan.maxTenants ?? null
  const isFull = limit !== null && units.length >= limit

  return (
    <section className={card.card}>
      <header className={`${motion.unroll} ${styles.head}`}>
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
      </header>

      <ul className={styles.list}>
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
                  {isHere && <span className={styles.here}>aqui</span>}
                  {isHere && unit?.isMain && (
                    <span className={styles.main}>matriz</span>
                  )}
                </span>
                <span className={styles.company}>{companyName}</span>
              </Link>

              {!isHere &&
                (confirming === id ? (
                  <div className={styles.confirm}>
                    <Button
                      size="sm"
                      loading={isRemoving}
                      className={motion.press}
                      onClick={() => removeUnit(id)}
                    >
                      Fechar loja
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirming(null)}
                    >
                      Voltar
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`${motion.press} ${styles.remove}`}
                    onClick={() => setConfirming(id)}
                  >
                    Fechar
                  </Button>
                ))}
            </li>
          )
        })}
      </ul>

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
