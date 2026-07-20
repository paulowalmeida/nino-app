import { Link } from 'react-router'

import { UnitCard } from '@compositions/UnitCard'
import { useCompanyGroups } from '@hooks/session/useCompanyGroups'
import { useCurrentTenant } from '@hooks/session/useCurrentTenant'
import { useSaveTenant, useTenantDetail } from '@hooks/store/useTenantDetail'
import { riseDelay } from '@utils/rise-delay'

import styles from './UnitSection.module.css'
import motion from '@styles/motion.module.css'
import card from '@styles/settingsCard.module.css'

/**
 * Edita a unidade aberta e lista as irmãs: trocar de loja é o mesmo gesto do
 * seletor no menu, então aqui a outra unidade é só um link.
 */
export const UnitSection = () => {
  const tenantId = useCurrentTenant()?.tenantId ?? null
  const groups = useCompanyGroups()

  const { data: unit, isPending } = useTenantDetail(tenantId)
  const { mutate: save, isPending: isSaving } = useSaveTenant(tenantId)

  const others = groups
    .flatMap(({ units }) => units)
    .filter(({ tenantId: id }) => id !== tenantId)

  return (
    <div className={styles.stack}>
      <UnitCard
        unit={unit}
        isPending={isPending}
        isSaving={isSaving}
        onSave={save}
      />

      {others.length > 0 && (
        <section className={card.card}>
          <header className={`${motion.unroll} ${card.head}`}>
            <h2 className={card.title}>Outras unidades</h2>
            <p className={card.hint}>
              Abrir outra unidade troca a loja em todo o painel.
            </p>
          </header>

          <ul className={styles.list}>
            {others.map(({ tenantId: id, tenantName, companyName }, index) => (
              <li
                key={id}
                className={`${motion.deal} ${styles.item}`}
                style={riseDelay(index * 45 + 60)}
              >
                <Link
                  to={`/${id}/configuracoes/unidade`}
                  className={`${motion.lift} ${styles.link}`}
                >
                  <span className={styles.name}>{tenantName}</span>
                  <span className={styles.company}>{companyName}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
