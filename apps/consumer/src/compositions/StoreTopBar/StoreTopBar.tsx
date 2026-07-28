import { useNavigate } from 'react-router'

import { Menu } from '@nino/ds/components/Menu'
import { Icon } from '@components/Icon/Icon'
import { useCustomerSession } from '@hooks/useCustomerSession'
import { useLogout } from '@hooks/useLogout'
import { displayName, initials } from '@utils/store-info'
import { formatPhone } from '@utils/phone'

import bagIcon from '@assets/icons/bag.svg?raw'
import cardIcon from '@assets/icons/credit-card.svg?raw'
import logoutIcon from '@assets/icons/logout.svg?raw'
import pinIcon from '@assets/icons/map-pin.svg?raw'
import searchIcon from '@assets/icons/search.svg?raw'
import userIcon from '@assets/icons/user.svg?raw'

import type { StoreTopBarProps } from './StoreTopBar.types'

import styles from './StoreTopBar.module.css'

/**
 * A faixa que não sai da tela: identidade da loja à esquerda, sacola e conta
 * à direita.
 *
 * A conta abre um menu, não uma página. Quem quer ver os pedidos não deveria
 * ter que entrar num perfil e procurar a aba — os destinos são atalhos aqui, e
 * a tela de perfil com menu lateral só aparece depois que a pessoa escolhe um
 * deles.
 */
export const StoreTopBar = ({
  store,
  slug,
  cartCount,
  onCart,
  progress,
  searchable,
  search,
  onSearchChange,
}: StoreTopBarProps) => {
  const navigate = useNavigate()
  const { customer } = useCustomerSession()
  const logout = useLogout()

  const base = slug ? `/${slug}` : ''
  const go = (path: string) => () => void navigate(`${base}${path}`)

  const named = customer?.profileCompletedAt
    ? customer.name
    : formatPhone(customer?.phone ?? '')

  return (
    <header
      className={styles.bar}
      style={{ '--p': progress } as React.CSSProperties}
    >
      <div className={styles.inner}>
        {/*
         * A logo aqui é a outra ponta do azulejo grande do banner: enquanto
         * ele encolhe e some ao rolar, esta cresce e aparece na mesma margem
         * esquerda. A pessoa lê como uma peça só, que se acomodou no topo.
         */}
        <a href={base || '/'} className={styles.brand}>
          <span className={styles.logo}>
            {store.logoUrl ? (
              <img src={store.logoUrl} alt="" className={styles.logoImg} />
            ) : (
              initials(store)
            )}
          </span>
          <span className={styles.storeName}>{displayName(store)}</span>
        </a>

        {/* a busca não sai de cena: ela migra da página para o topo, e quem
            rolou até o fim do cardápio não precisa voltar para procurar */}
        {searchable && (
          <div className={styles.search}>
            <Icon svg={searchIcon} className={styles.searchIcon} />
            <input
              type="search"
              aria-label="Buscar no cardápio"
              placeholder="Buscar no cardápio"
              className={styles.searchInput}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        )}

        <div className={styles.tools}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={onCart}
            aria-label={`Sacola com ${cartCount} ${
              cartCount === 1 ? 'item' : 'itens'
            }`}
          >
            <Icon svg={bagIcon} />
            {cartCount > 0 && (
              <span className={styles.badge}>{cartCount}</span>
            )}
          </button>

          {customer ? (
            <Menu
              contentClassName={styles.menuPanel}
              trigger={
                <button
                  type="button"
                  className={styles.account}
                  aria-label={`Sua conta — ${named}`}
                >
                  <Icon svg={userIcon} />
                  <span className={styles.accountName}>{named}</span>
                </button>
              }
              items={[
                {
                  value: 'orders',
                  label: 'Pedidos',
                  icon: <Icon svg={bagIcon} />,
                  onSelect: go('/conta/pedidos'),
                },
                {
                  value: 'addresses',
                  label: 'Endereços',
                  icon: <Icon svg={pinIcon} />,
                  onSelect: go('/conta/enderecos'),
                },
                {
                  value: 'payment',
                  label: 'Pagamento',
                  icon: <Icon svg={cardIcon} />,
                  onSelect: go('/conta/pagamento'),
                },
                {
                  value: 'profile',
                  label: 'Meus dados',
                  icon: <Icon svg={userIcon} />,
                  onSelect: go('/conta/dados'),
                },
                { separator: true },
                {
                  value: 'logout',
                  label: 'Sair',
                  icon: <Icon svg={logoutIcon} />,
                  destructive: true,
                  onSelect: () => logout.mutate(),
                },
              ]}
            />
          ) : (
            <button
              type="button"
              className={styles.signIn}
              onClick={go('/entrar')}
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
