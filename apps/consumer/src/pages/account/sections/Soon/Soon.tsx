import { Icon, type IconName } from '@nino/ds/components/Icon'

import styles from './Soon.module.css'
import section from '../section.module.css'

type SoonProps = {
  eyebrow: string
  headline: string
  note: string
  icon: IconName
}

/**
 * A gaveta que ainda não tem nada dentro. Ela abre e diz o que vai guardar,
 * em vez de sumir do menu: quem procurou "meios de pagamento" e não achou
 * volta a procurar; quem achou e leu "em breve" para de procurar.
 */
export const Soon = ({ eyebrow, headline, note, icon }: SoonProps) => (
  <div>
    <p className={section.eyebrow}>{eyebrow}</p>
    <h2 className={section.headline}>{headline}</h2>

    <div className={styles.card}>
      <Icon name={icon} className={styles.icon} />
      <p className={styles.note}>{note}</p>
      <span className={styles.tag}>Em breve</span>
    </div>
  </div>
)
