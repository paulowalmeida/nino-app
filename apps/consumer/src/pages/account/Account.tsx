import { Link, Navigate, Outlet, useLocation, useParams } from 'react-router'

import { useCustomerSession } from '@hooks/useCustomerSession'
import { useLogout } from '@hooks/useLogout'
import { useMyAddresses } from '@hooks/useMyAddresses'
import { useMyOrders } from '@hooks/useMyOrders'
import { useScrollProgress } from '@hooks/useScrollProgress'
import { useStoreTint } from '@hooks/useStoreTint'
import { firstName } from '@utils/customer-name'
import { greeting } from '@utils/greeting'
import { riseDelay } from '@utils/rise-delay'

import { PoweredBy } from '@compositions/PoweredBy/PoweredBy'
import { TabBar } from '@compositions/TabBar/TabBar'

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
  const progress = useScrollProgress(60)
  const tint = useStoreTint()

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

  /* conta aberta por telefone nasce sem nome de verdade: até a pessoa dizer
     como se chama, a saudação vai sozinha */
  const name = customer.profileCompletedAt ? firstName(customer.name) : null

  /* a cor da loja também vale aqui dentro: a conta é do freguês, mas é a
     conta dele nesta loja, e o foco dos campos e a seção aberta são os
     lugares onde essa marca aparece */
  return (
    <div
      className={styles.page}
      style={
        {
          '--p': progress,
          ...(tint ? { '--store-tint': tint } : {}),
        } as React.CSSProperties
      }
    >
      <div className={styles.shell}>
        <header className={`${motion.settle} ${styles.header}`}>
          <Link
            to={home}
            className={`${motion.press} ${styles.back}`}
            aria-label="Voltar para a loja"
          >
            ←
          </Link>

          {/* a saudação é a mesma da gaveta do celular: a casa cumprimenta
            quem chegou. Conta aberta por telefone ainda não tem nome — aí a
            saudação fica sozinha, sem devolver o número cru no lugar dele */}
          <div className={styles.identity}>
            <h1 className={styles.title}>
              {greeting()}
              {name ? `, ${name}` : ''}
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
            className={`${motion.settle} ${styles.panel}`}
            style={riseDelay(60)}
          >
            <Outlet />
          </div>
        </div>

      </div>

      <PoweredBy />

      <TabBar base={slug ? `/${slug}` : ''} />
    </div>
  )
}
