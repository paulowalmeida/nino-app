import { useLocation, useNavigate } from 'react-router'

import { Drawer } from '@nino/ds/components/Drawer'
import { Icon } from '@components/Icon/Icon'
import { ACCOUNT_SECTIONS } from '@constants/account-sections'
import { useCustomerSession } from '@hooks/useCustomerSession'
import { useLogout } from '@hooks/useLogout'
import { useMyAddresses } from '@hooks/useMyAddresses'
import { useMyOrders } from '@hooks/useMyOrders'
import { useStoreTint } from '@hooks/useStoreTint'
import { firstName, initials } from '@utils/customer-name'
import { greeting } from '@utils/greeting'
import { riseDelay } from '@utils/rise-delay'

import logoutIcon from '@assets/icons/logout.svg?raw'
import userIcon from '@assets/icons/user.svg?raw'

import type { AccountDrawerProps } from './AccountDrawer.types'

import styles from './AccountDrawer.module.css'
import motion from '@styles/motion.module.css'

const since = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

/**
 * A caderneta do freguês — a gaveta que o "Perfil" da barra abre no celular.
 *
 * Caderneta e não "menu de configurações": é o caderninho do balcão, onde a
 * casa anota quem é de casa. Por isso ela abre com a pessoa (azulejo, nome,
 * desde quando é freguesa) e só depois lista as gavetas — um menu que começa
 * por "Dados pessoais" trata o dono da conta como item de formulário.
 *
 * O azulejo rima com o da loja na vitrine de propósito: a mesma peça, a mesma
 * moldura branca. De um lado o balcão se apresenta, do outro o freguês.
 *
 * O que ainda não existe fica num segundo grupo sob um "em breve" dito uma
 * vez, em vez de repetir o selo em cada linha. A lista não tem seta: seta em
 * toda linha de menu é ruído que não diz nada que o toque já não diga.
 *
 * Abre pela esquerda porque a direita é da sacola — duas gavetas chegando do
 * mesmo lado viram a mesma coisa na memória da mão.
 */
export const AccountDrawer = ({
  open,
  onOpenChange,
  base,
}: AccountDrawerProps) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { customer } = useCustomerSession()
  const tint = useStoreTint()
  const logout = useLogout()

  const { data: orders } = useMyOrders(!!customer)
  const { data: addresses } = useMyAddresses(!!customer)

  const counts: Record<string, number | undefined> = {
    enderecos: addresses?.length,
    pedidos: orders?.length,
  }

  /* conta aberta por telefone nasce sem nome de verdade: até a pessoa dizer
     como se chama, a saudação vai sozinha e o azulejo fica sem iniciais */
  const named = customer?.profileCompletedAt ? customer.name : null
  const name = firstName(named)
  const mark = initials(named)

  const ready = ACCOUNT_SECTIONS.filter((section) => !section.soon)
  const soon = ACCOUNT_SECTIONS.filter((section) => section.soon)

  const go = (to: string) => {
    onOpenChange(false)
    navigate(to)
  }

  const item = (to: string, label: string, icon: string, index: number) => {
    const href = `${base}/conta/${to}`
    const isOn = pathname === href
    const className = isOn ? `${styles.item} ${styles.itemOn}` : styles.item

    return (
      <li key={to}>
        <button
          type="button"
          onClick={() => go(href)}
          aria-current={isOn ? 'page' : undefined}
          className={`${motion.deal} ${className}`}
          style={riseDelay(120 + index * 45)}
        >
          <Icon svg={icon} className={styles.icon} />
          <span className={styles.label}>{label}</span>
          {counts[to] !== undefined && (
            <span className={styles.count}>{counts[to]}</span>
          )}
        </button>
      </li>
    )
  }

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      placement="left"
      size="19.5rem"
      contentClassName={styles.panel}
      bodyClassName={styles.body}
    >
      {/* a gaveta sai por um portal, fora da árvore da página: a cor da loja
          precisa ser declarada de novo aqui para chegar às peças de dentro */}
      <div
        className={styles.tint}
        style={tint ? ({ '--store-tint': tint } as React.CSSProperties) : {}}
      >
        <header className={styles.head}>
          <div className={`${motion.land} ${styles.tile}`}>
            {mark ?? <Icon svg={userIcon} className={styles.tileIcon} />}
          </div>

          <p
            className={`${motion.deal} ${styles.greeting}`}
            style={riseDelay(60)}
          >
            {greeting()}
            {name ? ',' : ''}
          </p>

          {name && (
            <p
              className={`${motion.deal} ${styles.name}`}
              style={riseDelay(90)}
            >
              {name}
            </p>
          )}

          {customer && (
            <p
              className={`${motion.deal} ${styles.since}`}
              style={riseDelay(120)}
            >
              na casa desde {since.format(new Date(customer.createdAt))}
            </p>
          )}
        </header>

        {customer ? (
          <>
            <nav className={styles.nav} aria-label="Seções da conta">
              <ul className={styles.list}>
                {ready.map(({ to, label, icon }, index) =>
                  item(to, label, icon, index)
                )}
              </ul>

              {/* dito uma vez, no alto do grupo: o selo repetido em cada linha
                  dizia três vezes a mesma coisa e roubava a leitura do nome */}
              <p className={styles.eyebrow}>em breve</p>

              <ul className={`${styles.list} ${styles.listSoon}`}>
                {soon.map(({ to, label, icon }, index) =>
                  item(to, label, icon, ready.length + index)
                )}
              </ul>
            </nav>

            <div className={styles.foot}>
              <button
                type="button"
                className={`${motion.press} ${styles.logout}`}
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
              >
                <Icon svg={logoutIcon} className={styles.icon} />
                {logout.isPending ? 'Saindo…' : 'Sair da conta'}
              </button>
            </div>
          </>
        ) : (
          /* visitante é estado normal aqui: a loja inteira funciona sem conta,
             então a gaveta diz o que a conta guarda em vez de barrar caminho */
          <div className={styles.guest}>
            <p className={styles.guestText}>
              Entre para acompanhar seus pedidos e guardar seus endereços de
              entrega.
            </p>
            <button
              type="button"
              className={`${motion.press} ${styles.enter}`}
              onClick={() => go(`${base}/entrar`)}
            >
              Entrar
            </button>
          </div>
        )}
      </div>
    </Drawer>
  )
}
