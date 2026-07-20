import { useState } from 'react'
import { Link } from 'react-router'

import { Button } from '@nino/ds'

import { UnitCard } from '@compositions/UnitCard'
import { useSubscription } from '@hooks/account/useSubscription'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import {
  useRemoveTenant,
  useSaveTenant,
  useTenantDetail,
} from '@hooks/store/useTenantDetail'
import { riseDelay } from '@utils/rise-delay'

import styles from './UnitSection.module.css'
import motion from '@styles/motion.module.css'
import card from '@styles/settingsCard.module.css'

/**
 * As lojas da empresa. O plano diz quantas cabem — abrir a próxima é o
 * gesto que faz o cliente subir de faixa, então o limite aparece antes de
 * virar erro da API.
 */
export const UnitSection = () => {
  const current = useCurrentTenant()
  const tenantId = current?.tenantId ?? null
  const groups = useCompanyGroups()

  const { data: unit, isPending } = useTenantDetail(tenantId)
  const { mutate: save, isPending: isSaving } = useSaveTenant(tenantId)
  const { mutate: removeUnit, isPending: isRemoving } = useRemoveTenant()
  const { data: subscription } = useSubscription()

  const [confirming, setConfirming] = useState<string | null>(null)

  const units = groups.flatMap(({ units: list }) => list)
  const others = units.filter(({ tenantId: id }) => id !== tenantId)

  const limit = subscription?.plan.maxTenants ?? null
  const isFull = limit !== null && units.length >= limit

  return (
    <div className={styles.stack}>
      <UnitCard
        unit={unit}
        isPending={isPending}
        isSaving={isSaving}
        onSave={save}
      />

      <section className={card.card}>
        <header className={`${motion.unroll} ${card.head}`}>
          <h2 className={card.title}>Lojas da empresa</h2>
          <p className={card.hint}>
            {limit === null
              ? `${units.length} em operação, sem limite no seu plano.`
              : `${units.length} de ${limit} inclusas no plano ${
                  subscription?.plan.name ?? ''
                }.`}
          </p>
        </header>

        <ul className={styles.list}>
          <li className={`${motion.deal} ${styles.item}`}>
            <div className={styles.unit}>
              <span className={styles.name}>
                {current?.tenantName}
                <span className={styles.here}>você está aqui</span>
              </span>
              <span className={styles.company}>{current?.companyName}</span>
            </div>
          </li>

          {others.map(({ tenantId: id, tenantName, companyName }, index) => (
            <li
              key={id}
              className={`${motion.deal} ${styles.item}`}
              style={riseDelay(index * 45 + 60)}
            >
              <Link
                to={`/${id}/configuracoes/unidade`}
                className={`${motion.lift} ${styles.unit}`}
              >
                <span className={styles.name}>{tenantName}</span>
                <span className={styles.company}>{companyName}</span>
              </Link>

              {confirming === id ? (
                <div className={styles.confirm}>
                  <span className={styles.confirmText}>Fechar esta loja?</span>
                  <Button
                    size="sm"
                    loading={isRemoving}
                    className={motion.press}
                    onClick={() => removeUnit(id)}
                  >
                    Fechar
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
                  Fechar loja
                </Button>
              )}
            </li>
          ))}
        </ul>

        {isFull ? (
          <p className={styles.full}>
            O plano {subscription?.plan.name} cobre {limit}{' '}
            {limit === 1 ? 'unidade' : 'unidades'}. Para abrir outra, fale com
            a gente sobre a próxima faixa.
          </p>
        ) : (
          <Button
            asChild
            className={`${motion.press} ${styles.add}`}
          >
            <Link to="/criar-loja">Abrir nova unidade</Link>
          </Button>
        )}
      </section>
    </div>
  )
}
