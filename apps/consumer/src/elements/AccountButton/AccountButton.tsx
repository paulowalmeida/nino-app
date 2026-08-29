import { Link } from 'react-router'

import {
  useCustomerSession,
} from '@shared/hooks/useCustomerSession/useCustomerSession'
import { formatPhone } from '@utils/phone'

import styles from './AccountButton.module.css'

type AccountButtonProps = {
  /** Slug da loja no caminho — vazio quando a vitrine roda em subdomínio. */
  slug: string
}

/** Duas letras é o que cabe no botão e o bastante para reconhecer a si mesmo. */
const initialsOf = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')

/**
 * O acesso à conta mora no topo, do lado da lupa: é ferramenta de navegação,
 * não oferta. Quem nunca entrou vê "Entrar" por extenso — um ícone de pessoa
 * sozinho não diz o que acontece ao tocar; quem já entrou vê as próprias
 * iniciais, que confirmam de quem é a sessão sem ocupar a largura do nome.
 */
export const AccountButton = ({ slug }: AccountButtonProps) => {
  const { customer, isPending } = useCustomerSession()

  if (isPending) return <span className={styles.placeholder} aria-hidden />

  const base = slug ? `/${slug}` : ''

  if (!customer) {
    return (
      <Link to={`${base}/entrar`} className={styles.signIn}>
        Entrar
      </Link>
    )
  }

  const label = customer.profileCompletedAt
    ? customer.name
    : formatPhone(customer.phone)

  return (
    <Link
      to={`${base}/conta`}
      className={styles.avatar}
      aria-label={`Sua conta — ${label}`}
    >
      {customer.profileCompletedAt ? initialsOf(customer.name) : '☺'}
    </Link>
  )
}
