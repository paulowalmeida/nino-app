import { Text } from '@nino/ds/components/Text'
import { riseDelay } from '@utils/rise-delay'

import styles from './OrderTrackingReassurance.module.css'
import motion from '@styles/motion.module.css'

/*
 * A promessa que solta a pessoa da tela. Vem logo abaixo do cartão vivo
 * porque a pergunta seguinte a "quanto falta" é "preciso ficar olhando?".
 */
export const OrderTrackingReassurance = () => (
  <Text
    as="p"
    className={`${motion.riseIn} ${styles.reassurance}`}
    style={riseDelay(120)}
  >
    <Text as="span" className={styles.whatsappDot} aria-hidden="true" />
    Pode fechar esta tela. A gente avisa no WhatsApp a cada passo.
  </Text>
)
