import { Text } from '@nino/ds/components/Text'
import { useStoreTracking } from '@hooks/useStoreTracking/useStoreTracking'
import { riseDelay } from '@utils/rise-delay'

import styles from './OrderTrackingReassurance.module.css'
import motion from '@styles/motion.module.css'

/*
 * A promessa que solta a pessoa da tela. Vem logo abaixo do cartão vivo
 * porque a pergunta seguinte a "quanto falta" é "preciso ficar olhando?".
 */
export const OrderTrackingReassurance = () => {
  const { waitingMessage } = useStoreTracking()

  return (
    <Text
      as="p"
      className={`${motion.riseIn} ${styles.reassurance}`}
      style={riseDelay(120)}
    >
      <Text as="span" className={styles.whatsappDot} aria-hidden="true" />
      {waitingMessage ??
        'Pode fechar esta tela. A gente avisa no WhatsApp a cada passo.'}
    </Text>
  )
}
