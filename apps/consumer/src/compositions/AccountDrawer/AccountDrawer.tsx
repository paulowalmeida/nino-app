import { useLocation, useNavigate } from 'react-router'

import { Drawer } from '@nino/ds/components/Drawer'
import { Icon } from '@components/Icon/Icon'
import { ACCOUNT_SECTIONS } from '@constants/account-sections'
import { useCustomerSession } from '@hooks/useCustomerSession'
import { useLogout } from '@hooks/useLogout'
import { useMyAddresses } from '@hooks/useMyAddresses'
import { useMyOrders } from '@hooks/useMyOrders'
import { firstName, greeting } from '@utils/greeting'

import chevronIcon from '@assets/icons/chevron-right.svg?raw'
import logoutIcon from '@assets/icons/logout.svg?raw'

import type { AccountDrawerProps } from './AccountDrawer.types'

import styles from './AccountDrawer.module.css'

/**
 * A conta do freguês no celular: a gaveta que o "Perfil" da barra abre.
 *
 * É o mesmo índice que o desktop mostra como coluna ao lado do painel, e lê
 * das mesmas `ACCOUNT_SECTIONS` — uma fonte de verdade, duas formas. No
 * celular a coluna vira gaveta porque a barra de baixo já é o lugar onde o
 * polegar procura navegação; empurrar a pessoa para uma tela-índice inteira
 * só para escolher uma gaveta é um passo a mais antes do que ela veio fazer.
 *
 * Abre pela esquerda: a direita é da sacola, e as duas gavetas da loja não
 * podem chegar do mesmo lado sem virarem a mesma coisa na memória da mão.
 */
export const AccountDrawer = ({
  open,
  onOpenChange,
  base,
}: AccountDrawerProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { customer } = useCustomerSession()
  const logout = useLogout()

  const { data: orders } = useMyOrders(!!customer)
  const { data: addresses } = useMyAddresses(!!customer)

  const counts: Record<string, number | undefined> = {
    enderecos: addresses?.length,
    pedidos: orders?.length,
  }

  /* conta aberta por telefone nasce sem nome de verdade: até a pessoa dizer
     como se chama, a saudação vai sozinha */
  const name = customer?.profileCompletedAt ? firstName(customer.name) : null

  const go = (to: string) => {
    onOpenChange(false)
    navigate(to)
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      placement="left"
      size="19rem"
      contentClassName={styles.panel}
    >
      <div className={styles.head}>
        <p className={styles.greeting}>{greeting()}</p>
        {/* conta aberta por telefone ainda não tem nome: a saudação fica
            sozinha em vez de devolver o número cru no lugar dele */}
        {name && <p className={styles.name}>{name}</p>}
      </div>

      {customer ? (
        <>
          <nav className={styles.nav} aria-label="Seções da conta">
            <ul className={styles.list}>
              {ACCOUNT_SECTIONS.map(({ to, label, icon, soon }) => {
                const href = `${base}/conta/${to}`

                return (
                  <li key={to}>
                    <button
                      type="button"
                      onClick={() => go(href)}
                      aria-current={pathname === href ? 'page' : undefined}
                      className={
                        pathname === href
                          ? `${styles.item} ${styles.itemOn}`
                          : styles.item
                      }
                    >
                      <Icon svg={icon} className={styles.icon} />
                      <span className={styles.label}>{label}</span>

                      {soon ? (
                        <span className={styles.soon}>em breve</span>
                      ) : (
                        counts[to] !== undefined && (
                          <span className={styles.count}>{counts[to]}</span>
                        )
                      )}
                      <Icon svg={chevronIcon} className={styles.chevron} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <button
            type="button"
            className={styles.logout}
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            <Icon svg={logoutIcon} className={styles.icon} />
            {logout.isPending ? 'Saindo…' : 'Sair da conta'}
          </button>
        </>
      ) : (
        /* visitante é estado normal aqui: a loja inteira funciona sem conta,
           então a gaveta diz o que a conta guarda em vez de barrar o caminho */
        <div className={styles.guest}>
          <p className={styles.guestText}>
            Entre para acompanhar seus pedidos e salvar endereços de entrega.
          </p>
          <button
            type="button"
            className={styles.enter}
            onClick={() => go(`${base}/entrar`)}
          >
            Entrar
          </button>
        </div>
      )}
    </Drawer>
  )
}
