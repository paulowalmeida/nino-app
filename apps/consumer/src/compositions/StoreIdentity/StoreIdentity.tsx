import { Image } from '@nino/ds/components/Image'
import { displayName, initials } from '@utils/store-info'
import { riseDelay } from '@utils/rise-delay'
import type { Store } from '@custom_types/store/store'

import styles from './StoreIdentity.module.css'
import motion from '@styles/motion.module.css'

type StoreIdentityProps = {
  store: Store
  isStoreOpen: boolean
  estimatedMinutes?: number
  onShowInfo: () => void
}

/**
 * O azulejo sobe sobre o banner: costura as duas faixas e dá à logo o
 * tamanho que ela merece sem roubar altura da página. Some sem classe de
 * entrada — o `transform` dele já está ligado ao progresso da rolagem, e uma
 * animação com fill both congelaria o valor final por cima dele, matando o
 * merge com o topo.
 */
export const StoreIdentity = ({
  store,
  isStoreOpen,
  estimatedMinutes,
  onShowInfo,
}: StoreIdentityProps) => (
  <div className={styles.identityRow}>
    <div className={styles.logoTile}>
      <Image
        src={store.logoUrl}
        alt=""
        className={styles.logoImg}
        placeholder={
          <span className={styles.logoFallback}>{initials(store)}</span>
        }
      />
    </div>

    <div className={styles.identity}>
      <h1 className={`${motion.deal} ${styles.name}`}>{displayName(store)}</h1>
      <p className={`${motion.deal} ${styles.identityMeta}`} style={riseDelay(70)}>
        <button type="button" className={styles.more} onClick={onShowInfo}>
          Ver mais
        </button>
        <span className={styles.sep}>·</span>
        <span className={styles.status}>
          <span
            className={isStoreOpen ? `${styles.dot} ${styles.dotOn}` : styles.dot}
            aria-hidden="true"
          />
          {isStoreOpen ? 'Aberto agora' : 'Fechado'}
        </span>
        <span className={styles.sep}>·</span>
        <span className={styles.time}>~{estimatedMinutes} min</span>
      </p>
    </div>
  </div>
)
