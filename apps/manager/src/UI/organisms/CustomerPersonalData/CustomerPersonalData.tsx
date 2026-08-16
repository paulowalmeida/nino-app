import { maskCpf } from '@nino/ds/masks'
import type { CustomerHistory } from '@custom_types/customer/customer-history'
import { formatPhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'

import styles from './CustomerPersonalData.module.css'
import motion from '@styles/motion.module.css'

type CustomerPersonalDataProps = {
  customer: CustomerHistory
}

export const CustomerPersonalData = ({
  customer,
}: CustomerPersonalDataProps) => (
  <section aria-label="Dados pessoais">
    <p className={styles.eyebrow}>Dados pessoais</p>

    <dl className={styles.facts}>
      {[
        ['Telefone', formatPhone(customer.phone)],
        ['E-mail', customer.email ?? '—'],
        ['CPF', customer.cpf ? maskCpf(customer.cpf) : '—'],
      ].map(([label, value], index) => (
        <div
          key={label}
          className={`${motion.settle} ${styles.fact}`}
          style={riseDelay(index * 50 + 60)}
        >
          <dt className={styles.factLabel}>{label}</dt>
          <dd className={styles.factValue}>{value}</dd>
        </div>
      ))}
    </dl>
  </section>
)
