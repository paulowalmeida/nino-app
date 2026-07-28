import { Link, Navigate, Outlet, useLocation, useParams } from 'react-router'

import { useCustomerSession } from '@hooks/useCustomerSession'
import { useLogout } from '@hooks/useLogout'
import { useMyAddresses } from '@hooks/useMyAddresses'
import { useMyOrders } from '@hooks/useMyOrders'
import { formatPhone } from '@utils/phone'
import { riseDelay } from '@utils/rise-delay'

import { AccountNav } from './AccountNav/AccountNav'

import styles from './Account.module.css'
import motion from '@styles/motion.module.css'

const since = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

/**
 * A conta do cliente é a caderneta dele nesta loja: quem ele é, para onde
 * entregar, o que já pediu. O índice fica sempre à vista e cada gaveta é uma
 * rota — a URL é o estado, então voltar e recarregar caem onde a pessoa
 * estava, e cada painel fica curto o bastante para caber numa tela.
 */
export const Account = () => {
  const { slug } = useParams()
  const { pathname } = useLocation()
  const home = slug ? `/${slug}` : '/'
  const base = slug ? `/${slug}/conta` : '/conta'
  const signIn = slug ? `/${slug}/entrar` : '/entrar'

  const { customer, isPending } = useCustomerSession()
  const logout = useLogout()

  const { data: orders } = useMyOrders(!!customer)
  const { data: addresses } = useMyAddresses(!!customer)

  if (isPending) {
    return (
      <div className={styles.page} aria-busy="true" aria-label="Carregando">
        <div className={styles.skHeader} />
        <div className={styles.skBody} />
      </div>
    )
  }

  if (!customer) return <Navigate to={signIn} replace />

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={`${motion.riseIn} ${styles.header}`}>
          <Link
            to={home}
            className={`${motion.press} ${styles.back}`}
            aria-label="Voltar para a loja"
          >
            ←
          </Link>

          {/* conta aberta por telefone nasce com o número no lugar do nome —
            mostrar o cru seria devolver à pessoa o que ela ainda não disse */}
          <div className={styles.identity}>
            <h1 className={styles.title}>
              {customer.profileCompletedAt
                ? customer.name
                : formatPhone(customer.phone)}
            </h1>
            <p className={styles.since}>
              na casa desde {since.format(new Date(customer.createdAt))}
            </p>
          </div>
        </header>

        <div className={styles.body}>
          <AccountNav
            base={base}
            counts={{
              enderecos: addresses?.length,
              pedidos: orders?.length,
            }}
            onLogout={() => logout.mutate()}
            isLoggingOut={logout.isPending}
          />

          {/* a key reanima o painel a cada troca, como uma tela nova */}
          <div
            key={pathname}
            className={`${motion.riseIn} ${styles.panel}`}
            style={riseDelay(60)}
          >
            <Outlet />
          </div>
        </div>

        <button
          type="button"
          className={`${motion.press} ${styles.logoutMobile}`}
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
        >
          {logout.isPending ? 'Saindo…' : 'Sair da conta'}
        </button>
      </div>
    </div>
  )
}
